const fetch = require("node-fetch");

exports.handler = async (event) => {
  const apiKey = process.env.DAILY_API_KEY;

  try {
    const response = await fetch("https://api.daily.co/v1/rooms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        properties: {
          exp: Math.round(Date.now() / 1000) + 3600,
          enable_chat: true,
        },
      }),
    });

    const room = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify({ url: room.url }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to create room" }),
    };
  }
};
