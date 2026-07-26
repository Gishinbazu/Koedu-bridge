import { Router } from "express";
import {
    changePassword,
    getMe,
    updateMe,
} from "../controllers/user.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.get("/me", getMe);
router.put("/me", updateMe);
router.post("/change-password", changePassword);

export default router;
