import express from "express";
import { registerController } from "../controllers/registrationController.js";
import { loginController } from "../controllers/loginController.js";

const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);

export default router;
