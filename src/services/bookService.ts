import { dataStore } from "../data/storage";
import { BookWithAvailability } from "../models/Book";

export class BookService {
  getAllBooks(): BookWithAvailability[] {
    return dataStore.books.map((book) => ({
      ...book,
      availableCopies: this.getAvailableCopies(book.isbn),
    }));
  }

  // Validates and returns book with proper error handling
  validateAndGetBook(isbn: string): {
    success: boolean;
    book?: BookWithAvailability;
    error?: string;
  } {
    // ISBN format validation
    if (!isbn || isbn.trim() === "") {
      return { success: false, error: "ISBN is required" };
    }

    // Get book directly from dataStore
    const book = dataStore.getBookByIsbn(isbn);
    if (!book) {
      return { success: false, error: "Book not found" };
    }

    // Return book with available copies
    const bookWithAvailability: BookWithAvailability = {
      ...book,
      availableCopies: this.getAvailableCopies(isbn),
    };

    return { success: true, book: bookWithAvailability };
  }



  getAvailableCopies(isbn: string): number {
    const activeRentals = dataStore.rentals.filter(
      (rental) => rental.bookIsbn === isbn && !rental.returnDate,
    ).length;

    const book = dataStore.getBookByIsbn(isbn);
    return book ? book.totalCopies - activeRentals : 0; // Theorethically book should always exist here
  }
}
