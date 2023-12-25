import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

const config = new ConfigService();

const transport =
  config.get('NODE_ENV') === 'production'
    ? nodemailer.createTransport({
        host: 'ec2-18-136-126-6.ap-southeast-1.compute.amazonaws.com',
        port: '1025',
        auth: {
          user: config.get('DEV_MAILPIT_USER'),
          pass: config.get('DEV_MAILPIT_PASSWORD'),
        },
      })
    : nodemailer.createTransport({
        host: 'ec2-18-136-126-6.ap-southeast-1.compute.amazonaws.com',
        port: '1025',
        auth: {
          user: config.get('DEV_MAILPIT_USER'),
          pass: config.get('DEV_MAILPIT_PASSWORD'),
        },
      });

export const Emailhtml = (
  userVerificationToken: string,
  url: string,
) => `<!DOCTYPE html>
<html>
  <head>
    <title>Registration Token</title>
    <style>
      @import url("https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&family=Manrope:wght@200;300;400;500;600;700;800&family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Roboto+Slab:wght@100;200;300;400;500;600;700;800;900&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&family=Vollkorn:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500;1,600;1,700;1,800;1,900&family=Yaldevi:wght@200;300;400;500;600;700&display=swap");
      body {
        background-color: #18181b;
        color: #fff;
        text-align: left;
        font-family: 'Inter', 'Roboto', sans-serif; 
        padding: 20px;
      }
      a {
        color: #18181b;
      }
    </style>
  </head>
  <body>
    <header style="text-align: left">
      <h3
        style="
          font-size: 24px;
          font-style: normal;
          font-weight: 600;
          line-height: 32px;
          letter-spacing: -0.6px;
        "
      >
        nextest
      </h3>
    </header>
    <div
      style="
        padding: 20px;
        border-radius: 10px;
        border: 2px solid #fff;
        background-color: #fff;
        color: #18181b;
      "
    >
      <p>Here is your registration token: <strong>${userVerificationToken}</strong></p>
      <p>Click the link below to verify your email:</p>
      <p><a href="${url}">Verify Email</a></p>
    </div>
  </body>
</html>
`;

export const sendEmailDev = async (
  from: string,
  to: string,
  subject: string,
  text: string,
  html: string,
) => {
  try {
    const info = await transport.sendMail({
      from: from || 'admin@ticketing.app',
      to,
      subject,
      text,
      html: html || text,
    });
    console.log('Message sent from dev: %s', info.messageId);
    transport.close();
  } catch (error) {
    return console.log(error);
  }
};
