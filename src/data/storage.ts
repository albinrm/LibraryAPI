import { Book } from "../models/Book";
import { Rental } from "../models/Rental";
import { User } from "../models/User";
import { books, users } from "./seedData";

class DataStore {
  public books: Book[] = [...books];
  public rentals: Rental[] = [];
  public users: User[] = [...users];

  // Helper methods for data access
  getBookByIsbn(isbn: string): Book | undefined {
    return this.books.find((book) => book.isbn === isbn);
  }

  getRentalsByUserId(userId: string): Rental[] {
    return this.rentals.filter(
      (rental) => rental.userId === userId && !rental.returnDate,
    );
  }

  getUserById(userId: string): User | undefined {
    return this.users.find((user) => user.id === userId);
  }

  isValidUser(userId: string): boolean {
    return this.users.some((user) => user.id === userId);
  }
}

export const dataStore = new DataStore();
