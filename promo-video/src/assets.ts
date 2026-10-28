/** Everything the web player must prefetch before playback (paths relative to public/). */
export const ASSETS = Array.from(
  new Set([
    "audio/mix.wav",
    "img/logo.png",
    "screens/landing.png",
    "screens/review.png",
    "screens/host.png",
    "screens/preview.png",
  ]),
);
