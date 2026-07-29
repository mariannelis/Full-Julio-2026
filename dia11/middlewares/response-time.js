function responseTime(req, res, next) {
  const start = process.hrtime.bigint();

  res.on('finish', () => {
    const elapsedMilliseconds = Number(process.hrtime.bigint() - start) / 1_000_000;
    console.log(`${req.method} ${req.originalUrl} tardó ${elapsedMilliseconds.toFixed(2)} ms`);
  });

  next();
}

module.exports = responseTime;
