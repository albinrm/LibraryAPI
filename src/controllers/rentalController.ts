import { Request, Response, NextFunction } from "express";
import { RentalService } from "../services/rentalService";

const rentalService = new RentalService();

export const createRental = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const { bookId } = req.params;
  const { userId } = req.body;

  const result = rentalService.createRental(bookId, userId);

  if (!result.success) {
    // Map different error types to appropriate status codes
    let statusCode = 400;
    if (result.error === "Book not found") statusCode = 404;
    if (result.error === "Invalid user ID") statusCode = 404;
    if (result.error === "No copies available for rent") statusCode = 409; // Conflict

    res.status(statusCode).json({ error: result.error });
    return;
  }

  res.status(201).json({
    message: "Book rented successfully",
    rentalId: result.rentalId,
  });
};

export const returnRental = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const { rentalId } = req.params;

  const result = rentalService.returnRental(rentalId);

  if (!result.success) {
    const statusCode = result.error === "Rental not found" ? 404 : 400;
    res.status(statusCode).json({ error: result.error });
    return;
  }

  res.json({ message: "Book returned successfully" });
};

export const getRental = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const { rentalId } = req.params;

  const rental = rentalService.getRentalById(rentalId);

  if (!rental) {
    res.status(404).json({ error: "Rental not found" });
    return;
  }

  res.json({ rental });
};
