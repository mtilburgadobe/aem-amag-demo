/* de-service-auto-services-online-termin-buchen-html — scroll-state chrome of the OTV wizard, ported from the site bundle
   (clientlib-amagch.min.js, the tabs component's window "scroll" handler next to `toggleClass("nav-open"`): on every scroll the
   .sticky-anchor gets .nav-open while the fixed header is shown (header inline top === "0px"); once the anchor has been scrolled
   past (anchorTop + scrollY > carSelectionHeight [+ headerHeight when nav-open]) the step bar becomes position:fixed below 1200px
   (the anchor keeps its height as padding-bottom) and stays relative at ≥1200 where CSS sticky does the work; `top` is left to the
   CSS (.nav-open → 75px / 121px, else 0). Header hide-on-scroll itself runs from canon.js. Other interactions are added only from
   motion-observe on live (stardust/replica/motion/<slug>.json). */
(function () {
  var anchor = document.querySelector('#amag-otv .sticky-anchor'), nav = document.querySelector('#amag-otv .tab-header-navigation-container');
  var header = document.querySelector('.amag-header'), car = document.querySelector('#amag-otv .car-selection-container');
  if (!anchor || !nav) return;
  function onScroll() {
    var t = nav.offsetHeight, r = anchor.classList.contains('nav-open'), i = car ? car.offsetHeight : 0;
    if (header) { anchor.classList.toggle('nav-open', header.style.top === '0px'); if (r) i += header.offsetHeight; }
    var anchorTop = anchor.getBoundingClientRect().top + window.scrollY;
    if (anchorTop + window.scrollY > i) {
      if (window.innerWidth <= 1200) anchor.style.paddingBottom = t + 'px';
      nav.style.position = window.innerWidth > 1200 ? 'relative' : 'fixed'; nav.style.top = ''; nav.style.width = '100%';
      nav.style.transition = 'top 350ms ease';
    } else {
      anchor.style.paddingBottom = '0px'; nav.style.position = 'relative'; nav.style.top = '0px'; nav.style.transition = '';
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
})();
/* Brand dropdown — fired on live (motion-observe 1440 + 360, poke "#brand .generic-dynamic-dropdown-button"): the button click adds
   .show to .generic-dynamic-dropdown-menu and to the .generic-dynamic-dropdown-chevron and .active to the label; the next click
   elsewhere removes them (menu .show seen added then removed). Transitions (.3s on chevron transform / label font-size, top,
   transform) come from the lifted CSS. The native <select> stays hidden as on live; no option wiring (booking backend is host-bound). */
(function () {
  document.querySelectorAll('#amag-otv .generic-dynamic-dropdown-wrapper').forEach(function (w) {
    var btn = w.querySelector('.generic-dynamic-dropdown-button'), menu = w.querySelector('.generic-dynamic-dropdown-menu'),
        chev = w.querySelector('.generic-dynamic-dropdown-chevron'), label = w.querySelector('.generic-dynamic-dropdown-label');
    if (!btn || !menu) return;
    function set(open) { menu.classList.toggle('show', open); if (chev) chev.classList.toggle('show', open); if (label) label.classList.toggle('active', open); }
    btn.addEventListener('click', function (e) { e.preventDefault(); set(!menu.classList.contains('show')); });
    document.addEventListener('click', function (e) { if (!w.contains(e.target)) set(false); });
  });
})();
