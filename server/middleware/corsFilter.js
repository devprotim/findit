/**
 * CORS Security Filter
 * Handles Cross-Origin Resource Sharing with advanced security controls
 */

const allowedOrigins = [
  'http://localhost:4200',  // Development Angular
  'http://localhost:3000',  // Development server
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
  ...(process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [])
].filter(Boolean);

const corsFilter = (req, res, next) => {
  const origin = req.headers.origin;

  // Security logging
  console.log(`CORS request from origin: ${origin}`);

  // Dynamic origin validation
  if (allowedOrigins.includes(origin) || !origin) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
  } else {
    // Log suspicious requests
    console.warn(`Blocked CORS request from unauthorized origin: ${origin}`);
    return res.status(403).json({
      error: 'CORS policy violation',
      message: 'Origin not allowed'
    });
  }

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-API-Key'
  );
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  next();
};

// Advanced CORS filter with request-specific logic
const advancedCorsFilter = (req, res, next) => {
  const origin = req.headers.origin;
  const userAgent = req.headers['user-agent'];
  const apiKey = req.headers['x-api-key'];

  // Different CORS policies based on request type
  if (req.path.startsWith('/api/public')) {
    // Public APIs - more permissive
    res.setHeader('Access-Control-Allow-Origin', '*');
  } else if (req.path.startsWith('/api/admin')) {
    // Admin APIs - very restrictive
    const adminOrigins = ['https://admin.yourdomain.com'];
    if (!adminOrigins.includes(origin)) {
      return res.status(403).json({ error: 'Admin access denied' });
    }
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    // Regular APIs - standard validation
    if (allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    } else {
      return res.status(403).json({ error: 'Origin not allowed' });
    }
  }

  // Security headers
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Rate limiting for CORS requests
  if (req.corsRequestCount > 100) {
    return res.status(429).json({ error: 'Too many CORS requests' });
  }

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  next();
};

module.exports = {
  corsFilter,
  advancedCorsFilter
};
