import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/userService";

const userService = new UserService();

export const getUserBooks = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const { userId } = req.params;

  const result = userService.getUserRentedBooks(userId);

  if (!result.success) {
    const statusCode = result.error === "Invalid user ID" ? 404 : 400;
    res.status(statusCode).json({ error: result.error });
    return;
  }

  res.json({
    userId,
    rentedBooks: result.data || [],
    totalRented: result.data?.length || 0,
  });
};
