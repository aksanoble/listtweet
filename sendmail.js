import nodemailer from "nodemailer";
import ReactDOMServer from "react-dom/server";

import EmailHTMLTemplate from "./emailTemplates/email-template-html";
import emailTemplateText from "./emailTemplates/email-template-text";

export default async function sendMail(person, template) {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
      user: process.env.SES_USERNAME,
      pass: process.env.SES_PASSWORD
    }
  });
  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: `${process.env.NEXT_PUBLIC_ADMIN_NAME} from ListTweet hello@listtweet.com`,
    to: person.email,
    bcc: "aksanoble@gmail.com",
    subject: "Update from ListTweet",
    html: ReactDOMServer.renderToStaticMarkup(template)
  });

  console.log("Message sent: %s", info.messageId);
}
