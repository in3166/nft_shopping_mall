const { createProxyMiddleware } = require('http-proxy-middleware');
const CONFIG = require('./ipconfig.json');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: `${CONFIG.IP}:15000`,
      changeOrigin: true,
    }),
  );

  app.use(
    '/uploads',
    createProxyMiddleware({
      target: `${CONFIG.IP}:15000`,
      changeOrigin: true,
    }),
  );

  // app.use(
  //   '/userManage',
  //   createProxyMiddleware({
  //     target: 'http://localhost:6000',
  //     changeOrigin: true,
  //   }),
  // );
};
