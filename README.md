# Library API

Simple REST API built using Node.js, Express, and TypeScript allows CRUD operations on data stored transiently on the server.

## Installation

1. Clone the repository to your local machine.
2. Run `npm install` to install dependencies.
3. Create a `.env` file in the root directory and populate the required environment variables.
4. Run `npm run build` to compile the TypeScript code into JavaScript. The compiled code will be in the `dist` directory.
5. Run `npm start` to start the server.

## Testing

With the server active you can run node test-api.js in a separate terminal for simople testing, or use an APOI client of your choice.

## API Endpoints

- `/v1/books`: Retrieve all books with available copies. (GET)
  - `/v1/books/:bookId`: Retrieve details about a specific book. (GET)
  - `/v1/books/:bookId/rent`: Rent a book (userId in request body). (POST)
- `/v1/users/:userId/books`: Retrieve a user's rented books. (GET)
- `/v1/rentals/:rentalId/return`: Return a rented book. (POST)

The POST operation `/v1/books/:bookId/rent` required this parameter in the request body:

- `userID`: The ID of the User.

## Environment Variables

Your `.env` file should include the following variables:

- `PORT`: The target Localhost port.

## File Strucure
.
|   .env
|   notes.txt
|   package-lock.json
|   package.json
|   README.md
|   test-api.js
|   tsconfig.json
|   app.js
|
+---controllers
|       bookController.js
|       rentalController.js
|       userController.js
|
+---data
|       seedData.js
|       storage.js
|
+---models
|       Book.js
|       Rental.js
|       User.js
|
\---services
        bookService.js
        rentalService.js
        userService.js
