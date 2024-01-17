import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});

export const adminToUser = async (
  adminEmail: string,
  userEmail: string,
  password: string
) => {
  const html = `
  <div>
    <h1>Your account has been created</h1>
    <p>Your details are : </p>
    <p><strong>Email : </strong> ${userEmail}</p>
    <p><strong>Password : </strong>${password}</p>
    <p>Click <a>here</a> to change your password.</p>
  </div>
  `;
  try {
    const info = await transporter.sendMail({
      from: adminEmail,
      to: userEmail,
      subject: "Your account has been created",
      html: html,
    });

    console.log("Message sent: ", info.messageId);
  } catch (error) {
    console.log("Error is nodemailer");
  }
};

export const UserToAdmin = async (
  userEmail: string,
  name: string,
  setIn: string,
  setOut: string,
  date: Date
) => {
  const html = `
    <div>
      <h1>${name} user has been checkedout</h1>
      <p>details are : </p>
      <p><strong>Set In : </strong> ${setIn}</p>
      <p><strong>Set Out : </strong>${setOut}</p>
      <p><strong>Date : </strong>${date}</p>
    </div>
    `;
  try {
    const info = await transporter.sendMail({
      from: "karanverma1940@gmail.com",
      to: userEmail,
      subject: "Employee has checkout",
      html: html,
    });

    console.log("Message sent: ", info.messageId);
  } catch (error) {
    console.log("Error is nodemailer");
  }
};

export const birthdayEmail = async (userEmail: string, name: string) => {
  const html = `
  <div>
    <h1>Happy birthday</h1>
   <p>Congratulations! today is the birthday of ${name}</p>
  </div>
  `;
  try {
    const info = await transporter.sendMail({
      from: "karanverma1940@gmail.com",
      to: userEmail,
      subject: "Happy birthdayt",
      html: html,
    });

    console.log("Message sent: ", info.messageId);
  } catch (error) {
    console.log("Error is nodemailer");
  }
};

export const aniverseryEmail = async (email: string, name: string) => {
  const html = `
  <div>
    <h1>Anniversary</h1>
   <p>Congratulations! today is the anniversary of ${name} in our company.</p>
  </div>
  `;
  try {
    const info = await transporter.sendMail({
      from: "karanverma1940@gmail.com",
      to: email,
      subject: "Anniversary",
      html: html,
    });

    console.log("Message sent: ", info.messageId);
  } catch (error) {
    console.log("Error is nodemailer");
  }
};
