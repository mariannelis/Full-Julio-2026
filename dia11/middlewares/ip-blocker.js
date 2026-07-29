function normalizeIp(ip = '') {
  return ip.replace(/^::ffff:/, '');
}

function createIpBlocker(blockedIp = '192.168.1.100') {
  return function ipBlocker(req, res, next) {
    const clientIp = normalizeIp(req.ip);

    if (clientIp === normalizeIp(blockedIp)) {
      return res.status(403).json({
        error: 'Forbidden',
        message: `La IP ${clientIp} está bloqueada`
      });
    }

    next();
  };
}

module.exports = createIpBlocker;
