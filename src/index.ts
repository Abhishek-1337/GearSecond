import express, { ErrorRequestHandler } from 'express';
import userRouter from './routes/user';
import contentRouter from './routes/content';
import tagRouter from "./routes/tag";
import cors from "cors";
import errorMiddleware from './middlewares/errorMiddleware';
import cookieParser from "cookie-parser";
import helmet from 'helmet';

const app = express();

app.use(helmet(
    {
        contentSecurityPolicy: {
          directives: {
            "default-src": ["'self'", "'unsafe-inline'", "*"],
            "script-src": ["'self'", "*"]
          },
        },
        crossOriginEmbedderPolicy: false,
    }
));

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/content", contentRouter);
app.use("/api/v1/tag", tagRouter);

app.use(errorMiddleware);

export default app;