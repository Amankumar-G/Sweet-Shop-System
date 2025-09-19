import app from './app.js';

async function startServer() {
  try {
    const port = process.env.PORT || 5000;
    const server = app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });

    process.on('SIGINT', async () => {
      console.log('\nGracefully shutting down...');
      server.close(() => {
        console.log('Server stopped');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
