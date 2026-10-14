/* Header scroll morph — lifted from clientlib-amagch.min.js: the navbar and the white filler keep their
   "--transparent" classes while window.pageYOffset < stageCarousel.clientHeight - 100, else they drop them. */
(function () {
  var stage = document.querySelector('.amagCh-stageCarousel');
  var nav = document.querySelector('.amag-header__navbar');
  var before = document.querySelector('.amag-header__beforeDivWhite');
  if (!nav) return;
  function update() {
    var transparent = !!stage && window.pageYOffset < stage.clientHeight - 100;
    nav.classList.toggle('amag-header__navbar--transparent', transparent);
    if (before) before.classList.toggle('amag-header__beforeDivWhite--transparent', transparent);
  }
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
})();

/* Observed interactions (motion-observe, live): accordion expand, stage carousel next/prev, footer list toggle (<768), header after-filler morph. */
(function () {
  var after = document.querySelector('.amag-header__afterDivWhite');
  if (after) { var stage = document.querySelector('.amagCh-stageCarousel'); var u2 = function () { after.classList.toggle('amag-header__afterDivWhite--transparent', !!stage && window.pageYOffset < stage.clientHeight - 100); }; window.addEventListener('scroll', u2, { passive: true }); u2(); }
  document.querySelectorAll('.cmp-accordion__button').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var panel = btn.closest('.cmp-accordion__item').querySelector('.cmp-accordion__panel');
      var open = btn.classList.toggle('cmp-accordion__button--expanded');
      panel.classList.toggle('cmp-accordion__panel--hidden', !open); panel.classList.toggle('cmp-accordion__panel--expanded', open);
      btn.setAttribute('aria-expanded', String(open));
    });
  });
  var stageEl = document.querySelector('.amagCh-stageCarousel .cmp-carousel');
  if (stageEl) {
    var items = stageEl.querySelectorAll('.cmp-carousel__content > .cmp-carousel__item'), dots = stageEl.querySelectorAll('.cmp-carousel__indicator');
    var go = function (d) { var i = Array.prototype.findIndex.call(items, function (it) { return it.classList.contains('cmp-carousel__item--active'); }); var n = (i + d + items.length) % items.length;
      items.forEach(function (it, k) { it.classList.toggle('cmp-carousel__item--active', k === n); }); dots.forEach(function (it, k) { it.classList.toggle('cmp-carousel__indicator--active', k === n); }); };
    var nx = stageEl.querySelector('.cmp-carousel__action--next'), pv = stageEl.querySelector('.cmp-carousel__action--previous');
    if (nx) nx.addEventListener('click', function () { go(1); }); if (pv) pv.addEventListener('click', function () { go(-1); });
    dots.forEach(function (d, k) { d.addEventListener('click', function () { go(k - Array.prototype.indexOf.call(dots, stageEl.querySelector('.cmp-carousel__indicator--active'))); }); });
  }
  document.querySelectorAll('.amag-footer__toggleLink').forEach(function (a) {
    a.addEventListener('click', function (e) { e.preventDefault(); var t = document.querySelector(a.getAttribute('href')); if (!t) return; var open = t.classList.toggle('show'); a.classList.toggle('collapsed', !open); });
  });
})();

/* Header hide-on-scroll — lifted from clientlib-amagch.min.js (@1241777): scroll deltas under 50px are ignored;
   scrolling down past the header's own height sets .amag-header top:-height, any other move restores top:0. */
(function () {
  var h = document.querySelector('.amag-header'); if (!h) return;
  var a = window.scrollY;
  window.addEventListener('scroll', function () {
    var s = window.scrollY, r = h.offsetHeight;
    if (s - a < 50 && a - s < 50) return;
    if (s > a && s > r) h.style.top = '-' + r + 'px'; else if (a !== s) h.style.top = '0';
    a = s;
  }, { passive: true });
})();

/* direct-entry pill — ported from clientlib-amagch.min.js @2355270 (moved from en-services-html.js 2026-10-08; live runs it on every page that carries .amag-direct-entry): .show once scrollY >= 300 (50px hysteresis), click toggles pop-up + backdrop. */
(function () {
  var btn = document.querySelector('.amag-direct-entry__button'), pop = document.querySelector('.amag-direct-entry__pop-up'),
      back = document.querySelector('.amag-direct-entry__backdrop'), open = document.querySelector('.amag-direct-entry__button--open'),
      close = document.querySelector('.amag-direct-entry__button--close');
  if (!btn) return;
  var last = 0;
  window.addEventListener('scroll', function () {
    var t = window.scrollY;
    if (t - last < 50 && last - t < 50) return;
    last = t; btn.blur();
    if (t >= 300) btn.classList.add('show'); else btn.classList.remove('show');
  }, { passive: true });
  function set(on) {
    if (pop) pop.classList.toggle('show', on);
    if (back) back.classList.toggle('d-none', !on);
    if (open) open.classList.toggle('d-none', on);
    if (close) close.classList.toggle('d-none', !on);
    document.body.classList.toggle('no-scroll', on); // fired on live (winterreifen 1440 + 360): body.no-scroll while the pop-up is open
  }
  btn.addEventListener('click', function () { set(!(pop && pop.classList.contains('show'))); });
  if (back) back.addEventListener('click', function () { set(false); });
})();
/* hamburger → mobile-nav drawer: fired on live (motion-observe, de-service-auto-services-online-termin-buchen-html, 1440 + 360):
   the click toggles header--overlay-open on #header; the drawer's slideIn/slideDown come from canon.css (lifted). */
(function () {
  var h = document.querySelector('.amag-header__hamburger'), hd = document.getElementById('header');
  if (!h || !hd) return;
  h.addEventListener('click', function (e) { e.preventDefault(); var on = hd.classList.toggle('header--overlay-open'); document.documentElement.classList.toggle('overflow-hidden', on); }); // html.overflow-hidden fired with the drawer on live (winterreifen 1440 + 360)
})();
