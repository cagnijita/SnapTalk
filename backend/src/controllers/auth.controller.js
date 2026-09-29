import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import { sendWelcomeEmail } from "../emails/emailHandlers.js";
import { env } from "../lib/env.js";

export const signup = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (password.length < 7) {
            return res
                .status(400)
                .json({ message: "Password must be at least 7 characters long" });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(email) === false) {
            return res.status(400).json({ message: "Invalid email format" });
        }
        const passwordRegex =
            /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{7,}$/;
        if (passwordRegex.test(password) === false) {
            return res.status(400).json({
                message:
                    "Password must contain at least one uppercase letter, one number, and one special character",
            });
        }
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }
        const salt = await brcypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });
        if (newUser) {
            // generateToken(newUser._id, res);
            // await newUser.save();

            // persist the new user to the databases
            const savedUser = await newUser.save();
            generateToken(savedUser._id, res); // generate token after saving the user

            res.status(201).json({
                message: "User created successfully",
                user: {
                    _id: newUser._id,
                    username: newUser.username,
                    email: newUser.email,
                    profilepic: newUser.profilepic,
                },
            });

            try {
                sendWelcomeEmail(savedUser.email, savedUser.username, env.CLIENT_URL);
            }
            catch (error) {
                console.error("Error sending welcome email:", error);
            }
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }
    } catch (error) {
        console.log("Error while signing up", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) { return res.status(400).json({ message: "Invalid credentials" }); }

        const isMatchedPassword = await bcrypt.compare(password, user.password);

        if (!isMatchedPassword) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        generateToken(user._id, res);
        res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                profilepic: user.profilepic,
            }
        }
        );
    }
    catch (error) {
        console.error("Error while logging in", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
export const logout = (_, res) => {
    res.cookie(("jwt"), "", { maxAge: 0 })
    res.status(200).json({ message: "Logged out successfully" });
}