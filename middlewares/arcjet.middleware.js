import aj from "../config/arcjet.js";

const arcjetMiddleware = async (req, res, next) => {
  try {
    const decision = await aj.protect(req, { requested: 1 });
    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return res.status(429).json({
          message: "Rate limit exceeded",
          error: decision.reason.message,
        });
      }
      if (decision.reason.isBot()) {
        return res.status(403).json({
          message: "Access denied",
          error: "Bot traffic is not allowed",
        });
      }
      return res
        .status(403)
        .json({ message: "Access denied", error: decision.reason.message });
    }
    next();
  } catch (error) {
    console.error("Arcjet middleware error:", error);
    next(error);
  }
};

export default arcjetMiddleware;
