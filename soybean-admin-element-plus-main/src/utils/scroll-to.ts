/**
 * 平滑滚动（从 RuoYi-Vue3 src/utils/scroll-to.js 移植）
 */
function easeInOutQuad(t: number, b: number, c: number, d: number) {
  t /= d / 2;
  if (t < 1) {
    return (c / 2) * t * t + b;
  }
  t -= 1;
  return (-c / 2) * (t * (t - 2) - 1) + b;
}

function move(amount: number) {
  document.documentElement.scrollTop = amount;
  (document.body.parentNode as HTMLElement).scrollTop = amount;
  document.body.scrollTop = amount;
}

function position() {
  return document.documentElement.scrollTop || (document.body.parentNode as HTMLElement).scrollTop || document.body.scrollTop;
}

export function scrollTo(to: number, duration = 500, callback?: () => void) {
  const start = position();
  const change = to - start;
  const increment = 20;
  let currentTime = 0;
  const animateScroll = function () {
    currentTime += increment;
    const val = easeInOutQuad(currentTime, start, change, duration);
    move(val);
    if (currentTime < duration) {
      requestAnimationFrame(animateScroll);
    } else if (callback && typeof callback === 'function') {
      callback();
    }
  };
  animateScroll();
}
