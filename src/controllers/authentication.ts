import express from "express";
import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";
import { createUser, getExistingAdminByEmail } from "../db";

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.status(406).send("Enter your details");
    }

    const existingUser = await getExistingAdminByEmail(email);
    // console.log(existingUser);

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
    } else if (!password.match(/[a-z]/)) {
      return res.status(400).send({
        message: "password must contain at least 1 letter between a-z",
        success: false,
      });
    } else if (!password.match(/[A-Z]/)) {
      return res.status(400).send({
        message: "password must contain at least 1 letter between A-Z",
        success: false,
      });
    } else if (!password.match(/\d/)) {
      return res.status(400).send({
        message: "password must contain at least 1 number",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = createUser({
      name,
      email,
      password: hashedPassword,
    });

    return res.status(200).json(admin);
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
};

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400);
    }

    const existingAdmin = await getExistingAdminByEmail(email);

    if (!existingAdmin) {
      return res.send(404).send("Admin doesn't exists");
    }

    const isMatch = await bcrypt.compare(password, existingAdmin.password);

    if (!isMatch) {
      return res.send(403).send("Password is incorrect");
    }

    const token = jwt.sign({ id: existingAdmin._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res.status(200).send({
      message: "User has been logged In successfully",
      data: token,
    });
    // return res.status(200).send("ok");
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
};
