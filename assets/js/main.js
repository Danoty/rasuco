
const mobileDrawer = document.getElementById('mobileDrawer');
const menuToggle = document.getElementById('menuToggle');
const closeDrawer = document.getElementById('closeDrawer');
const searchToggle = document.getElementById('searchToggle');
const searchModal = document.getElementById('searchModal');
const closeSearch = document.getElementById('closeSearch');
const commandInput = document.getElementById('commandInput');
const commandResults = document.getElementById('commandResults');
const desktopSearchInput = document.getElementById('desktopSearchInput');
const quickSearchInput = document.getElementById('quickSearchInput');
const quickResults = document.getElementById('quickResults');

const siteIndex = [
  { title: 'About the Church', desc: 'Mission, vision, values, and church story.', url: 'about.html' },
  { title: 'What We Believe', desc: 'Core biblical beliefs and teachings.', url: 'beliefs.html' },
  { title: 'Ministries', desc: 'Children, youth, women, men, prayer, music, outreach.', url: 'ministries.html' },
  { title: 'Bible Study', desc: 'Sermons, Bible guides, prayer and study flow.', url: 'sermons.html' },
  { title: 'Contact & Visit', desc: 'Service times, directions, phone, WhatsApp.', url: 'contact.html' },
  { title: 'Upcoming Worship', desc: 'Sabbath School, Divine Service and fellowship.', url: 'contact.html#times' },
  { title: 'Plan Your Visit', desc: 'Find us and connect before you arrive.', url: 'contact.html#visit' },
  { title: 'Community Outreach', desc: 'Serve families, students, and the wider community.', url: 'ministries.html#outreach' },
  { title: 'Hope Alive Home', desc: 'Homepage, featured sections and latest highlights.', url: 'index.html' },
  { title: 'Prayer Fellowship', desc: 'Join a prayer-centered spiritual rhythm.', url: 'ministries.html#prayer' },
  { title: 'Study Guides', desc: 'Start a Bible reading plan and lesson journey.', url: 'sermons.html#study-guides' }
];

function openDrawer() {
  if (mobileDrawer) mobileDrawer.classList.add('open');
}
function hideDrawer() {
  if (mobileDrawer) mobileDrawer.classList.remove('open');
}
function openSearch() {
  if (searchModal) {
    searchModal.classList.add('open');
    if (commandInput) setTimeout(() => commandInput.focus(), 50);
  }
}
function hideSearch() {
  if (searchModal) searchModal.classList.remove('open');
}
menuToggle?.addEventListener('click', openDrawer);
closeDrawer?.addEventListener('click', hideDrawer);
searchToggle?.addEventListener('click', openSearch);
closeSearch?.addEventListener('click', hideSearch);
mobileDrawer?.addEventListener('click', (e) => { if (e.target === mobileDrawer) hideDrawer(); });
searchModal?.addEventListener('click', (e) => { if (e.target === searchModal) hideSearch(); });

document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    openSearch();
  }
  if (e.key === 'Escape') {
    hideSearch();
    hideDrawer();
  }
});

function renderResults(target, query, limit = 7) {
  if (!target) return;
  const q = query.trim().toLowerCase();
  const results = q
    ? siteIndex.filter(item => (`${item.title} ${item.desc}`).toLowerCase().includes(q)).slice(0, limit)
    : siteIndex.slice(0, limit);

  target.innerHTML = results.length
    ? results.map(item => `
      <a class="command-item" href="${item.url}">
        <strong>${item.title}</strong>
        <div class="badge-note">${item.desc}</div>
      </a>
    `).join('')
    : `<div class="command-item"><strong>No results found</strong><div class="badge-note">Try words like ministry, prayer, visit, Bible, or contact.</div></div>`;
}

commandInput?.addEventListener('input', (e) => renderResults(commandResults, e.target.value));
desktopSearchInput?.addEventListener('focus', openSearch);
desktopSearchInput?.addEventListener('input', (e) => {
  openSearch();
  if (commandInput) commandInput.value = e.target.value;
  renderResults(commandResults, e.target.value);
});
quickSearchInput?.addEventListener('input', (e) => renderResults(quickResults, e.target.value, 5));
renderResults(commandResults, '', 8);
renderResults(quickResults, '', 5);

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.14 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

const slides = Array.from(document.querySelectorAll('.hero-slide'));
const dots = Array.from(document.querySelectorAll('.slide-dot'));
const prevSlide = document.getElementById('prevSlide');
const nextSlide = document.getElementById('nextSlide');
let slideIndex = 0;
let slideTimer;

function showSlide(index) {
  if (!slides.length) return;
  slideIndex = (index + slides.length) % slides.length;
  slides.forEach((slide, i) => slide.classList.toggle('active', i === slideIndex));
  dots.forEach((dot, i) => dot.classList.toggle('active', i === slideIndex));
}
function nextHeroSlide() { showSlide(slideIndex + 1); }
function prevHeroSlideFn() { showSlide(slideIndex - 1); }
function resetTimer() {
  if (!slides.length) return;
  clearInterval(slideTimer);
  slideTimer = setInterval(nextHeroSlide, 6000);
}
prevSlide?.addEventListener('click', () => { prevHeroSlideFn(); resetTimer(); });
nextSlide?.addEventListener('click', () => { nextHeroSlide(); resetTimer(); });
dots.forEach((dot, index) => dot.addEventListener('click', () => { showSlide(index); resetTimer(); }));
showSlide(0);
resetTimer();

const megaTriggers = document.querySelectorAll('.has-mega > a');
megaTriggers.forEach((trigger) => {
  trigger.addEventListener('click', (e) => {
    if (window.innerWidth <= 1100) return;
    const parent = trigger.parentElement;
    if (!parent.classList.contains('open')) {
      e.preventDefault();
      document.querySelectorAll('.has-mega.open').forEach(el => el.classList.remove('open'));
      parent.classList.add('open');
    } else {
      parent.classList.remove('open');
    }
  });
});

document.addEventListener('click', (e) => {
  document.querySelectorAll('.has-mega.open').forEach((item) => {
    if (!item.contains(e.target)) item.classList.remove('open');
  });
});
