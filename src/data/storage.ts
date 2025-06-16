import { Book } from "../models/Book";
import { Rental } from "../models/Rental";
import { User } from "../models/User";
import { books, users } from "./seedData";

class DataStore {
  public books: Book[] = [...books];
  public rentals: Rental[] = [];
  public users: User[] = [...users];

  // Helper methods for data access

  //Book related methods
  getBookByIsbn(isbn: string): Book | undefined {
    return this.books.find((book) => book.isbn === isbn);
  }

  // Rental related methods
  getRentalById(rentalId: string): Rental | null {
    return this.rentals.find((r) => r.id === rentalId) || null;
  }

  hasActiveRental(userId: string, isbn: string): boolean {
    return this.rentals.some(
      (rental) =>
        rental.userId === userId &&
        rental.bookIsbn === isbn &&
        rental.returnDate === undefined,
    );
  }

  getUserActiveRentals(userId: string): Rental[] {
    return this.rentals.filter(
      (rental) => rental.userId === userId && rental.returnDate === undefined,
    );
  }

  getUserRentalHistory(userId: string): Rental[] {
    return this.rentals.filter((rental) => rental.userId === userId);
  }

  addRental(rental: Rental): void {
    this.rentals.push(rental);
  }

  // User related methods
  getUserById(userId: string): User | undefined {
    return this.users.find((user) => user.id === userId);
  }

  isValidUser(userId: string): boolean {
    return this.users.some((user) => user.id === userId);
  }
}

export const dataStore = new DataStore();
