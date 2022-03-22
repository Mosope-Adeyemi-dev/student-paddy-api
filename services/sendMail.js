const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const { getUrl } = require("./userServices");

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
const createMail = async (email, id, type) => {
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
        from: "Student Paddy",
        to: email,
        subject: "Account verification",
        html: `
    <p>Welcome to student paddy, Please click on this link to verify your email</p>
     <a href="${getUrl()}user/auth/verify-account/${id}">Verify Now</a>
    `,
      };
      break;
    case "resetPassword":
      message = {
        from: "Student Paddy",
        to: email,
        subject: "Reset your user Password",
        html: `
    <p> Please click on this link to complete your password reset process</p>
    <a href="${getUrl()}user/profile/reset-password/${id}">Click here</a> to reset your password
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
