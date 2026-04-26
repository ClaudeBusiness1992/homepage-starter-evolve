exports.handler = async (event) => {
  const { code } = event.queryStringParameters || {};

  if (!code) {
    return { statusCode: 400, body: 'Missing code' };
  }

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
      statusCode: 401,
      headers: { 'Content-Type': 'text/html' },
      body: `<script>window.opener.postMessage('authorization:github:error:${data.error}','*');window.close();</script>`,
    };
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'text/html' },
    body: `<script>
      (function() {
        const token = ${JSON.stringify(data.access_token)};
        window.opener.postMessage(
          'authorization:github:success:' + JSON.stringify({ token, provider: 'github' }),
          '*'
        );
        window.close();
      })();
    </script>`,
  };
};
