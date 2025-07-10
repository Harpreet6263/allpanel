const jwt = require("jsonwebtoken");
const { BAD_REQUEST } = require("../constants/helper");


const Auth = async (req, res,next) => {

  // Get token from header
  const token = req.header("x-auth-token");

  // Check if not token
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  // Verify token
  try {
    await jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
      if (error) {
        res.status(401).json({ msg: "Token is not valid" });
      } 
      req.user = decoded.user;
      next();
    });
  } catch (err) {
    console.error("Something wrong with auth middleware");
    res.status(500).json({ msg: "Server Error" });
  }
};
module.exports = {Auth};
