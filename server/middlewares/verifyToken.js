const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const cookies = req.headers.cookie;

  if (!cookies) {
    return res.status(404).json({ message: "No cookies found" });
  }

  const cookieArray = cookies.split(";");

  let token;
  for (const cookie of cookieArray) {
    const [cookieName, cookieValue] = cookie.split("=").map((c) => c.trim());
    if (cookieName === "yourTokenCookieName") {
      token = cookieValue;
      break;
    }
  }

  if (!token) {
    return res.status(404).json({ message: "No token found" });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (error, user) => {
    if (error) {
      console.log("i am in error");
      return res.status(400).json({ message: "Invalid token" });
    }

    console.log(user);
    req.id = user.id;
    next();
  });
};

module.exports = verifyToken;
