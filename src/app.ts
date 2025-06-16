import express from "express";
import dotenv from "dotenv";
// import cors from 'cors';
// import helmet from 'helmet';
import bookRoutes from "./routes/books";
import userRoutes from "./routes/users";
import rentalRoutes from "./routes/rentals";

dotenv.config(); // Load environment variables from .env file
const app = express();
const PORT = process.env.PORT;

// app.use(helmet());
// app.use(cors());
app.use(express.json()); //Middleware to handle JSON

// Routes
app.use("/v1/books", bookRoutes);
app.use("/v1/users", userRoutes);
app.use("/v1/rentals", rentalRoutes);

// Error handling
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack);
  res.status(500).json({ error: "Error in server startup" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
