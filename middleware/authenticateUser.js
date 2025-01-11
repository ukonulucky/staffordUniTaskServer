const jwt = require('jsonwebtoken');


// Middleware to verify JWT and check if user is logged in
const authenticateJWT = (req, res, next) => {
    
  // Get the token from the Authorization header
  const token = req.headers['authorization']?.split(' ')[1];  // "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  // Verify the token using the secret key
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }

    // Attach the decoded user information (e.g., userId) to the request object
    req.user = user;

    // Proceed to the next middleware or route handler
    next();
  });
};

module.exports = authenticateJWT;
