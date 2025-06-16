import { dataStore } from "../data/storage";
import { Rental } from "../models/Rental";
import { BookService } from "./bookService";


export class RentalService {
  private bookService = new BookService();

  createRental(
    isbn: string,
    userId: string,
  ): { success: boolean; rentalId?: string; error?: string } {
    // Validate input
    if (!isbn || isbn.trim() === "") {
      return { success: false, error: "ISBN is required" };
    }

    if (!userId || userId.trim() === "") {
      return { success: false, error: "User ID is required" };
    }

    // Check if user is valid
    if (!dataStore.isValidUser(userId)) {
      return { success: false, error: "Invalid user ID" };
    }

    // Check if book exists (delegate to BookService)
    const book = this.bookService.getBookByIsbn(isbn);
    if (!book) {
    return { success: false, error: "Book not found" };
    }

    // Check if copies are available (delegate to BookService)
    const availableCopies = this.bookService.getAvailableCopies(isbn);
    if (availableCopies <= 0) {
      return { success: false, error: "No copies available for rent" };
    }

    // Create rental 
    const rental: Rental = {
      id: `rental-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      bookIsbn: isbn,
      userId,
      rentDate: new Date(),
      returnDate: undefined,
    };

    dataStore.rentals.push(rental);

    return {
      success: true,
      rentalId: rental.id,
    };
  }

  returnRental(rentalId: string): { success: boolean; error?: string } {
    // Find the rental
    const rental = dataStore.rentals.find((r) => r.id === rentalId);

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
    return dataStore.rentals.find((r) => r.id === rentalId) || null;
  }

  getUserActiveRentals(userId: string): Rental[] {
    return dataStore.rentals.filter(
      (rental) => rental.userId === userId && !rental.returnDate,
    );
  }

  getUserRentalHistory(userId: string): Rental[] {
    return dataStore.rentals.filter((rental) => rental.userId === userId);
  }
}
