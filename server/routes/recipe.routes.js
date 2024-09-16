import { Router } from "express";
import {
  createRecipe,
  deleteRecipe,
  getAllRecipies,
  getRecipe,
} from "../controllers/recipe.controller.js";
import isAuthorized from "../middlewares/isAuthorized.js";

const router = Router();

router.get("/", getAllRecipies);
router.get("/:id", getRecipe);
router.post("/create", isAuthorized, createRecipe);
router.delete("/:id", isAuthorized, deleteRecipe);

export default router;
