const pm2 = require("pm2");

pm2.connect(function(err) {
  if (err) {
    console.error(err);
    process.exit(2);
  }
  console.log("Inside PM#");
  pm2.start(
    {
      script: "yarn --name 'next' --interpreter bash -- start",
      log_file: "error.log"
    },
    (err, apps) => {
      pm2.disconnect();
      if (err) {
        throw err;
      }
    }
  );
});
