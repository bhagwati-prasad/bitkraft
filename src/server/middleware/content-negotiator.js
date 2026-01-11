const BOT_USER_AGENTS = [
  'googlebot',
  'bingbot',
  'slurp',
  'duckduckbot',
  'baiduspider',
  'yandexbot',
  'facebookexternalhit',
  'twitterbot',
  'rogerbot',
  'linkedinbot',
  'embedly',
  'quora link preview',
  'showyoubot',
  'outbrain',
  'pinterest',
  'slackbot',
  'vkshare',
  'w3c_validator',
  'whatsapp'
];

function isBot(userAgent) {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();
  return BOT_USER_AGENTS.some(bot => ua.includes(bot));
}

function isSPANavigation(req) {
  return req.headers['x-bitkraft-spa'] === 'true' || 
         req.headers['x-spa-navigation'] === 'true';
}

export function contentNegotiator(req, res, next) {
  const userAgent = req.headers['user-agent'] || '';
  
  if (isBot(userAgent)) {
    req.renderMode = 'SSR';
    req.reason = 'bot-detected';
  } else if (isSPANavigation(req)) {
    req.renderMode = 'SPA';
    req.reason = 'spa-navigation';
  } else {
    req.renderMode = 'SSR';
    req.reason = 'first-load';
  }
  
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[ContentNegotiator] ${req.method} ${req.path} → ${req.renderMode} (${req.reason})`);
  }
  
  next();
}

export default contentNegotiator;
