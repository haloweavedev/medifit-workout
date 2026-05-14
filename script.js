/* =====================================================================
   MEDIFIT — Single dispatch script
   Loaded on every page. Each block early-returns when its DOM isn't found.
   Init order: Lenis → cursor → nav → reveals → page-specific.
   ===================================================================== */

(() => {
  'use strict';

  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ===================================================================
  // LENIS — smooth scroll
  // ===================================================================
  let lenis = null;
  function initLenis() {
    if (prefersReducedMotion || typeof Lenis === 'undefined') return;
    lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // GSAP ScrollTrigger sync
    if (window.gsap && window.ScrollTrigger) {
      lenis.on('scroll', window.ScrollTrigger.update);
      window.gsap.ticker.add((time) => lenis.raf(time * 1000));
      window.gsap.ticker.lagSmoothing(0);
    }
  }

  // Smooth-scroll anchor handler that plays well with Lenis
  function initAnchorScroll() {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;
      const id = link.getAttribute('href');
      if (id === '#' || id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      if (lenis) {
        lenis.scrollTo(target, { offset: -80, duration: 1.4 });
      } else {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  // ===================================================================
  // CURSOR
  // ===================================================================
  function initCursor() {
    if (prefersReducedMotion || window.matchMedia('(pointer: coarse)').matches) return;
    const dot  = $('.cursor-dot');
    const ring = $('.cursor-ring');
    if (!dot || !ring) return;

    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let rx = mx, ry = my;

    document.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; });

    const tick = () => {
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      requestAnimationFrame(tick);
    };
    tick();

    // Hover state on interactive elements
    const interactiveSelector = 'a, button, .program-card, .exercise-card, .day-tab, [role="tab"], input, select';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(interactiveSelector)) document.body.classList.add('cursor-hover');
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(interactiveSelector)) document.body.classList.remove('cursor-hover');
    });
  }

  // ===================================================================
  // NAVIGATION — sticky background + mobile menu
  // ===================================================================
  function initNav() {
    const nav = $('#navbar');
    const hamburger = $('#hamburger');
    const menu = $('#navMenu');
    if (!nav) return;

    const onScroll = () => {
      nav.classList.toggle('is-scrolled', window.scrollY > 24);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    if (hamburger && menu) {
      hamburger.addEventListener('click', () => {
        const isOpen = menu.classList.toggle('is-open');
        hamburger.classList.toggle('is-open', isOpen);
        hamburger.setAttribute('aria-expanded', String(isOpen));
        document.body.style.overflow = isOpen ? 'hidden' : '';
      });
      $$('.nav-link', menu).forEach((link) => {
        link.addEventListener('click', () => {
          menu.classList.remove('is-open');
          hamburger.classList.remove('is-open');
          hamburger.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        });
      });
    }
  }

  // ===================================================================
  // REVEAL ANIMATIONS — IntersectionObserver based
  // ===================================================================
  function initReveals() {
    if (prefersReducedMotion) {
      $$('[data-reveal], [data-reveal-line], [data-reveal-clip]').forEach((el) => el.classList.add('is-in'));
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    $$('[data-reveal], [data-reveal-line], [data-reveal-clip]').forEach((el) => io.observe(el));
  }

  // Hero on-load entrance (fires immediately for above-the-fold)
  function initHeroEntrance() {
    if (prefersReducedMotion) return;
    const hero = $('.hero, .page-header, .workout-header');
    if (!hero) return;
    requestAnimationFrame(() => {
      $$('[data-reveal], [data-reveal-line], [data-reveal-clip]', hero).forEach((el) => {
        el.classList.add('is-in');
      });
    });
  }

  // ===================================================================
  // GSAP PARALLAX & SCROLL EFFECTS (where available)
  // ===================================================================
  function initScrollEffects() {
    if (prefersReducedMotion || !window.gsap || !window.ScrollTrigger) return;
    const { gsap, ScrollTrigger } = window;
    gsap.registerPlugin(ScrollTrigger);

    // Subtle parallax on hero exit
    gsap.utils.toArray('.hero__title, .workout-header__title').forEach((el) => {
      gsap.to(el, {
        yPercent: -8,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: 0.6 },
      });
    });

    // Footer wordmark horizontal nudge with scroll
    gsap.utils.toArray('.footer__wordmark').forEach((el) => {
      gsap.fromTo(el, { xPercent: -2 }, {
        xPercent: 2,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
      });
    });

    // CTA glow drift
    gsap.utils.toArray('.cta__bg').forEach((el) => {
      gsap.fromTo(el, { backgroundPosition: '60% 40%' }, {
        backgroundPosition: '80% 60%',
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    });
  }

  // ===================================================================
  // ARCHIVE PAGE — filters + floating preview
  // ===================================================================
  function initFilters() {
    const levelFilter    = $('#levelFilter');
    const durationFilter = $('#durationFilter');
    const typeFilter     = $('#typeFilter');
    const grid           = $('#programsGrid');
    const counter        = $('#visibleCount');
    const empty          = $('#programsEmpty');
    if (!levelFilter || !durationFilter || !typeFilter || !grid) return;

    // Hydrate from URL params (?type=, ?level=, ?duration=)
    const params = new URLSearchParams(location.search);
    if (params.get('level'))    levelFilter.value    = params.get('level');
    if (params.get('duration')) durationFilter.value = params.get('duration');
    if (params.get('type'))     typeFilter.value     = params.get('type');

    const cards = $$('.program-card', grid);

    function applyFilters() {
      const level = levelFilter.value;
      const duration = durationFilter.value;
      const type = typeFilter.value;
      let visible = 0;
      cards.forEach((card) => {
        const ok =
          (!level    || card.dataset.level === level) &&
          (!duration || card.dataset.duration === duration) &&
          (!type     || card.dataset.type === type);
        card.dataset.hidden = String(!ok);
        if (ok) visible += 1;
      });
      if (counter) counter.textContent = String(visible).padStart(2, '0');
      if (empty) empty.classList.toggle('is-shown', visible === 0);
    }

    levelFilter.addEventListener('change', applyFilters);
    durationFilter.addEventListener('change', applyFilters);
    typeFilter.addEventListener('change', applyFilters);
    applyFilters();
  }

  // Floating image preview that follows cursor on program row hover
  function initProgramPreview() {
    const preview = $('#programPreview');
    if (!preview) return;
    const img = preview.querySelector('img');
    const cards = $$('.program-card');
    if (!cards.length) return;

    let mx = 0, my = 0;
    let px = 0, py = 0;
    let visible = false;
    let activeImg = '';

    document.addEventListener('mousemove', (e) => { mx = e.clientX + 32; my = e.clientY - 40; });

    cards.forEach((card) => {
      card.addEventListener('mouseenter', () => {
        const src = card.dataset.image;
        if (src && src !== activeImg) {
          img.src = src;
          activeImg = src;
        }
        visible = true;
        preview.classList.add('is-visible');
      });
      card.addEventListener('mouseleave', () => {
        visible = false;
        preview.classList.remove('is-visible');
      });
    });

    function tick() {
      px += (mx - px) * 0.16;
      py += (my - py) * 0.16;
      preview.style.transform = `translate3d(${px}px, ${py}px, 0)`;
      requestAnimationFrame(tick);
    }
    tick();
  }

  // ===================================================================
  // WORKOUT PAGE — program router + day tabs
  // ===================================================================
  const PROGRAMS = {
    'mobility-3-beginner': {
      title: 'Mobility & Flexibility — 3 Days.',
      breadcrumb: 'Mobility & Flexibility — 3 Days',
      level: 'Beginner',
      duration: '3 Days',
      type: 'Mobility',
      description: 'Improve range of motion and flexibility with gentle stretching routines designed for beginners.',
      days: ['Full-body Flow', 'Lower-body', 'Shoulders & T-spine', null, null],
    },
    'muscle-gain-5-beginner': {
      title: 'Muscle Gain — 5 Days.',
      breadcrumb: 'Muscle Gain — 5 Days',
      level: 'Beginner',
      duration: '5 Days',
      type: 'Muscle Gain',
      description: 'Build lean muscle mass with progressive strength training exercises designed for beginners.',
      days: ['Upper Body', 'Lower Body', 'Core & Conditioning', 'Upper Strength', 'Full Body'],
    },
    'fat-loss-3-beginner': {
      title: 'Fat Loss — 3 Days.',
      breadcrumb: 'Fat Loss — 3 Days',
      level: 'Beginner',
      duration: '3 Days',
      type: 'Fat Loss',
      description: 'Burn calories and shed unwanted fat with effective cardio and strength combinations.',
      days: ['Full-body Burn', 'Conditioning', 'Strength Circuit', null, null],
    },
    'hiit-5-beginner': {
      title: 'HIIT Training — 5 Days.',
      breadcrumb: 'HIIT — 5 Days',
      level: 'Beginner',
      duration: '5 Days',
      type: 'HIIT',
      description: 'High-intensity interval training for maximum results in minimum time.',
      days: ['Tabata Upper', 'Tabata Lower', 'EMOM Full', 'AMRAP Core', 'Sprint Finisher'],
    },
    'crossfit-5-advanced': {
      title: 'CrossFit — 5 Days.',
      breadcrumb: 'CrossFit — 5 Days',
      level: 'Advanced',
      duration: '5 Days',
      type: 'CrossFit',
      description: 'Functional fitness combining strength, cardio, and gymnastics movements.',
      days: ['Strength', 'Metcon', 'Gymnastics', 'Endurance', 'Open WOD'],
    },
    'muscle-gain-3-advanced': {
      title: 'Advanced Muscle Gain — 3 Days.',
      breadcrumb: 'Advanced Muscle Gain — 3 Days',
      level: 'Advanced',
      duration: '3 Days',
      type: 'Muscle Gain',
      description: 'Intensive muscle building with heavy compound movements and advanced techniques.',
      days: ['Push', 'Pull', 'Legs', null, null],
    },
    'fat-loss-5-advanced': {
      title: 'Advanced Fat Loss — 5 Days.',
      breadcrumb: 'Advanced Fat Loss — 5 Days',
      level: 'Advanced',
      duration: '5 Days',
      type: 'Fat Loss',
      description: 'High-intensity fat burning with complex movement patterns and metabolic conditioning.',
      days: ['Metcon A', 'Metcon B', 'Strength + Conditioning', 'Circuits', 'Long Effort'],
    },
    'mobility-3-advanced': {
      title: 'Advanced Mobility — 3 Days.',
      breadcrumb: 'Advanced Mobility — 3 Days',
      level: 'Advanced',
      duration: '3 Days',
      type: 'Mobility',
      description: 'Deep tissue work and advanced flexibility techniques for elite performance.',
      days: ['Deep Hip Series', 'Spinal Flow', 'Shoulder & Ankle', null, null],
    },
  };

  function initWorkoutPage() {
    const dayTabs = $$('.day-tab');
    const workoutDays = $$('.workout-day');
    if (!dayTabs.length || !workoutDays.length) return;

    // Hydrate program metadata from URL
    const params = new URLSearchParams(location.search);
    const programId = params.get('program');
    const program = programId && PROGRAMS[programId];

    if (program) {
      const titleEl = $('#programTitle');
      const breadcrumbEl = $('#currentProgram');
      const levelEl = $('#programLevel');
      const durationEl = $('#programDuration');
      const typeEl = $('#programType');
      const descEl = $('#programDescription');

      if (titleEl) titleEl.textContent = program.title;
      if (breadcrumbEl) breadcrumbEl.textContent = program.breadcrumb;
      if (levelEl) levelEl.textContent = program.level;
      if (durationEl) durationEl.textContent = program.duration;
      if (typeEl) typeEl.textContent = program.type;
      if (descEl) descEl.textContent = program.description;
      document.title = `${program.breadcrumb} — Medifit`;

      // Update day tab names to match program
      dayTabs.forEach((tab, i) => {
        const name = program.days[i];
        const nameEl = tab.querySelector('.day-tab__name');
        if (name === null || name === undefined) {
          tab.style.display = 'none';
          const dayPanel = workoutDays[i];
          if (dayPanel) dayPanel.style.display = 'none';
        } else if (nameEl) {
          nameEl.textContent = name;
        }
      });
    }

    // Day tab switching
    dayTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const day = tab.dataset.day;
        dayTabs.forEach((t) => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        workoutDays.forEach((d) => d.classList.remove('active'));

        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
        const target = document.getElementById(`day${day}`);
        if (!target) return;
        target.classList.add('active');

        // Re-trigger reveals inside the new day
        $$('[data-reveal], [data-reveal-line], [data-reveal-clip]', target).forEach((el) => {
          el.classList.remove('is-in');
          // force reflow then re-add
          // eslint-disable-next-line no-unused-expressions
          el.offsetHeight;
          el.classList.add('is-in');
        });

        // Soft scroll to the workout content
        if (lenis) {
          lenis.scrollTo($('.workout-content'), { offset: -100, duration: 1.0 });
        }
      });
    });
  }

  // ===================================================================
  // VIDEO MODAL
  // ===================================================================
  const EXERCISES = {
    'pull-ups': {
      title: 'Pull-Ups',
      videoUrl: 'https://placehold.co/1280x720/0e0e10/ed2124?text=Pull-Ups',
      instructions: [
        'Hang from a bar with palms facing away, hands slightly wider than shoulders.',
        'Engage your back and pull your chest toward the bar.',
        'Lower under control until arms are fully extended.',
        'Reset breath. Repeat without swinging.',
      ],
      tips: 'If a full pull-up is too heavy, use a resistance band or jump up and lower slowly for the eccentric.',
    },
    'push-ups': {
      title: 'Push-Ups',
      videoUrl: 'https://placehold.co/1280x720/0e0e10/ed2124?text=Push-Ups',
      instructions: [
        'Start in a plank with hands under shoulders, body in one line.',
        'Lower chest toward the floor, elbows at 45°.',
        'Press back to plank position.',
        'Keep core braced — no hip sag, no shrugged shoulders.',
      ],
      tips: 'For an easier version, drop knees to the floor. For harder, elevate the feet or slow the eccentric.',
    },
    'dumbbell-rows': {
      title: 'Dumbbell Rows',
      videoUrl: 'https://placehold.co/1280x720/0e0e10/ed2124?text=DB+Rows',
      instructions: [
        'Place one knee and hand on a bench. Hold a dumbbell in the opposite hand.',
        'Pull the dumbbell toward your hip, driving the elbow up and back.',
        'Squeeze the shoulder blade at the top.',
        'Lower under control.',
      ],
      tips: 'Keep your back flat and chest open — no rotation through the torso.',
    },
    'shoulder-press': {
      title: 'Shoulder Press',
      videoUrl: 'https://placehold.co/1280x720/0e0e10/ed2124?text=Shoulder+Press',
      instructions: [
        'Stand tall holding dumbbells at shoulder height, palms forward.',
        'Press the weights overhead until arms are fully extended.',
        'Lower with control to the starting position.',
        'Keep ribs stacked over hips — no excessive arch.',
      ],
      tips: 'If standing pressing causes lower back stress, try a seated press with back support.',
    },
    'squats': {
      title: 'Squats',
      videoUrl: 'https://placehold.co/1280x720/0e0e10/ed2124?text=Squats',
      instructions: [
        'Stand with feet shoulder-width apart, toes slightly turned out.',
        'Brace your core, sit hips back and down.',
        'Keep your chest up and knees tracking over toes.',
        'Drive through the floor to stand.',
      ],
      tips: 'Aim for thighs parallel to the floor. Heel-elevated squats can help if ankle mobility is limited.',
    },
    'lunges': {
      title: 'Lunges',
      videoUrl: 'https://placehold.co/1280x720/0e0e10/ed2124?text=Lunges',
      instructions: [
        'Step forward into a long stride, both knees bending to 90°.',
        'Front shin vertical, back knee under hip.',
        'Drive through the front heel to return.',
        'Alternate legs or complete one side then the other.',
      ],
      tips: 'For walking lunges, keep your torso upright and minimize bounce between steps.',
    },
    'romanian-deadlifts': {
      title: 'Romanian Deadlifts',
      videoUrl: 'https://placehold.co/1280x720/0e0e10/ed2124?text=RDL',
      instructions: [
        'Stand with feet hip-width, dumbbells in front of thighs.',
        'Hinge at the hips, sending hips back as you lower.',
        'Keep the bar close to your legs, a slight bend in the knees.',
        'Stop at the first sign of rounding — drive hips forward to stand.',
      ],
      tips: 'You should feel a stretch in the hamstrings, not lower back. Limit range to a flat spine.',
    },
    'calf-raises': {
      title: 'Calf Raises',
      videoUrl: 'https://placehold.co/1280x720/0e0e10/ed2124?text=Calf+Raises',
      instructions: [
        'Stand tall, balls of the feet on a step, heels hanging off.',
        'Rise onto the balls of your feet as high as possible.',
        'Pause at the top, then lower past neutral for full range.',
        'Control both directions.',
      ],
      tips: 'Slow tempo (3s up, 3s down) builds tendon resilience.',
    },
    'planks': {
      title: 'Planks',
      videoUrl: 'https://placehold.co/1280x720/0e0e10/ed2124?text=Planks',
      instructions: [
        'Forearms on the floor, elbows under shoulders.',
        'Body in one line from heels to head, hips level.',
        'Squeeze glutes and brace your midsection.',
        'Breathe normally — hold for time.',
      ],
      tips: 'Quality over duration: 30 perfect seconds beats 60 sloppy ones.',
    },
  };

  function initVideoModal() {
    const modal = $('#videoModal');
    const close = modal && modal.querySelector('.close-modal');
    if (!modal || !close) return;

    function closeModal() {
      modal.classList.remove('show');
      document.body.style.overflow = '';
      if (lenis) lenis.start();
    }

    close.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('show')) closeModal();
    });
  }

  // Expose for inline onclick handlers in workout.html
  window.playVideo = function (key) {
    const modal = $('#videoModal');
    if (!modal) return;
    const data = EXERCISES[key] || { title: key, videoUrl: '', instructions: [], tips: '' };

    const titleEl = $('#videoTitle');
    const playerEl = $('#videoPlayer');
    const instructionsEl = $('#exerciseInstructions');
    const tipsEl = $('#exerciseTips');

    if (titleEl) titleEl.textContent = data.title;
    if (playerEl && data.videoUrl) playerEl.src = data.videoUrl;
    if (instructionsEl) {
      instructionsEl.innerHTML = '';
      (data.instructions || []).forEach((line) => {
        const li = document.createElement('li');
        li.textContent = line;
        instructionsEl.appendChild(li);
      });
    }
    if (tipsEl) {
      tipsEl.innerHTML = `<p>${data.tips || ''}</p>`;
    }

    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    if (lenis) lenis.stop();
  };

  // ===================================================================
  // TICKER — pause-on-hover handled by CSS; nothing extra needed
  // ===================================================================

  // ===================================================================
  // BOOT
  // ===================================================================
  function boot() {
    initLenis();
    initCursor();
    initNav();
    initAnchorScroll();
    initReveals();
    initHeroEntrance();
    initScrollEffects();
    initFilters();
    initProgramPreview();
    initWorkoutPage();
    initVideoModal();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
