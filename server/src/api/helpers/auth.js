import jwt from "jsonwebtoken";
require("dotenv").config()

const credentials = {
  client: {
    id: process.env.APP_ID,
    secret: process.env.APP_PASSWORD
  },
  auth: {
    tokenHost: "https://login.microsoftonline.com",
    authorizePath: "common/oauth2/v2.0/authorize",
    tokenPath: "common/oauth2/v2.0/token"
  }
};

const oauth2 = require("simple-oauth2").create(credentials);

function getAuthUrl() {
  console.log(`Credentials: ${JSON.stringify(credentials)}`);
  const ret = oauth2.authorizationCode.authorizeURL({
    redirect_uri: process.env.REDIRECT_URI,
    scope: process.env.APP_SCOPES
  });
  console.log(`Generated auth url: ${ret}`);
  return ret;
}

async function getTokenFromCode(auth_code, res) {
  let result = await oauth2.authorizationCode.getToken({
    code: auth_code,
    redirect_URI: process.env.REDIRECT_URI,
    scope: process.env.APP_SCOPES
  });

  const token = oauth2.accessToken.create(result);
  console.log(`Token created: ${token.token}`);

  saveValuesToCookie(token, res);
  
  return token.token.access_token;
}

async function getAccessToken(cookies, res) {
  // Do we have a token cached?
  let token = cookies.graph_access_token;

  if (token) {
    // Is our token expired?
    // Expires 5 minutes early
    const FIVE_MINUTES = 300000;
    const expiration = new Date(parseFloat(cookies.graph_token_expires - FIVE_MINUTES));
    if (expiration > new Date()) {
      return token;
    }
  }

  const refresh_token = cookies.graph_refresh_token;
  if (refresh_token) {
    const newToken = await oauth2.accessToken.create({ refresh_token: refresh_token }).refresh();
    saveValuesToCookie(newToken, res);
    return newToken.token.access_token;
  }

  return null;
}

function saveValuesToCookie(token, res) {
  const user = jwt.decode(token.token.id_token);
  
  res.cookie("graph_access_token", token.token.access_token, { maxAge: 3600000, httpOnly: true });
  res.cookie("graph_user_name", user.name, { maxAge: 3600000, httpOnly: true });
  res.cookie("graph_refresh_token", token.token.refresh_token, { maxAge: 7200000, httpOnly: true });
  res.cookie("graph_token_expires", token.token.expires_at.getTime(), { maxAge: 3600000, httpOnly: true });
}

function clearCookies(res) {
  res.clearCookie("graph_access_token", { maxAge: 3600000, httpOnly: true });
  res.clearCookie("graph_user_name", { maxAge: 3600000, httpOnly: true });
  res.clearCookie("graph_refresh_token", { maxAge: 7200000, httpOnly: true });
  res.clearCookie("graph_token_expires", { maxAge: 3600000, httpOnly: true });
}

exports.getAuthUrl = getAuthUrl;
exports.getTokenFromCode = getTokenFromCode;
exports.clearCookies = clearCookies;
exports.getAccessToken = getAccessToken;
