const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

menuToggle?.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.textContent = isOpen ? 'Close' : 'Menu';
});

document.querySelectorAll('.nav a').forEach((link) => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuToggle?.setAttribute('aria-expanded', 'false');
  if (menuToggle) menuToggle.textContent = 'Menu';
}));

document.querySelectorAll('.card-image button').forEach((button) => button.addEventListener('click', () => {
  const isSaved = button.classList.toggle('saved');
  button.textContent = isSaved ? '♥' : '♡';
  button.setAttribute('aria-label', isSaved ? 'Remove saved property' : 'Save property');
}));

document.querySelector('#property-search')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const place = data.get('location')?.trim();
  const type = data.get('type');
  document.querySelector('.search-message').textContent = `We’ll curate ${type === 'Any property' ? 'a selection of homes' : type.toLowerCase() + ' options'}${place ? ` around ${place}` : ''}. Let’s talk.`;
});
