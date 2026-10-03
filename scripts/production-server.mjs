import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { setTimeout as delay } from 'node:timers/promises';
import { resolve } from 'node:path';

const projectRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));
const nextCli = resolve(projectRoot, 'node_modules/next/dist/bin/next');

export async function withProductionServer(check) {
  const hostname = '127.0.0.1';
  const port = process.env.PRODUCTION_TEST_PORT ?? '3179';
  const baseUrl = `http://${hostname}:${port}`;
  const server = spawn(
    process.execPath,
    [nextCli, 'start', '--hostname', hostname, '--port', port],
    {
      cwd: projectRoot,
      env: { ...process.env, PORT: port },
      stdio: 'ignore',
      windowsHide: true,
    },
  );

  try {
    let ready = false;

    for (let attempt = 0; attempt < 60; attempt += 1) {
      if (server.exitCode !== null) {
        throw new Error('The production server exited before becoming ready.');
      }

      try {
        const response = await fetch(baseUrl);
        if (response.ok) {
          ready = true;
          break;
        }
      } catch {
        await delay(250);
        continue;
      }

      await delay(250);
    }

    if (!ready) {
      throw new Error('The production server did not become ready in time.');
    }

    await check(baseUrl);
  } finally {
    if (server.exitCode === null) {
      server.kill();
      await Promise.race([
        new Promise((resolveExit) => server.once('exit', resolveExit)),
        delay(2000),
      ]);
    }
  }
}
