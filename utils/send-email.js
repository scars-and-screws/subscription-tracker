import dayjs from "dayjs";
import transporter, { accountEmail } from "../config/nodemailer.js";
import { emailTemplates } from "./email-template.js";

export const sendReminderEmail = async ({ to, type, subscription }) => {
  if (!to || !type || !subscription) {
    throw new Error("Missing required parameters: to, type, or subscription");
  }
  const template = emailTemplates.find((t) => t.label === type);
  if (!template) {
    throw new Error(`Email template for type "${type}" not found.`);
  }
  const mailInfo = {
    userName: subscription.user.name,
    subscriptionName: subscription.name,
    renewalDate: dayjs(subscription.renewalDate).format("MMMM D, YYYY"),
    planName: subscription.name,
    price: ` ${subscription.currency} ${subscription.price} (${subscription.frequency}) `,
    paymentMethod: subscription.paymentMethod,
  };
  const message = template.generateBody(mailInfo);
  const subject = template.generateSubject(mailInfo);

  const mailOptions = {
    from: accountEmail,
    to,
    subject,
    html: message,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) return console.log("Error sending email:", error);
    console.log("Email sent:", info.response);
  });
};
