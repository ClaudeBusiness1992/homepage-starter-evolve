import { randomBytes } from 'crypto';

export default async function handler(req, res) {
  const { code, state: callbackState, provider } = req.query;
  const SITE_URL = process.env.SITE_URL || `https://${req.headers.host}`;

  // Step 1: Redirect to GitHub — CSRF-State als Cookie sichern
  if (provider === 'github' && !code) {
    const state = randomBytes(16).toString('hex');
    res.setHeader('Set-Cookie', `oauth_state=${state}; HttpOnly; SameSite=Lax; Secure; Path=/api/auth; Max-Age=300`);
    const params = new URLSearchParams({
      client_id: process.env.GITHUB_CLIENT_ID,
      redirect_uri: `${SITE_URL}/api/auth`,
      scope: 'repo',
      state,
    });
    return res.redirect(302, `https://github.com/login/oauth/authorize?${params}`);
  }

  // Step 2: Exchange code for token
  if (code) {
    // CSRF-State validieren
    const cookies = Object.fromEntries(
      (req.headers.cookie || '').split(';')
        .map(c => c.trim().split('='))
        .filter(p => p.length === 2)
        .map(([k, v]) => [k.trim(), decodeURIComponent(v.trim())])
    );
    if (!callbackState || !cookies.oauth_state || callbackState !== cookies.oauth_state) {
      return res.status(403).send('Invalid state — bitte erneut einloggen.');
    }
    res.setHeader('Set-Cookie', 'oauth_state=; HttpOnly; SameSite=Lax; Secure; Path=/api/auth; Max-Age=0');
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      }),
    });

    const data = await response.json();

    if (data.error) {
      res.setHeader('Content-Type', 'text/html');
      const errMsg = JSON.stringify(`authorization:github:error:${data.error_description}`);
      return res.send(
        `<script>window.opener.postMessage(${errMsg},${JSON.stringify(SITE_URL)});window.close();</script>`
      );
    }

    res.setHeader('Content-Type', 'text/html');
    return res.send(`<script>
      (function() {
        const token = ${JSON.stringify(data.access_token)};
        function receiveMessage(e) {
          if (e.data === 'authorizing:github') {
            window.removeEventListener('message', receiveMessage, false);
            window.opener.postMessage(
              'authorization:github:success:' + JSON.stringify({ token, provider: 'github' }),
              e.origin
            );
          }
        }
        window.addEventListener('message', receiveMessage, false);
        window.opener.postMessage('authorizing:github', ${JSON.stringify(SITE_URL)});
      })();
    </script>`);
  }

  res.status(400).send('Bad request');
}
