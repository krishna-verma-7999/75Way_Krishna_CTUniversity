import cron from "node-cron";
import { birthdayEmail } from "../email";
import { getAllUser } from "../db";

export const birthdayCronJob = async () => {
  const users = await getAllUser();

  users.map((data) => {
    const month = data.birthday.getMonth() + 1;
    const day = data.birthday.getDate();

    cron.schedule(`0 0 ${day} ${month} *`, () => {
      users.map((user) => {
        birthdayEmail(user.email, user.name);
      });
    });
  });
};
