// Counter so we can rate limit the transaction performance tracking
let dispatchCallCounter = 0;
export const shouldTrackTransaction = options => {
  const {
    enabled: trackingEnabled,
    samplingRate = 100
  } = options;
  const shouldTrack = trackingEnabled && ++dispatchCallCounter === samplingRate;

  if (shouldTrack) {
    dispatchCallCounter = 0;
  }

  return shouldTrack;
};