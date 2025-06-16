import { Request, Response, NextFunction } from "express";
import { BookService } from "../services/bookService";

const bookService = new BookService();

export const getAllBooks = (req: Request, res: Response): void => {
  const books = bookService.getAllBooks();
  res.json({ books });
};

export const getBookById = (req: Request, res: Response): void => {
  const { bookId } = req.params;
  const book = bookService.getBookByIsbn(bookId);

  if (!book) {
    res.status(404).json({ error: "Book not found" });
    return;
  }

  res.json({ book });
};
