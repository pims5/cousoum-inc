(function () {
  'use strict';

  const root = document.querySelector('[data-dk]');
  if (!root) return;

  const stage = root.querySelector('.dk-stage');
  if (!stage) return;

  // dakar-04.webp is absent; use only the image files present in the repository.
  const sources = Array.from(root.querySelectorAll('.dk-pool li'))
    .map((item) => item.dataset.src)
    .filter((source) => source && !/dakar-04\.webp(?:$|[?#])/i.test(source));
  const mq = matchMedia('(min-width: 900px)');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const timers = [];

  function clearTimers() {
    timers.forEach((timer) => {
      clearTimeout(timer);
      clearInterval(timer);
    });
    timers.length = 0;
  }

  function show(slides, index) {
    slides.forEach((slide, slideIndex) => slide.classList.toggle('on', slideIndex === index));
  }

  function run(slides, columnIndex) {
    if (!slides.length) return;
    requestAnimationFrame(() => requestAnimationFrame(() => show(slides, 0)));
    if (reduced.matches || slides.length < 2) return;

    const timeout = setTimeout(() => {
      let index = 0;
      const interval = setInterval(() => {
        if (document.hidden) return;
        index = (index + 1) % slides.length;
        show(slides, index);
      }, 7000);
      timers.push(interval);
    }, columnIndex * 2300);
    timers.push(timeout);
  }

  function build() {
    clearTimers();
    stage.replaceChildren();
    const columns = mq.matches ? 3 : 1;
    stage.style.setProperty('--dk-n', String(columns));

    for (let columnIndex = 0; columnIndex < columns; columnIndex += 1) {
      const column = document.createElement('div');
      column.className = 'dk-col';
      const slides = sources
        .filter((_, sourceIndex) => sourceIndex % columns === columnIndex)
        .map((source) => {
          const slide = document.createElement('div');
          slide.className = 'dk-s';
          const image = new Image();
          image.alt = '';
          image.decoding = 'async';
          image.onerror = () => {
            console.error('Dakar slideshow image failed to load:', source);
            image.onerror = null;
            if (!/dakar-01\.webp(?:$|[?#])/i.test(source)) image.src = 'dakar-01.webp';
            else slide.remove();
          };
          image.src = source;
          slide.appendChild(image);
          column.appendChild(slide);
          return slide;
        });
      stage.appendChild(column);
      run(slides, columnIndex);
    }
  }

  build();
  if (mq.addEventListener) mq.addEventListener('change', build);
  else if (mq.addListener) mq.addListener(build);
})();
