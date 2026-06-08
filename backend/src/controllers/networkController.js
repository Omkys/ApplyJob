import { asyncHandler } from '../utils/asyncHandler.js';
import { logInfo } from '../utils/logger.js';
import * as networkService from '../services/networkService.js';

export const networkTest = asyncHandler(async (_req, res) => {
  logInfo('network_test', 'GET /api/network-test — request received');
  const result = await networkService.runNetworkTest();
  res.json(result);
});
