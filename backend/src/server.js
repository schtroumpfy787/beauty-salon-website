const config = require('./config');
const app = require('./app');

const PORT = config.port;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend server running on port ${PORT} (${config.nodeEnv})`);
});
