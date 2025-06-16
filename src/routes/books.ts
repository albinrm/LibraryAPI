import { Router } from "express";
import { getAllBooks, getBookById } from "../controllers/bookController";
import { createRental } from "../controllers/rentalController";

const router = Router();

router.get("/", getAllBooks);
router.get("/:bookId", getBookById);
router.post("/:bookId/rent", createRental);

export default router;
