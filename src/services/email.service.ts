import nodemailer from "nodemailer";

const { NODEMAILER_SERVICE, NODEMAILER_USER, NODEMAILER_APP_PASSWORD } =
  process.env;

const generateEmailTemplate = (otp: string, name: string) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vango - Account Verification</title>
  </head>
  <body
    style="font-family: 'Montserrat', sans-serif; background-color: #f4f4f4"
  >
    <div
      style="
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background-color: #ffffff;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      "
    >
      <h1 style="color: #333333; text-align: start">
        Welcome to <span style="color: #ff8c38">Vango</span>, ${name}!
      </h1>
      <p style="color: #555555; font-size: 16px; line-height: 1.5">
        Thank you for joining Vango. To complete your account setup, please use
        the OTP provided below:
      </p>
      <div
        style="
          background-color: #ff8c38;
          color: #ffffff;
          padding: 10px;
          border-radius: 5px;
          text-align: center;
          font-size: 20px;
          margin-top: 20px;
          font-weight: 600
        "
      >
        ${otp}
      </div>
      <p style="color: #555555; font-size: 16px; line-height: 1.5">
        Use this OTP to verify your account. If you didn't request this OTP,
        please ignore this email.
      </p>
    </div>
  </body>
</html>
`;

const transporter = nodemailer.createTransport({
  service: NODEMAILER_SERVICE,
  auth: {
    user: NODEMAILER_USER,
    pass: NODEMAILER_APP_PASSWORD,
  },
  secure: true,
});

export const sendOtpToMail = async (details: {
  to: string;
  subject: string;
  otp: string;
  name: string;
}) => {
  try {
    const { to, subject, otp, name } = details;

    const mailOptions = {
      from: NODEMAILER_USER,
      to,
      subject,
      html: generateEmailTemplate(otp, name),
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email: ", error);
    throw new Error("Error sending email: " + error);
  }
};
