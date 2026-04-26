export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const provider = url.searchParams.get('provider');
  const SITE_URL = url.origin;

  // Step 1: Redirect to GitHub
  if (provider === 'github' && !code) {
    const params = new URLSearchParams({
      client_id: env.GITHUB_CLIENT_ID,
      redirect_uri: `${SITE_URL}/auth`,
      scope: 'repo',
      state: 'github',
    });
    return Response.redirect(`https://github.com/login/oauth/authorize?${params}`, 302);
  }

  // Step 2: Exchange code for token
  if (code) {
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        client_id: env.GITHUB_CLIENT_ID,
        client_secret: env.GITHUB_CLIENT_SECRET,
        code,
      }),
    });

    const data = await response.json();

    if (data.error) {
      return new Response(
        `<script>window.opener.postMessage('authorization:github:error:${data.error_description}','*');window.close();</script>`,
        { headers: { 'Content-Type': 'text/html' } }
      );
    }

    return new Response(
      `<script>
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
      </script>`,
      { headers: { 'Content-Type': 'text/html' } }
    );
  }

  return new Response('Bad request', { status: 400 });
}
