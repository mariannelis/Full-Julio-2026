import 'dotenv/config';
import dns from 'node:dns';
import app from './src/app.js';
import { connectDB } from './src/config/db.js';


if (process.env.DNS_SERVERS) {
  dns.setServers(process.env.DNS_SERVERS.split(',').map(x => x.trim()).filter(Boolean));
}

const port = Number(process.env.PORT || 3000);
connectDB()
  .then(() => app.listen(port, () => console.log(`Backend listo: http://localhost:${port}`)))
  .catch(err => {
    console.error('No fue posible conectar MongoDB:', err.message);
    process.exitCode = 1;
  });
