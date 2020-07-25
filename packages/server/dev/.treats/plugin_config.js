module.exports = {
  "builtin/reddit": {
    clientId: process.env.REDDIT_CLIENT_ID,
    clientSecret: process.env.REDDIT_CLIENT_SECRET,
    refreshToken: process.env.REDDIT_REFRESH_TOKEN,
  },
  "builtin/twitch": {
    clientId: process.env.TWITCH_CLIENT_ID,
    token: process.env.TWITCH_TOKEN,
    username: process.env.TWITCH_USERNAME,
  },
};
