const nav = document.getElementById('nav');
const links = document.getElementById('links');
document.getElementById('toggle').addEventListener('click', () => links.classList.toggle('open'));
links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));
function onScroll(){ nav.classList.toggle('scrolled', window.scrollY > 60); }
window.addEventListener('scroll', onScroll);
onScroll();
