// import jwt from "jsonwebtoken";

// const protect = (req, res, next) => {
//   let token;

//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith("Bearer")
//   ) {
//     token = req.headers.authorization.split(" ")[1];

//     try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);

//       req.user = decoded;
//       next();
//     } catch (error) {
//       res.status(401).json({ message: "Not authorized" });
//     }
//   } else {
//     res.status(401).json({ message: "No token" });
//   }
// };

// export default protect;

import jwt from "jsonwebtoken";

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized" });
  }
};

export default protect;