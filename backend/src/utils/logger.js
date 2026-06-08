const PREFIX = '[ApplyFlow]';

export function logInfo(step, message, data) {
  const timestamp = new Date().toISOString();
  if (data !== undefined) {
    console.log(`${PREFIX} [${timestamp}] [${step}] ${message}`, data);
  } else {
    console.log(`${PREFIX} [${timestamp}] [${step}] ${message}`);
  }
}

export function logError(step, message, error) {
  const timestamp = new Date().toISOString();
  console.error(`${PREFIX} [${timestamp}] [${step}] ${message}`);
  if (error) {
    console.error(`${PREFIX} [${timestamp}] [${step}] Error:`, error.message || error);
    if (error.stack) {
      console.error(`${PREFIX} [${timestamp}] [${step}] Stack:`, error.stack);
    }
  }
}
