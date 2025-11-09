

const jwt = require("jsonwebtoken");


const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;


    if (!authHeader || !authHeader.startsWith("Bearer "))
    {
      return res.status(401).json({ error: "Not authorized, token missing" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // console.log("Decoded is ", decoded); //debug


    req.user = decoded; 

    // req.user has .... {
    //   userId: {
    //     email: 'bhatkoushik54@gmail.com',
    //     name: 'User',
    //     picture: '',
    //     googleId: '100323170727656219187',
    //     lastLoginAt: '2025-11-02T13:08:14.256Z'
    //   },
    //   iat: 1762088895,
    //   exp: 1762693695
    // }
    // console.log("Req user in auth middleware is .......",req.user); //debug

    return next();

  } 
  catch (err) 
  {
    console.error("Auth error:", err.message);
    return res.status(401).json({ error: "Token invalid or expired" });
  }
};

module.exports = { protect };
