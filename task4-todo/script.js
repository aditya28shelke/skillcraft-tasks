let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
let filter = 'all', editingId = null;
const $ = id => document.getElementById(id);
const save = () => localStorage.setItem('tasks', JSON.stringify(tasks));

$('form').addEventListener('submit', e => {
  e.preventDefault();
  const text = $('text').value.trim(); if (!text) return;
  tasks.push({ id: Date.now(), text, date: $('date').value, time: $('time').value, done: false });
  e.target.reset(); save(); render();
});
document.querySelectorAll('.filters button').forEach(b => b.addEventListener('click', () => {
  filter = b.dataset.f;
  document.querySelectorAll('.filters button').forEach(x => x.classList.toggle('on', x === b));
  render();
}));
$('list').addEventListener('click', e => {
  const li = e.target.closest('li'); if (!li) return;
  const id = +li.dataset.id, t = tasks.find(x => x.id === id), act = e.target.dataset.a;
  if (act === 'toggle') t.done = !t.done;
  else if (act === 'del') tasks = tasks.filter(x => x.id !== id);
  else if (act === 'edit') { editingId = id; return render(); }
  else if (act === 'save') {
    const v = li.querySelector('.edit').value.trim(); if (v) t.text = v;
    t.date = li.querySelector('.ed-date').value; t.time = li.querySelector('.ed-time').value; editingId = null;
  } else if (act === 'cancel') { editingId = null; return render(); }
  else return;
  save(); render();
});
function isOverdue(t){ return !t.done && t.date && new Date(`${t.date}T${t.time || '23:59'}`) < new Date(); }
function render(){
  const shown = tasks.filter(t => filter === 'all' || (filter === 'done') === t.done);
  $('list').innerHTML = shown.map(t => t.id === editingId
    ? `<li class="item" data-id="${t.id}"><input class="edit" value="${t.text.replace(/"/g,'&quot;')}"><input class="ed-date" type="date" value="${t.date}"><input class="ed-time" type="time" value="${t.time}"><button data-a="save">Save</button><button data-a="cancel">X</button></li>`
    : `<li class="item ${t.done?'done':''} ${isOverdue(t)?'overdue':''}" data-id="${t.id}">
         <input type="checkbox" data-a="toggle" ${t.done?'checked':''}>
         <div class="body"><div class="t">${t.text.replace(/</g,'&lt;')}</div><div class="when">${t.date||'No date'} ${t.time||''}</div></div>
         <button data-a="edit">Edit</button><button class="del" data-a="del">Delete</button></li>`).join('');
  $('count').textContent = `${tasks.filter(t => !t.done).length} task(s) remaining`;
}
render();
