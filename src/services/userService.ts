import { dataStore } from "../data/storage";

export interface UserRentedBook {
  rentalId: string;
  rentedAt: Date;
  isbn: string;
  title: string;
  author: string;
}

export class UserService {

  // Validates the user ID format and checks if  user exists in data store
  validateUser(userId: string): {
    success: boolean;
    error?: string;
  } {
    // User ID format validation
    if (!userId || userId.trim() === "") {
      return { success: false, error: "User ID is required" };
    }

    // Check if user exists
    if (!dataStore.isValidUser(userId)) {
      return { success: false, error: "Invalid user ID" };
    }

    return { success: true };
  }



  getUserRentedBooks(userId: string): {
    success: boolean;
    data?: UserRentedBook[];
    error?: string;
  } {
    // Validate user 
    const userValidation = this.validateUser(userId);
    if (!userValidation.success) {
      return { success: false, error: userValidation.error };
    }

    // Get all active rentals for this user
    const activeRentals = dataStore.rentals.filter(
      (rental) => rental.userId === userId && !rental.returnDate,
    );

    const rentedBooks: UserRentedBook[] = [];

    for (const rental of activeRentals) {
      const book = dataStore.getBookByIsbn(rental.bookIsbn);
      if (book) {
        rentedBooks.push({
          rentalId: rental.id,
          rentedAt: rental.rentDate,
          isbn: book.isbn,
          title: book.title,
          author: book.author,
        });
      }
    }

    return { success: true, data: rentedBooks };
  }

}
