import { Router } from "express";
import {
  signup,
  login,
  logout,
  profile,
} from "../controllers/auth.controllers.js";

const router = Router();

router.get("/profile", profile);
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

export default router;
