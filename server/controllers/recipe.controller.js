import { v2 as cloudinary } from "cloudinary";
import prisma from "../database/prisma.config.js";

export const createRecipe = async (req, res) => {
  const { name, description, ingredients } = req.body;
  let { image } = req.body;
  const userId = req.user.userId;

  try {
    if (!name || !description || !ingredients) {
      return res.status(400).json({
        success: false,
        message: "Please fill out the form completely.",
      });
    }

    if (!image) {
      return res
        .status(400)
        .json({ success: false, message: "Image field is required." });
    }

    const response = await cloudinary.uploader.upload(image);
    image = response.secure_url;

    const recipe = await prisma.recipe.create({
      data: {
        name,
        description,
        ingredients,
        image,
        userId,
      },
    });

    return res
      .status(201)
      .json({ success: true, message: "Recipe created successfully.", recipe });
  } catch (error) {
    console.error("Error in createRecipe controller", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

export const getAllRecipies = async (_, res) => {
  try {
    const recipies = await prisma.recipe.findMany({
      include: {
        user: {
          select: {
            name: true,
            username: true,
            email: true,
            avatar: true,
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: "Recipies fetched successfully.",
      recipies,
    });
  } catch (error) {
    console.error("Error in getAllRecipies controller", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

export const getRecipe = async (req, res) => {
  const { id } = req.params;
  try {
    const recipe = await prisma.recipe.findUnique({
      where: {
        id,
      },
      include: {
        user: true,
      },
    });

    if (!recipe) {
      return res
        .status(404)
        .json({ success: false, message: "Recipe not found." });
    }

    if (recipe.user) {
      delete recipe.user.password;
    }

    return res
      .status(200)
      .json({ success: true, message: "Recipe fetched successfully.", recipe });
  } catch (error) {
    console.error("Error in getRecipe controller", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

export const deleteRecipe = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.recipe.delete({
      where: {
        id,
      },
    });

    return res
      .status(200)
      .json({ success: true, message: "Recipe deleted successfully." });
  } catch (error) {
    console.error("Error in deleteRecipe controller", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

export const upVoteRecipe = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;
  try {
    const isAlreadyUpvoted = await prisma.recipe.findUnique({
      where: {
        id,
        upvotes: {
          some: {
            id: userId,
          },
        },
      },
    });

    if (Boolean(isAlreadyUpvoted)) {
      await prisma.recipe.update({
        where: {
          id,
        },
        data: {
          upvotes: {
            disconnect: { id: userId },
          },
        },
      });

      return res
        .status(200)
        .json({ success: true, message: "Removed upvote successfully." });
    } else {
      await prisma.recipe.update({
        where: {
          id,
        },
        data: {
          upvotes: {
            connect: { id: userId },
          },
        },
      });

      return res
        .status(200)
        .json({ success: true, message: "Recipe upvoted successfully." });
    }
  } catch (error) {
    console.error("Error in upVoteRecipe controller", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};
