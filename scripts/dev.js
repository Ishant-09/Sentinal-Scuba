import { spawn } from 'child_process';

console.log('\x1b[36m%s\x1b[0m', '⚡ Launching GuildUp Full Stack (Backend + Frontend)...');

const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const npmOptions = {
  stdio: 'inherit',
  shell: process.platform === 'win32',
};

const server = spawn(npmCommand, ['--prefix', 'server', 'run', 'dev'], npmOptions);
const client = spawn(npmCommand, ['run', 'dev:client'], npmOptions);

let shuttingDown = false;

const shutdown = (signal) => {
  if (shuttingDown) return;
  shuttingDown = true;
  server.kill(signal);
  client.kill(signal);
};

for (const child of [server, client]) {
  child.on('error', (error) => {
    console.error(`Failed to start ${child === server ? 'server' : 'client'}:`, error);
    process.exitCode = 1;
    shutdown('SIGTERM');
  });

  child.on('close', (code, signal) => {
    if (shuttingDown) return;
    process.exitCode = code ?? 1;
    if (signal) {
      console.error(`${child === server ? 'Server' : 'Client'} stopped by ${signal}.`);
    }
    shutdown('SIGTERM');
  });
}

process.on('SIGINT', () => {
  process.exitCode = 130;
  shutdown('SIGINT');
});

process.on('SIGTERM', () => {
  process.exitCode = 143;
  shutdown('SIGTERM');
});
