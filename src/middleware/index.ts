import { getUserById } from "../db";
import express from "express";
import jwt from "jsonwebtoken";

export const isOwner = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { userId } = req.params;
    // console.log(req.params);
    const currentUserId = req.body.userId;
    // console.log(currentUserId);
    if (!currentUserId) {
      return res.status(403).send("headers problem");
    }

    if (currentUserId.toString() !== userId) {
      return res.status(403).send("You are not authorized");
    }

    next();
  } catch (error) {
    console.log(error);
    return res.send(400).send("Authorization error");
  }
};

export const isUser = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      res.status(400).send("There is no user Id");
    }

    const user = await getUserById(userId);
    // console.log(user);
    if (user.role === "2" || user.role === "User") {
      req.body.AdminEmail = user.email;
      next();
    } else {
      res
        .status(403)
        .send("You are not authorized. Only user can set its checkout time.");
    }
  } catch (error) {
    console.log(error);
    return res.status(400).send("Middleware problem");
  }
};

export const isAdmin = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      res.status(400).send("There is no user Id");
    }

    const user = await getUserById(userId);
    // console.log(user);
    if (user.role === "1" || user.role === "Admin") {
      req.body.AdminEmail = user.email;
      next();
    } else {
      res
        .status(403)
        .send("You are not authorized. Only admin can create a user");
    }
  } catch (error) {
    console.log(error);
    return res.status(400).send("Middleware problem");
  }
};

export const isAuthenticated = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const token = req.headers["authorization"].split(" ")[1];

    jwt.verify(
      token,
      process.env.JWT_SECRET,
      (err: Error, decoded: { id: string }) => {
        // console.log(decoded);
        if (err) {
          return res.status(401).send({
            message: "Auth Failed maybe token expired",
            success: false,
            err,
          });
        } else {
          req.body.userId = decoded.id;
          next();
        }
      }
    );
  } catch (error) {
    console.log(error);
    return res.status(400).send("Middleware problem");
  }
};
