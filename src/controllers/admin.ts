import {
  getCheckoutDetailsById,
  getCheckoutTimeByDate,
  getCheckoutTimeById,
  updateStatus,
} from "../db";
import express from "express";

export const updateUserStatus = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { checkoutId } = req.params;
    const { Status, Date } = req.body;

    const existingUser = await getCheckoutTimeById(checkoutId);
    if (!existingUser) {
      return res.status(400).send("User hasn't checked out");
    }
    // console.log(existingUser);

    const updatedStatus = await updateStatus(checkoutId, Status);
    // console.log(updatedStatus);
    return res.status(200).json(updatedStatus);
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
};
