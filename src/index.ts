import express from 'express';
import userRouter from './routes/user';
import contentRouter from './routes/content';
import tagRouter from "./routes/tag";

const app = express();

app.use(express.json());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/content", contentRouter);
app.use("/api/v1/tag", tagRouter);

export default app;