import app from './app.js';

const PORT = Number(process.env.PORT) || 3001;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 API server running at http://localhost:${PORT}`);
    console.log(`📡 Auth endpoints at http://localhost:${PORT}/api/auth`);
    console.log(`🌐 CORS origin: ${process.env.CORS_ORIGIN || '*'}`);
});
