module.exports = [
  {
    script: "yarn --name 'next' --interpreter bash -- start",
    exp_backoff_restart_delay: 100
  }
];
