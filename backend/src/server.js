import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import path from 'path';
import {connectDB} from './lib/db.js';
dotenv.config();
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
    app.get("*any", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend/dist/index.html"))});
    }


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});