export interface Rental {
  id: string;
  bookIsbn: string;
  userId: string;
  rentDate: Date;
  returnDate?: Date;
}
