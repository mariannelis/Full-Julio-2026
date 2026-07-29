function authorization(req, res, next) {
  const token = req.get('authorization') || req.get('x-auth-token');

  if (!token || token.trim() === '' || token.trim().toLowerCase() === 'bearer') {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Se requiere un token de autenticación'
    });
  }

  next();
}

module.exports = authorization;
