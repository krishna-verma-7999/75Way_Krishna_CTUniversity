import {
  createUser,
  getAllUsers,
  getCheckoutTimeByDate,
  getExistingAdminByEmail,
  getUser,
  getUserById,
  getUserCheckoutTime,
  setCheckoutTime,
} from "../db";
import express from "express";
import bcrypt from "bcryptjs";
import { UserToAdmin, adminToUser } from "../email";

export const createUserController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const {
      AdminEmail,
      name,
      email,
      password,
      role,
      birthday,
      salary,
      joiningDate,
    } = req.body;

    if (
      !name ||
      !email ||
      !password ||
      !role ||
      !birthday ||
      !salary ||
      !joiningDate
    ) {
      return res.status(400).send("Enter the data correctly");
    }

    const existingUser = await getExistingAdminByEmail(email);
    // console.log(existingUser);

    // await mail();

    // return res.status(200).send("Ok");

    if (existingUser) {
      return res.status(400).send("user already exists");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValidated = emailRegex.test(email);

    if (!isEmailValidated) {
      return res.status(400).send({
        message: "Email is not valid",
        success: false,
      });
    }

    if (password.length < 6) {
      return res.status(400).send({
        message: "password length must be greater than 6",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = createUser({
      name,
      email,
      password: hashedPassword,
      role,
      birthday,
      salary,
      joiningDate,
    });

    await adminToUser(AdminEmail, email, password);

    return res.status(200).json(newUser);
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
};

export const getAllUsersController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const users = await getAllUsers();
    // console.log(users);
    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
};

export const getUserController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { userId } = req.params;
    const user = await getUser(userId);
    // console.log(userId, user);
    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
};

export const checkoutTime = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { userId } = req.params;
    const { setIn, setOut, Date } = req.body;
    if (!setIn || !userId) {
      return res.status(400);
    }
    const existingUser = await getUserById(userId);

    if (!existingUser) {
      res.status(400).send("User does not exist");
    }
    const checkouts = await getCheckoutTimeByDate(Date, userId);
    if (checkouts) {
      return res.status(400).send("you already have checkout");
    }
    const checkout = await setCheckoutTime({
      employeeId: userId,
      name: existingUser.name,
      setIn,
      setOut,
      Date,
    });
    UserToAdmin(existingUser.email, existingUser.name, setIn, setOut, Date);
    return res.status(200).json(checkout);
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
};

export const getCheckoutDetails = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { userId } = req.params;
    const users = await getUserCheckoutTime(userId);
    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
};
