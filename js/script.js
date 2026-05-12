// Mobile menu toggle
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const navOverlay = document.getElementById('navOverlay');

menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  menuToggle.classList.toggle('active');
  navOverlay.classList.toggle('active');
});
navOverlay.addEventListener('click', closeNav);
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', closeNav);
});
function closeNav() {
  navLinks.classList.remove('open');
  menuToggle.classList.remove('active');
  navOverlay.classList.remove('active');
}

// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

// FAQ accordion
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.parentElement;
    const isActive = item.classList.contains('active');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
    if (!isActive) item.classList.add('active');
  });
});

// FAQ show more/less toggle
const faqShowBtn = document.getElementById('faqShowBtn');
const faqHidden = document.querySelectorAll('.faq-hidden');
if (faqShowBtn) {
  faqShowBtn.addEventListener('click', () => {
    const expanded = faqShowBtn.dataset.expanded === 'true';
    faqHidden.forEach(el => {
      el.style.display = expanded ? 'none' : 'block';
    });
    faqShowBtn.textContent = expanded ? 'Show more questions ↓' : 'Show less questions ↑';
    faqShowBtn.dataset.expanded = expanded ? 'false' : 'true';
  });
}

// Back to top button
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  backToTop.classList.toggle('visible', window.scrollY > 500);
});
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// Set min date to today
const dateInput = document.getElementById('date');
if (dateInput) {
  dateInput.min = new Date().toISOString().split('T')[0];
}

// Appointment form submission
document.getElementById('appointmentForm').addEventListener('submit', e => {
  e.preventDefault();
  document.getElementById('appointmentForm').style.display = 'none';
  document.getElementById('formSuccess').classList.add('show');
  document.getElementById('formSuccess').scrollIntoView({ behavior: 'smooth', block: 'center' });
});

// Scroll reveal animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: .15, rootMargin: '0px 0px -50px 0px' });
document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => observer.observe(el));

// Animated counters
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.getAttribute('data-count'));
      if (!target) return;
      let current = 0;
      const increment = Math.ceil(target / 60);
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) { current = target; clearInterval(timer); }
        el.textContent = current;
      }, 25);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: .5 });
document.querySelectorAll('.stat-number[data-count]').forEach(el => counterObserver.observe(el));

// ===== TESTIMONIALS FADE CAROUSEL =====
const testiTrack = document.getElementById('testiTrack');
const dotsContainer = document.getElementById('testiDots');
const slides = testiTrack.querySelectorAll('.testi-slide');
const prevBtn = document.querySelector('.testi-prev');
const nextBtn = document.querySelector('.testi-next');
let currentIndex = 0;
const totalSlides = slides.length;
let autoplayTimer = null;

// Create dot indicators
slides.forEach((_, i) => {
  const dot = document.createElement('button');
  dot.className = 'testi-dot' + (i === 0 ? ' active' : '');
  dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
  dot.addEventListener('click', () => { goTo(i); restartAutoplay(); });
  dotsContainer.appendChild(dot);
});

slides[0].classList.add('active');

function goTo(index) {
  slides.forEach((s, i) => {
    s.classList.toggle('active', i === index);
  });
  currentIndex = index;
  document.querySelectorAll('.testi-dot').forEach((d, i) => {
    d.classList.toggle('active', i === currentIndex);
  });
}

function next() { goTo((currentIndex + 1) % totalSlides); }
function prev() { goTo((currentIndex - 1 + totalSlides) % totalSlides); }

// Arrow controls
prevBtn.addEventListener('click', () => { prev(); restartAutoplay(); });
nextBtn.addEventListener('click', () => { next(); restartAutoplay(); });

// Auto-play (4 second interval)
function startAutoplay() {
  stopAutoplay();
  autoplayTimer = setInterval(next, 4000);
}
function stopAutoplay() { clearInterval(autoplayTimer); }
function restartAutoplay() { startAutoplay(); }

// Pause on hover over testimonial cards
const testiCards = document.querySelectorAll('.testimonial-card');
testiCards.forEach(card => {
  card.addEventListener('mouseenter', stopAutoplay);
  card.addEventListener('mouseleave', startAutoplay);
});
// Also pause on hover over entire fade container
const testiFade = document.querySelector('.testi-fade');
testiFade.addEventListener('mouseenter', stopAutoplay);
testiFade.addEventListener('mouseleave', startAutoplay);

// Mobile swipe support
let touchStartX = 0;
testiTrack.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].screenX;
}, { passive: true });
testiTrack.addEventListener('touchend', e => {
  const diff = touchStartX - e.changedTouches[0].screenX;
  if (Math.abs(diff) > 50) {
    if (diff > 0) { next(); restartAutoplay(); }
    else { prev(); restartAutoplay(); }
  }
}, { passive: true });

// Keyboard navigation
document.addEventListener('keydown', e => {
  const rect = testiFade.getBoundingClientRect();
  const inView = rect.top < window.innerHeight && rect.bottom > 0;
  if (!inView) return;
  if (e.key === 'ArrowRight') { next(); restartAutoplay(); }
  if (e.key === 'ArrowLeft') { prev(); restartAutoplay(); }
});

startAutoplay();