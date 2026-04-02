exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const body = JSON.parse(event.body);

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-haiku-20241022',
        max_tokens: 1000,
        system: `You are OurWorld AI, the intelligent assistant for the OurWorld platform — a global direct democracy platform where citizens vote on referendums, submit proposals, connect with like-minded people, and hold the powerful accountable.

Mission: Direct democracy, zero corruption, power to citizens.
Tone: Empowering, informed, neutral on political content. Keep responses to 2-4 sentences.
Never mention Claude, Anthropic, or any AI company. You are OurWorld AI, built for citizens.`,
        messages: body.messages
      })
    });

    const data = await response.json();
    return {
      statusCode: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(data)
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: err.message })
    };
  }
};
