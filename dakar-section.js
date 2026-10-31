(function () {
  const root = document.querySelector('[data-dk]');
  if (!root) return;

  const stage = root.querySelector('.dk-stage');
  const src = Array.from(root.querySelectorAll('.dk-pool li')).map((el) => el.dataset.src).filter(Boolean);
  const mq = matchMedia('(min-width: 900px)');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const timers = [];

  function clearTimers() {
    timers.forEach((timer) => clearTimeout(timer));
    timers.length = 0;
  }

  function run(slides, colIndex) {
    if (!slides.length) return;
    const first = slides[0];
    requestAnimationFrame(() => {
      requestAnimationFrame(() => first.classList.add('on'));
    });

    if (reduced.matches || slides.length < 2) return;

    const delay = colIndex * 2300;
    const timeoutId = setTimeout(() => {
      let index = 0;
      const intervalId = setInterval(() => {
        if (document.hidden) return;
        slides[index].classList.remove('on');
        index = (index + 1) % slides.length;
        slides[index].classList.add('on');
      }, 7000);
      timers.push(intervalId);
    }, delay);
    timers.push(timeoutId);
  }

  function build() {
    clearTimers();
    stage.innerHTML = '';

    const columns = mq.matches ? 3 : 1;
    stage.style.setProperty('--dk-n', String(columns));

    for (let colIndex = 0; colIndex < columns; colIndex += 1) {
      const column = document.createElement('div');
      column.className = 'dk-col';

      const slides = src
        .filter((_, index) => index % columns === colIndex)
        .map((url, index) => {
          const slide = document.createElement('div');
          slide.className = 'dk-s';

          const image = new Image();
          image.alt = '';
          image.decoding = 'async';
          if (index > 0) image.loading = 'lazy';
          image.src = url;

          slide.appendChild(image);
          return slide;
        });

      slides.forEach((slide) => column.appendChild(slide));
      stage.appendChild(column);
      run(slides, colIndex);
    }
  }

  build();

  if (mq.addEventListener) {
    mq.addEventListener('change', build);
  } else if (mq.addListener) {
    mq.addListener(build);
  }
})();
