export default async function handler(req, res) {
  const { code, provider } = req.query;
  const SITE_URL = `https://${req.headers.host}`;

  // Step 1: Redirect to GitHub
  if (provider === 'github' && !code) {
    const params = new URLSearchParams({
      client_id: process.env.GITHUB_CLIENT_ID,
      redirect_uri: `${SITE_URL}/api/auth`,
      scope: 'repo',
      state: 'github',
    });
    return res.redirect(302, `https://github.com/login/oauth/authorize?${params}`);
  }

  // Step 2: Exchange code for token
  if (code) {
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
      return res.send(
        `<script>window.opener.postMessage('authorization:github:error:${data.error_description}','*');window.close();</script>`
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
        window.opener.postMessage('authorizing:github', '*');
      })();
    </script>`);
  }

  res.status(400).send('Bad request');
}
