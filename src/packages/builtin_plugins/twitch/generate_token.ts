import axios from "axios";
async function generateToken({
  clientId,
  secret,
}: {
  clientId?: string;
  secret?: string;
}) {
  if (!clientId || !secret) {
    console.log("Missing clientId or secret");
  }
  const response = await axios.post(`https://id.twitch.tv/oauth2/token`, null, {
    params: {
      client_id: clientId,
      client_secret: secret,
      grant_type: "client_credentials",
    },
  });
  console.log(response.data);
}

(async () => {
  try {
    await generateToken({
      clientId: process.env.TWITCH_CLIENT_ID,
      secret: process.env.TWITCH_SECRET,
    });
  } catch (e) {
    console.log(e.response.data);
  }
})();
