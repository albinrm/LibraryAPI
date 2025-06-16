import { dataStore } from "../data/storage";
import { BookWithAvailability } from "../models/Book";

export class BookService {
  getAllBooks(): BookWithAvailability[] {
    return dataStore.books.map((book) => ({
      ...book,
      availableCopies: this.getAvailableCopies(book.isbn),
    }));
  }

  getBookByIsbn(isbn: string): BookWithAvailability | null {
    const book = dataStore.getBookByIsbn(isbn);
    if (!book) return null;

    return {
      ...book,
      availableCopies: this.getAvailableCopies(isbn),
    };
  }

  getAvailableCopies(isbn: string): number {
    const activeRentals = dataStore.rentals.filter(
      (rental) => rental.bookIsbn === isbn && !rental.returnDate,
    ).length;

    const book = dataStore.getBookByIsbn(isbn);
    return book ? book.totalCopies - activeRentals : 0; // Theorethically book should always exist here
  }
}
