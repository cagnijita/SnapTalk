import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
    const { JWT_SECRET, NODE_ENV } = process.env;
    if (!JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in environment variables");
    }
    const token = jwt.sign({ userId }, JWT_SECRET, {
        expiresIn: "7d",
    });
    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
        httpOnly: true, // Cookie is only accessible by the server prevents XSS attacks:cross-site scripting attacks
        secure: NODE_ENV === "development" ? false : true, // Cookie is only sent over HTTPS in production
        sameSite: "strict", // Cookie is only sent for same-site requests prevents from csrf attacks
    });
    return token;
};