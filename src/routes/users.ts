import { Router } from "express";
import { getUserBooks } from "../controllers/userController";

const router = Router();

router.get("/:userId/books", getUserBooks);

export default router;
