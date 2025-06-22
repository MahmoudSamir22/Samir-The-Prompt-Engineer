import express from "express";
import { config } from "dotenv";
import cors from "cors";
import router from "./src/routers";
import globelErrorHandler from "./src/middlewares/error.middleware";

config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api", router);
app.all("/{*any}", (req, res) => {
  res.status(404).json({ message: "Not Found" });
});
app.use(globelErrorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
