const express = require("express");
const next = require("next");
const Rollbar = require("rollbar");

function installRollbarErrorHandler(app) {
  const _renderErrorToHTML = app.renderErrorToHTML.bind(app);
  const rollbar = new Rollbar({
    accessToken: process.env.ROLLBAR_SERVER_TOKEN,
    captureUncaught: true,
    captureUnhandledRejections: true
  });
  const errorHandler = rollbar.errorHandler();
  app.renderErrorToHTML = (err, req, res, pathname, query) => {
    if (err) {
      errorHandler(err, req, res, () => {
        console.log("Error occured");
      });
    }
    return _renderErrorToHTML(err, req, res, pathname, query);
  };
  return app;
}

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const appWithRollbar = installRollbarErrorHandler(app);
const handle = appWithRollbar.getRequestHandler();

appWithRollbar.prepare().then(() => {
  const server = express();

  server.all("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
