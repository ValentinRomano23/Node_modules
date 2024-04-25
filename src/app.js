import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import productsRouter from "./routes/productsRouters.js";
import cartsRouter from "./routes/cartsRouters.js";

const app = express();
const PORT = 8080;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(join(__dirname, "../public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/", productsRouter);
app.use("/", cartsRouter);

app.listen(PORT, () => {
  console.log(`Server running in port: ${PORT}`);
});
