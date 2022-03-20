const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const { getUrl } = require("./userService");

const NODEMAILER_EMAIL = process.env.NODEMAILER_EMAIL;
const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

const oAuth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

//Nodemailer Email Service
const createMail = async (email, firstName, id, type) => {
  const accessToken = await oAuth2Client.getAccessToken();

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: NODEMAILER_EMAIL,
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      refreshToken: REFRESH_TOKEN,
      accessToken: accessToken,
    },
  });

  let message;

  switch (type) {
    case "signup":
      message = {
        from: "Eventis <hello.eventis@gmail.com>",
        to: email,
        subject: "Account verification",
        html: `
        <h3> Hi, ${firstName}</h3>
    <p>Welcome to student paddy, Please click on this link to verify your email</p>
    <a href="${getUrl()}/user/auth/verify-account/${id}">Verify Now</a>
    `,
      };
      break;
    case "resetPassword":
      message = {
        from: "Eventis <hello.eventis@gmail.com>",
        to: email,
        subject: "Reset your user Password",
        html: `
    <h3> Hi, ${firstName}</h3>
    <p> Please click on this link to complete your password reset process</p>
    <a href="${getUrl()}user/profile/resetpassword/${id}"> Click here to reset your password</a>
    `,
      };
      break;
  }

  try {
    let info = await transporter.sendMail(message);
    console.log(info);
    return info;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  createMail,
};
