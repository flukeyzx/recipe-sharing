import { Router } from "express";
import {
  signup,
  login,
  logout,
  profile,
} from "../controllers/auth.controllers.js";
import isAuthorized from "../middlewares/isAuthorized.js";

const router = Router();

router.get("/profile", isAuthorized, profile);
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", isAuthorized, logout);

export default router;
