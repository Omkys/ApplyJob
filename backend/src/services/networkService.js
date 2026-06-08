import dns from 'dns/promises';
import net from 'net';
import { env } from '../config/env.js';
import { logInfo, logError } from '../utils/logger.js';

const TIMEOUT_MS = 10_000;

function testTcpConnection(host, port) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    let settled = false;

    const finish = (result) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      socket.destroy();
      resolve(result);
    };

    const timer = setTimeout(() => finish('timeout'), TIMEOUT_MS);

    socket.once('connect', () => finish('connected'));
    socket.once('error', (err) => {
      logError('network_test', `TCP error on ${host}:${port}`, err);
      finish('error');
    });

    socket.connect(port, host);
  });
}

export async function runNetworkTest() {
  const host = env.smtp.host || 'smtp.gmail.com';

  logInfo('network_test', `Starting network test for ${host}`);

  let dnsResolved = false;
  let ip = null;

  try {
    const addresses = await dns.resolve4(host);
    if (addresses.length > 0) {
      dnsResolved = true;
      ip = addresses[0];
      logInfo('network_test', `DNS resolved ${host} → ${ip}`);
    }
  } catch (err) {
    logError('network_test', `DNS resolution failed for ${host}`, err);
  }

  const [port587, port465] = await Promise.all([
    testTcpConnection(host, 587),
    testTcpConnection(host, 465),
  ]);

  logInfo('network_test', 'Network test completed', { dnsResolved, ip, port587, port465 });

  return {
    dnsResolved,
    ip,
    port587,
    port465,
  };
}
