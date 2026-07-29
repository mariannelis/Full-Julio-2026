let requestCount = 0;

function requestCounter(_req, _res, next) {
  requestCount += 1;
  console.log(`Solicitudes recibidas: ${requestCount}`);
  next();
}

function getRequestCount() {
  return requestCount;
}

function resetRequestCount() {
  requestCount = 0;
}

module.exports = { requestCounter, getRequestCount, resetRequestCount };
