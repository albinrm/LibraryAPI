export interface Book {
  isbn: string;
  title: string;
  author: string;
  publishedYear: number;
  totalCopies: number;
  description: string;
}

export interface BookWithAvailability extends Book {
  availableCopies: number;
}
