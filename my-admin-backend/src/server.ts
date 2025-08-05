import http from 'http';
import app from './index';

const port = process.env.PORT || 5001;

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
