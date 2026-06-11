// Muhammad Usman — Deep Vision Studio · shared site behaviour
(function(){
  if (window.lucide) lucide.createIcons();

  // mobile menu
  var burger = document.getElementById('burger');
  var menu = document.getElementById('mobileMenu');
  if (burger && menu){
    burger.addEventListener('click', function(){
      var open = menu.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    menu.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){ menu.classList.remove('open'); burger.setAttribute('aria-expanded','false'); });
    });
  }

  // ----- count-up for stats -----
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function fmt(v, dec, comma){
    var n = dec>0 ? v.toFixed(dec) : Math.round(v).toString();
    if(comma){
      var parts = n.split('.');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      n = parts.join('.');
    }
    return n;
  }
  function finalText(el){
    return (el.dataset.pre||'') + fmt(parseFloat(el.dataset.num), parseInt(el.dataset.dec||'0',10), el.dataset.comma==='1') + (el.dataset.suf||'');
  }
  function animateCount(el){
    if(el.dataset.counted) return;
    el.dataset.counted = '1';
    // If hidden tab or reduced motion, just show the final value (no frozen 0).
    if(reduceMotion || document.hidden){ el.textContent = finalText(el); return; }
    var to = parseFloat(el.dataset.num);
    var dec = parseInt(el.dataset.dec||'0',10);
    var comma = el.dataset.comma==='1';
    var pre = el.dataset.pre||'', suf = el.dataset.suf||'';
    var dur = 1500, start = null;
    el.textContent = pre + fmt(0, dec, comma) + suf;
    function tick(ts){
      if(start===null) start = ts;
      var p = Math.min((ts-start)/dur, 1);
      var eased = 1 - Math.pow(1-p, 3);
      el.textContent = pre + fmt(to*eased, dec, comma) + suf;
      if(p < 1){ requestAnimationFrame(tick); }
      else { el.textContent = finalText(el); }
    }
    requestAnimationFrame(tick);
  }

  // ----- scroll reveal (position-based, reliable in any context) -----
  function revealInView(){
    var trigger = window.innerHeight * 0.92;
    document.querySelectorAll('.reveal:not(.in)').forEach(function(el){
      if(el.getBoundingClientRect().top < trigger){ el.classList.add('in'); }
    });
    document.querySelectorAll('[data-num]:not([data-counted])').forEach(function(el){
      if(el.getBoundingClientRect().top < trigger){ animateCount(el); }
    });
  }
  revealInView();
  window.addEventListener('scroll', revealInView, { passive:true });
  window.addEventListener('resize', revealInView, { passive:true });
  window.addEventListener('load', revealInView);

  // Watchdog: throttled/background tabs freeze CSS transitions at opacity 0,
  // and rAF count-ups never run. Force final state so nothing is stuck.
  var ticks = 0;
  var watchdog = setInterval(function(){
    revealInView();
    document.querySelectorAll('.reveal.in').forEach(function(el){
      if (parseFloat(getComputedStyle(el).opacity) < 0.05){
        el.style.transition = 'none'; el.style.opacity = '1'; el.style.transform = 'none';
      }
    });
    document.querySelectorAll('[data-num]').forEach(function(el){
      if(!el.dataset.counted || el.textContent.trim()==='' ){ el.dataset.counted='1'; el.textContent = finalText(el); }
    });
    if (++ticks > 8) clearInterval(watchdog);
  }, 1100);

  // email form (present on pages with #ctaForm)
  var form = document.getElementById('ctaForm');
  var done = document.getElementById('ctaDone');
  if (form && done){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var input = document.getElementById('ctaEmail');
      var email = input.value.trim();
      if(!email || email.indexOf('@') < 1){ input.focus(); return; }
      form.style.display = 'none';
      done.classList.add('show');
      if (window.lucide) lucide.createIcons();
    });
  }
})();
