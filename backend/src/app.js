import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";

import { env, allowedOrigins } from "./config/env.js";
import routes from "./routes/index.js";
import { notFound, errorHandler } from "./middlewares/error.middleware.js";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

if (env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/api/v1", routes);

app.use(notFound);
app.use(errorHandler);

export default app;