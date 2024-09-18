import { Router } from "express";
import {
  createRecipe,
  deleteRecipe,
  getAllRecipies,
  getRecipe,
  upVoteRecipe,
} from "../controllers/recipe.controller.js";
import isAuthorized from "../middlewares/isAuthorized.js";

const router = Router();

router.get("/", getAllRecipies);
router.get("/:id", getRecipe);
router.post("/create", isAuthorized, createRecipe);
router.post("/upvote/:id", isAuthorized, upVoteRecipe);
router.delete("/:id", isAuthorized, deleteRecipe);

export default router;
