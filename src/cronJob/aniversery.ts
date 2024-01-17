import cron from "node-cron";
// import { aniverseryEmail } from "../email";
import { getAllUser } from "../db";
import { aniverseryEmail } from "../email";

export const aniverseryCronJob = async () => {
  const users = await getAllUser();
  cron.schedule("0 0 * * *", () => {
    const todayDate = new Date();

    users.forEach((user) => {
      if (user.joiningDate.getMonth() === todayDate.getMonth()) {
        aniverseryEmail(user.email, user.name);
      }
    });
  });
};
