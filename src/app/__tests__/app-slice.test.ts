import { expect, test } from 'vitest';
import {
  appReducer,
  finishAppLoadingAC,
  setAppStatusAC,
  startAppLoadingAC,
} from '../app-slice.ts';

test('loading state should stay active until all requests finish', () => {
  const afterFirstStart = appReducer(undefined, startAppLoadingAC());
  const afterSecondStart = appReducer(afterFirstStart, startAppLoadingAC());
  const afterOneFinish = appReducer(afterSecondStart, finishAppLoadingAC());
  const afterAllFinished = appReducer(afterOneFinish, finishAppLoadingAC());

  expect(afterOneFinish.requestsInFlight).toBe(1);
  expect(afterOneFinish.status).toBe('loading');
  expect(afterAllFinished.requestsInFlight).toBe(0);
  expect(afterAllFinished.status).toBe('succeeded');
});

test('finishing requests should not overwrite failed status', () => {
  const afterStart = appReducer(undefined, startAppLoadingAC());
  const afterFailure = appReducer(
    afterStart,
    setAppStatusAC({ status: 'failed' }),
  );
  const afterFinish = appReducer(afterFailure, finishAppLoadingAC());

  expect(afterFinish.requestsInFlight).toBe(0);
  expect(afterFinish.status).toBe('failed');
});
