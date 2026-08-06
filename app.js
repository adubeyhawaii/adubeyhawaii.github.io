(function () {
  var modal    = document.getElementById('pdfModal');
  var frame    = document.getElementById('pdfFrame');
  var titleEl  = document.getElementById('pdfModalTitle');
  var dlEl     = document.getElementById('pdfDownload');
  var closeBtn = document.getElementById('pdfClose');
  var lastFocus = null;

  var triggers = document.querySelectorAll('[data-pdf]');
  if (!triggers.length) return;              // page has no papers

  // iOS/Android render PDFs poorly in an iframe — open natively instead.
  var isMobile = /iPad|iPhone|iPod|Android/i.test(navigator.userAgent) ||
                 (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  // no modal markup on this page? fall back to opening the file directly
  var hasModal = modal && frame && titleEl && dlEl && closeBtn;

  function openPaper(el) {
    var pdf = el.getAttribute('data-pdf');

    if (isMobile || !hasModal) {
      window.open(pdf, '_blank', 'noopener');
      return;
    }

    lastFocus = document.activeElement;
    titleEl.textContent = el.getAttribute('data-title') || '';
    dlEl.href = pdf;
    // hide the thumbnail sidebar; leave zoom at the viewer default
    frame.src = pdf + '#navpanes=0';
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function closePaper() {
    modal.classList.remove('open');
    frame.src = 'about:blank';             // stop rendering / free memory
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }

  triggers.forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      openPaper(el);
    });
    el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openPaper(el); }
    });
  });

  if (!hasModal) return;

  closeBtn.addEventListener('click', closePaper);
  modal.addEventListener('click', function (e) { if (e.target === modal) closePaper(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('open')) closePaper();
  });
})();
