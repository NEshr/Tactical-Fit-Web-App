const nodemailer = require("nodemailer");

async function getPassword(email, token){
    try{
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: email,
      from: 'help@fitwebapp.com',
      subject: 'Password Reset-Tactical Barbell',
      text: `To reset your password, click or copy the link below 
      into your browser. If you did not request to reset your password, 
      just ignore this email, and your password will stay the same`,
      html: (process.env.PORT) ? `https://tacticalfit.herokuapp.com/${token}`: `http://localhost:3001/resetPass/${token}`,
    };
    sgMail.send(msg);
}
catch(error){
    console.log('mailer error');
}
  }
  
  
  
  module.exports = getPassword;
  