import aj from "../lib/arcjet.js";
import { isSpoofedBot } from "@arcjet/inspect";

export const arcjetProtection = async (req, res, next) => {
    try {
        const decision = await aj.protect(req);
        console.log("Arcjet Decision Verdict:", decision.conclusion);
        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
                return res.status(429).json({ message: "Too many requests. Please try again later." });
            }
            else if (decision.reason.isBot()) {
                return res.status(403).json({ message: "Access denied. Bot activity detected." });
            }
            else {
                return res.status(403).json({ message: "Access denied. Suspicious activity detected." });
            }
        }

        //spoofed bot detection
        if (decision.results.some(isSpoofedBot)) {
            return res.status(403).json({
                error: "Spoofed bot activity detected.",
                message: "Malicious activity detected. Access denied."
            });
        }
        next();
    }
    catch (error) {
        console.error("Error in Arcjet Protection:", error);
        return res.status(503).json({ message: "Request protection is temporarily unavailable." });
    }
}