import { Router } from "express";
import isAuthorized from "../middlewares/isAuthorized.js";
import { updateUserProfile } from "../controllers/user.controller.js";

const router = Router();

router.post("/update", isAuthorized, updateUserProfile);

export default router;
