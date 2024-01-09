const jwt = require("jsonwebtoken");

const refreshtoken = async (req, res, next) => {
    const cookies = req.headers.cookie;

    if (!cookies) {
      return res.status(404).json({ message: "No cookies found" });
    }
  
    const cookieArray = cookies.split(";");
  
    let preToken;
    for (const cookie of cookieArray) {
      const [cookieName, cookieValue] = cookie.split("=").map((c) => c.trim());
      if (cookieName === "yourTokenCookieName") {
        preToken = cookieValue;
        break;
      }
    }
  

  if (!preToken) {
    return res.status(400).json({ message: "No token found" });
  }

  jwt.verify(String(preToken), process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
        console.log("i am in refresh token error ");
      return res.status(400).json({ message: "Invalid Token" });
    }

    res.clearCookie(String(user.id)); 

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
      expiresIn: 35, // Corrected line
    });

    res.cookie(String(user.id), token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 35 * 1000), // Corrected line
      sameSite: "lax",
    });

    req.id = user.id;
    next();
  });
};

module.exports = { refreshtoken };
