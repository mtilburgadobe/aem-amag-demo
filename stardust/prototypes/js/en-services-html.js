/* en-services-html — page interactions (direct-entry pill now lives in canon.js). */

/* Garage chooser modal (observed live on the "Contact garage" click: body.modal-open, .modal.show, 300ms dialog transform). */
(function () {
  document.querySelectorAll('.amag-garageOverlay--noCookie').forEach(function (wrap) {
    var btn = wrap.querySelector('.amag-ctaWrapper__button'), modal = wrap.querySelector('.amag-garageOverlay.modal');
    if (!btn || !modal) return;
    function open() { modal.style.display = 'block'; requestAnimationFrame(function () { modal.classList.add('show'); }); document.body.classList.add('modal-open'); }
    function close() { modal.classList.remove('show'); document.body.classList.remove('modal-open'); setTimeout(function () { modal.style.display = ''; }, 300); }
    btn.addEventListener('click', function (e) { e.preventDefault(); open(); });
    modal.querySelectorAll('.amag-garageOverlay__icon--close').forEach(function (c) { c.addEventListener('click', close); });
  });
})();
