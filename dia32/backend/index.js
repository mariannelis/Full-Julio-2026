import "dotenv/config";
import app from "./src/app.js";

const port = process.env.PORT || 3001;

if (!process.env.VERCEL) {
  app.listen(port, () => console.log(`API Día 32: http://localhost:${port}`));
}

export default app;
