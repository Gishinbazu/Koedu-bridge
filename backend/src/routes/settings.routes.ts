import { Router } from "express";
import {
    getMySettings,
    updateAccountSettings,
    updateLanguageSettings,
    updateNotificationSettings,
} from "../controllers/settings.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.get("/me", getMySettings);
router.put("/account", updateAccountSettings);
router.put("/notifications", updateNotificationSettings);
router.put("/language", updateLanguageSettings);

export default router;
