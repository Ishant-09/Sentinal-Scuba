import { spawn, execSync } from 'child_process';

console.log('\x1b[36m%s\x1b[0m', '⚡ Launching GuildUp Full Stack (Backend + Frontend)...');

// Clean up any stale process holding port 4000
try {
  const pids = execSync('lsof -ti:4000', { stdio: ['pipe', 'pipe', 'ignore'], encoding: 'utf8' }).trim();
  if (pids) {
    pids.split('\n').forEach((pid) => {
      try {
        process.kill(Number(pid), 'SIGKILL');
      } catch {}
    });
  }
} catch {}

const server = spawn('npm', ['--prefix', 'server', 'run', 'dev'], {
  stdio: 'inherit',
  shell: true
});

const client = spawn('npm', ['run', 'dev:client'], {
  stdio: 'inherit',
  shell: true
});

const cleanup = () => {
  try {
    server.kill('SIGINT');
  } catch {}
  try {
    client.kill('SIGINT');
  } catch {}
  process.exit();
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('exit', cleanup);
