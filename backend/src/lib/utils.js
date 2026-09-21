import jwt from 'jsonwebtoken';

export const generateToken = (userID, res) => {
const { JWT_SECRET } = process.env;
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
}
    const token = jwt.sign({ userID }, JWT_SECRET, {
        expiresIn: "7d"
    });

    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, //7 days in milliseconds
        httpOnly: true, // cookie cannot be accessed by client-side JavaScript(XSS attacks/cross site scripting attacks)
        sameSite: "strict", // cookie will only be sent in requests originating from the same site (CSRF attacks/cross site request forgery attacks)
        secure: process.env.NODE_ENV === "development" ? false : true // cookie will only be sent over HTTPS in production
    });

    return token;
}