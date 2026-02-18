import { app } from './app.js';
import { env } from './config/env.js';

app.listen(env.PORT, env.HOST, () => {
  console.log(`Backend is running at http://${env.HOST}:${env.PORT}`);
});
