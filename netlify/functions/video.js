const https = require("https");

exports.handler = async (event) => {
  const apiKey = process.env.DAILY_API_KEY;

  return new Promise((resolve) => {
    const body = JSON.stringify({
      properties: {
        exp: Math.round(Date.now() / 1000) + 3600,
        enable_chat: true,
      },
    });

    const options = {
      hostname: "api.daily.co",
      path: "/v1/rooms",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "Content-Length": Buffer.byteLength(body),
      },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => { data += chunk; });
      res.on("end", () => {
        const room = JSON.parse(data);
        resolve({
          statusCode: 200,
          body: JSON.stringify({ url: room.url }),
        });
      });
    });

    req.on("error", (err) => {
      resolve({
        statusCode: 500,
        body: JSON.stringify({ error: err.message }),
      });
    });

    req.write(body);
    req.end();
  });
};
