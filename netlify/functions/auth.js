const SITE_URL = 'https://effervescent-chebakia-6a45c4.netlify.app';

exports.handler = async (event) => {
  const { code, provider } = event.queryStringParameters || {};

  // Step 1: Redirect to GitHub
  if (provider === 'github' && !code) {
    const params = new URLSearchParams({
      client_id: process.env.GITHUB_CLIENT_ID,
      redirect_uri: `${SITE_URL}/.netlify/functions/auth`,
      scope: 'repo',
      state: 'github',
    });
    return {
      statusCode: 302,
      headers: { Location: `https://github.com/login/oauth/authorize?${params}` },
      body: '',
    };
  }

  // Step 2: Exchange code for token
  if (code) {
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      }),
    });

    const data = await response.json();

    if (data.error) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'text/html' },
        body: `<script>window.opener.postMessage('authorization:github:error:${data.error_description}','*');window.close();</script>`,
      };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/html' },
      body: `<script>
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
    };
  }

  return { statusCode: 400, body: 'Bad request' };
};
