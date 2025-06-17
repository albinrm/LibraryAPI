import { dataStore } from "../data/storage";
import { Rental } from "../models/Rental";
import { BookService } from "./bookService";
import { UserService } from "./userService";

export class RentalService {
  private bookService = new BookService();
  private userService = new UserService();

  createRental(
    isbn: string,
    userId: string,
  ): { success: boolean; rentalId?: string; error?: string } {
    // Validate user using UserService
    const userValidation = this.userService.validateUser(userId);
    if (!userValidation.success) {
      return { success: false, error: userValidation.error };
    }

    // Validate and get book using BookService
    const bookValidation = this.bookService.validateAndGetBook(isbn);
    if (!bookValidation.success) {
      return { success: false, error: bookValidation.error };
    }

    const book = bookValidation.book!;

    // Check if copies are available
    if (book.availableCopies <= 0) {
      return { success: false, error: "No copies available for rent" };
    }

    // Check if copies are available (delegate to BookService)
    const availableCopies = this.bookService.getAvailableCopies(isbn);
    if (availableCopies <= 0) {
      return { success: false, error: "No copies available for rent" };
    }

    // Check if user already has an active rental for this book
    if (dataStore.hasActiveRental(userId, isbn)) {
      return {
        success: false,
        error: "You already have this book rented",
      };
    }

    // Create rental
    const rental: Rental = {
      id: `rental-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      bookIsbn: isbn,
      userId,
      rentDate: new Date(),
      returnDate: undefined,
    };

    dataStore.addRental(rental);

    return { success: true, rentalId: rental.id };
  }

  returnRental(rentalId: string): { success: boolean; error?: string } {
    const rental = dataStore.getRentalById(rentalId);
    if (!rental) {
      return { success: false, error: "Rental not found" };
    }

    // Check if already returned
    if (rental.returnDate) {
      return { success: false, error: "Book already returned" };
    }

    // Mark as returned
    rental.returnDate = new Date();
    return { success: true };
  }

  getRentalById(rentalId: string): Rental | null {
    return dataStore.getRentalById(rentalId);
  }

  getUserActiveRentals(userId: string): Rental[] {
    return dataStore.getUserActiveRentals(userId);
  }

  getUserRentalHistory(userId: string): Rental[] {
    return dataStore.getUserRentalHistory(userId);
  }
}
