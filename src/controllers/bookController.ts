import { Request, Response, NextFunction } from "express";
import { BookService } from "../services/bookService";

const bookService = new BookService();

export const getAllBooks = (req: Request, res: Response): void => {
  const books = bookService.getAllBooks();
  res.json({ books });
};

export const getBookById = (req: Request, res: Response): void => {
  const { bookId } = req.params;
  const result = bookService.validateAndGetBook(bookId);

  if (!result.success) {
    const statusCode = result.error === "Book not found" ? 404 : 400;
    res.status(statusCode).json({ error: result.error });
    return;
  }

  res.json({ book: result.book });
};
