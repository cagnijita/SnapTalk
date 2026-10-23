import express from 'express';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import path from 'path';
import { connectDB } from "./lib/db.js"
import { env } from "./lib/env.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

const PORT = env.PORT || 3000;
const __dirname = path.resolve();

app.use(express.json({limit:"15mb"}));
app.use(cors({
    origin: env.CLIENT_URL,
    credentials: true,
}));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if (env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
    app.get("*any", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend/dist/index.html"))
    });
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});