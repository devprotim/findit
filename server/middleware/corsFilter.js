/**
 * CORS Security Filter
 * Handles Cross-Origin Resource Sharing with advanced security controls
 */

const allowedOrigins = [
  'http://localhost:4200',  // Development Angular
  'http://localhost:3000',  // Development server
  'http://127.0.0.1:4200',  // Alternative localhost
  'http://127.0.0.1:3000',  // Alternative localhost
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
  ...(process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [])
].filter(Boolean);

// Add dynamic Vercel preview URLs
const isDynamicVercelOrigin = (origin) => {
  if (!origin) return false;
  // Match Vercel preview URLs pattern
  return origin.match(/^https:\/\/.*\.vercel\.app$/) !== null;
};

const corsFilter = (req, res, next) => {
  const origin = req.headers.origin;

  // Security logging
  console.log(`CORS request from origin: ${origin}, method: ${req.method}, path: ${req.path}`);

  // Set CORS headers first (before any validation)
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-API-Key'
  );
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours

  // Check if origin is allowed
  const isOriginAllowed = allowedOrigins.includes(origin) ||
    isDynamicVercelOrigin(origin) ||
    !origin ||
    origin === 'null';

  // Handle preflight requests first
  if (req.method === 'OPTIONS') {
    if (isOriginAllowed) {
      res.setHeader('Access-Control-Allow-Origin', origin || '*');
    } else {
      console.warn(`Blocked OPTIONS request from unauthorized origin: ${origin}`);
      res.setHeader('Access-Control-Allow-Origin', 'null');
    }
    return res.status(200).end();
  }

  // Dynamic origin validation for actual requests
  if (isOriginAllowed) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
  } else {
    // Log suspicious requests
    console.warn(`Blocked CORS request from unauthorized origin: ${origin}`);
    res.setHeader('Access-Control-Allow-Origin', 'null');
    return res.status(403).json({
      error: 'CORS policy violation',
      message: 'Origin not allowed'
    });
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
