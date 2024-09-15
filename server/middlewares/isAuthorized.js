import jwt from "jsonwebtoken";

const isAuthorized = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(400).json({
      success: false,
      message: "No Access token provided, Access denied.",
    });
  }

  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  req.user = decodedToken;
  next();
};

export default isAuthorized;
