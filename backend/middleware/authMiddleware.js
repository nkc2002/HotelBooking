const jwt = require('jsonwebtoken');

// Verify JWT Token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Access denied. No token provided',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { userId, role }
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired token',
    });
  }
};

// Verify Admin role
const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role === 'admin') {
      next();
    } else {
      return res.status(403).json({
        success: false,
        error: 'Access denied. Admin only',
      });
    }
  });
};

// Verify User (owner or admin)
const verifyUser = (req, res, next) => {
  verifyToken(req, res, () => {
    // User can access their own resource or admin can access any
    if (req.user.userId === req.params.id || req.user.role === 'admin') {
      next();
    } else {
      return res.status(403).json({
        success: false,
        error: 'Access denied. You can only access your own resource',
      });
    }
  });
};

// Attach user to request (optional authentication)
const attachUser = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
    } catch (error) {
      // Ignore errors for optional authentication
    }
  }
  next();
};

module.exports = {
  verifyToken,
  verifyAdmin,
  verifyUser,
  attachUser,
};
