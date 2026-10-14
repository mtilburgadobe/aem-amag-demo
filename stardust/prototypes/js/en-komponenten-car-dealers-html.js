/* en-komponenten-car-dealers-html — interactions implemented ONLY from motion-observe on live (stardust/replica/motion/en-komponenten-car-dealers-html.json):
   "Show filters" click → .off-canvas__canvas-box gains .is-shown (right:-610px→0, .5s ease-in-out), body gains .no-scroll,
   .amag-filterModal__resetButton gains .visible. The backdrop and the brand-filter panel kept .d-none on live (no class mutation), so they stay.
   Garage-row click / "Back to overview" produced no class mutation on live (Google-Maps pan + hidden-attribute toggle) — recorded as not implemented.
   Header hide-on-scroll (top .35s) and the direct-entry pill (.show) run from canon.js. */
(function () {
  var btn = document.querySelector('.storelocator__filterButton'), box = document.querySelector('.off-canvas__canvas-box'),
      reset = document.querySelector('.amag-filterModal__resetButton'), close = document.querySelector('.off-canvas__close-btn');
  if (!btn || !box) return;
  btn.addEventListener('click', function () {
    box.classList.add('is-shown'); document.body.classList.add('no-scroll'); if (reset) reset.classList.add('visible');
  });
  if (close) close.addEventListener('click', function () { box.classList.remove('is-shown'); document.body.classList.remove('no-scroll'); });
})();
