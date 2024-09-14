import bcrypt from "bcryptjs";

import prisma from "../database/prisma.config.js";
import generateTokenAndSetCookies from "../utils/generateTokenAndSetCookies.js";

export const signup = async (req, res) => {
  const { name, username, email, password } = req.body;
  try {
    if (!name || !email || !username || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill all the fields." });
    }

    const emailExists = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (emailExists) {
      return res
        .status(400)
        .json({ success: false, message: "This email is already registered." });
    }

    const usernameExists = await prisma.user.findFirst({
      where: {
        username,
      },
    });

    if (usernameExists) {
      return res
        .status(400)
        .json({ success: false, message: "This username is already taken." });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be atleast 6 characters long.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        username,
        email,
        password: hashedPassword,
      },
      omit: {
        password: true,
      },
    });

    await generateTokenAndSetCookies(res, user.id);

    return res
      .status(201)
      .json({ success: true, message: "User registered successfully.", user });
  } catch (error) {
    console.error("Error in signup controller.", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

export const login = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    if ((!username && !email) || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill out all the fields." });
    }

    let filter = {};
    if (email) filter.email = email;
    if (username) filter.username = username;

    const userExists = await prisma.user.findFirst({
      where: filter,
    });

    if (!userExists) {
      return res.status(404).json({
        success: false,
        message: "Invalid credentials, wrong username or email.",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      userExists.password
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials, wrong password.",
      });
    }

    await generateTokenAndSetCookies(res, userExists.id);

    return res.status(200).json({
      success: true,
      message: "Logged In successfully.",
      user: {
        ...userExists,
        password: undefined,
      },
    });
  } catch (error) {
    console.error("Error in login controller", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const logout = async (req, res) => {};

export const profile = async (req, res) => {};
