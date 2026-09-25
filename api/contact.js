const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

module.exports = async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ success: false });
  }

  const requestOrigin = request.headers.origin;
  const requestHost = request.headers.host;
  if (requestOrigin && requestHost && new URL(requestOrigin).host !== requestHost) {
    return response.status(403).json({ success: false });
  }

  const { name, email, subject, message } = request.body || {};
  const values = {
    name: typeof name === "string" ? name.trim() : "",
    email: typeof email === "string" ? email.trim() : "",
    subject: typeof subject === "string" ? subject.trim() : "",
    message: typeof message === "string" ? message.trim() : "",
  };

  if (
    !values.name || values.name.length > 120 ||
    !EMAIL_PATTERN.test(values.email) || values.email.length > 254 ||
    !values.subject || values.subject.length > 200 ||
    !values.message || values.message.length > 10000
  ) {
    return response.status(400).json({ success: false });
  }

  const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
  if (!accessKey) {
    return response.status(503).json({ success: false });
  }

  try {
    const upstreamResponse = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        access_key: accessKey,
        ...values,
        from_name: "Portofolio alfachridzy",
      }),
    });
    const result = await upstreamResponse.json();

    if (!upstreamResponse.ok || !result.success) {
      return response.status(502).json({ success: false });
    }
    return response.status(200).json({ success: true });
  } catch (_error) {
    return response.status(502).json({ success: false });
  }
};
