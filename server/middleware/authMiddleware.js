import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/user.js";

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error("Not authorized as an admin");
  }
};

const warden = (req, res, next) => {
  if (req.user && (req.user.role === "warden" || req.user.isAdmin)) {
    next();
  } else {
    res.status(401);
    throw new Error("Not authorized as warden");
  }
};

const staff = (req, res, next) => {
  if (req.user && req.user.role === "staff") {
    next();
  } else {
    res.status(401);
    throw new Error("Not authorized as staff");
  }
};

const student = (req, res, next) => {
  if (req.user && req.user.role === "student") {
    next();
  } else {
    res.status(401);
    throw new Error("Not authorized as student");
  }
};

export { protect, admin, warden, staff, student };
