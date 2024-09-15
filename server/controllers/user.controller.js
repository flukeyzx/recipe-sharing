import prisma from "../database/prisma.config.js";
import { v2 as cloudinary } from "cloudinary";
import bcrypt from "bcryptjs";

export const updateUserProfile = async (req, res) => {
  const { name, username, email, currentPassword, newPassword } = req.body;
  let { avatar } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.userId,
      },
    });

    if (currentPassword || newPassword) {
      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: "Please provide both current password and new password.",
        });
      }

      const isPasswordCorrect = await bcrypt.compare(
        currentPassword,
        user.password
      );

      if (!isPasswordCorrect) {
        return res.status(400).json({
          success: false,
          message: "Please provide correct current password.",
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: "Your new password must be atleast 6 characters long.",
        });
      }
      user.password = await bcrypt.hash(newPassword, 10);
    }

    if (avatar) {
      if (user.avatar) {
        await cloudinary.uploader.destroy(
          user.avatar.split("/").pop().split(".")[0]
        );
      }
      const response = await cloudinary.uploader.upload(avatar);
      user.avatar = response.secure_url;
    }

    user.name = name || user.name;
    user.username = username || user.username;
    user.email = email || user.email;

    const updatedUser = await prisma.user.update({
      where: {
        id: req.user.userId,
      },
      data: {
        ...user,
      },
      omit: {
        password: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "User profile updated successfully.",
      user: {
        ...updatedUser,
      },
    });
  } catch (error) {
    console.error("Error in updateUserProfile controller", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};
