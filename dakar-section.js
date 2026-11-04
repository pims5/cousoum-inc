(function () {
  'use strict';

  const root = document.querySelector('[data-dk]');
  if (!root) return;

  const stage = root.querySelector('.dk-stage');
  if (!stage) return;

  // Keep the slideshow limited to files actually present in the repository.
  const sources = Array.from(root.querySelectorAll('.dk-pool li'))
    .map((item) => item.dataset.src)
    .filter((source, index, list) => source && !/dakar-04\.webp(?:$|[?#])/i.test(source) && list.indexOf(source) === index);

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

  function fallbackUrl(source) {
    return source.replace(/dakar-\d{2}(?=\.webp(?:$|[?#]))/i, 'dakar-01');
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
          image.dataset.fallbackAttempted = 'false';

          image.onerror = () => {
            const fallback = fallbackUrl(source);
            if (fallback !== source && image.dataset.fallbackAttempted !== 'true') {
              image.dataset.fallbackAttempted = 'true';
              image.src = fallback;
              return;
            }

            console.error('Dakar slideshow image failed to load:', image.src);
            slide.remove();
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
  const onMediaChange = () => build();
  if (mq.addEventListener) {
    mq.addEventListener('change', onMediaChange);
  } else if (mq.addListener) {
    mq.addListener(onMediaChange);
  }

  window.addEventListener('pagehide', () => {
    clearTimers();
    if (mq.removeEventListener) {
      mq.removeEventListener('change', onMediaChange);
    } else if (mq.removeListener) {
      mq.removeListener(onMediaChange);
    }
  }, { once: true });
})();
