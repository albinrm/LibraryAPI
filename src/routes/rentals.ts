import { Router } from "express";
import { returnRental } from "../controllers/rentalController";

const router = Router();

router.post("/:rentalId/return", returnRental);

export default router;
