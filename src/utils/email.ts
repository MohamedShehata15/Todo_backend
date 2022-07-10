import nodemailer from 'nodemailer';

import config from '../config';
import { sendMailTypes } from '../types/sendMail.types';

const sendEmail = async (option: sendMailTypes) => {
   // Create Transporter
   const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
         user: config.emailUsername,
         pass: config.emailPassword
      }
   });

   // Define the email options
   const mailOptions = {
      from: 'Todo App Contact',
      to: option.email,
      subject: option.subject,
      text: option.message
   };

   // Actually send the email
   await transporter.sendMail(mailOptions);
};

export default sendEmail;
