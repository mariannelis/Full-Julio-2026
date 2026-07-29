function serverError(error, _req, res, _next) {
  const status = error.status || 500;

  if (status >= 500) console.error(error.stack);

  res.status(status).json({
    error: status === 500 ? 'Internal Server Error' : 'Request Error',
    message: error.message || 'Ha ocurrido un error inesperado'
  });
}

module.exports = serverError;
