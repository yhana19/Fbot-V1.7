const os = require('os');

module.exports = {
  name: 'uptimw',
  description: 'Uptime of the bot',
  author: 'joshua Apostol',
  nashPrefix: false,
  execute(api, event, args, prefix, commands) {
    const uptimeMessage = generateStatusMessage();
    api.sendMessage(uptimeMessage, event.threadID);
  },
};

function generateStatusMessage() {
  const uptime = process.uptime();
  const hours = Math.floor(uptime / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = Math.floor(uptime % 60);

  const cpuUsage = getCpuUsage();
  const ramUsage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
  const cores = os.cpus().length;
  const ping = calculatePing();
  const osPlatform = os.platform();
  const cpuArchitecture = os.arch();

  return `Credence has been working for ${hours} hour(s), ${minutes} minute(s), and ${seconds} second(s).\n\n` +
    `⚙ CPU Usage: ${cpuUsage}%\n` +
    `⚙ RAM Usage: ${ramUsage} MB\n` +
    `⚙ Cores: ${cores}\n` +
    `⚙ Ping: ${ping}\n` +
    `⚙ OS Platform: ${osPlatform}\n` +
    `⚙ CPU Architecture: ${cpuArchitecture}`;
}

function getCpuUsage() {
  const cpus = os.cpus();
  let totalIdle = 0, totalTick = 0;

  for (let cpu of cpus) {
    totalIdle += cpu.times.idle;
    totalTick += Object.values(cpu.times).reduce((a, b) => a + b, 0);
  }

  const usage = (1 - totalIdle / totalTick) * 100;
  return usage.toFixed(2);
}

function calculatePing() {
  const start = Date.now();
  while (Date.now() - start < 1);
  return `${Date.now() - start}ms`;
}
