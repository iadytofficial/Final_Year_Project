const os = require('os');

async function metrics(req, res) {
  const mem = process.memoryUsage();
  const load = os.loadavg();
  res.json({
    uptime: process.uptime(),
    rss: mem.rss,
    heapUsed: mem.heapUsed,
    load1: load[0],
    load5: load[1],
    load15: load[2],
    nodeEnv: process.env.NODE_ENV || 'development',
  });
}

module.exports = { metrics };
}