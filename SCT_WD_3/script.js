// type: "single" | "multi" | "fill"
const questions = [
  { type:'single', q:'Which tag holds the main visible content of an HTML page?', options:['<head>','<body>','<meta>','<title>'], answer:[1] },
  { type:'single', q:'Which CSS property changes the text colour?', options:['font-style','background','color','text-align'], answer:[2] },
  { type:'multi',  q:'Select ALL valid JavaScript data types.', options:['string','number','character','boolean'], answer:[0,1,3] },
  { type:'multi',  q:'Select ALL layout systems in CSS.', options:['Flexbox','Grid','Servlet','Float'], answer:[0,1,3] },
  { type:'fill',   q:'The method used to select an element by its id is document.____("id").', answer:['getelementbyid'] },
  { type:'fill',   q:'The CSS rule used to make a layout responsive is @____ queries.', answer:['media'] }
];
let index = 0, score = 0, answered = false;
const $ = id => document.getElementById(id);
const box = $('answers'), nextBtn = $('next');

function load(){
  answered = false; nextBtn.disabled = true; $('feedback').textContent = '';
  const q = questions[index];
  $('progress').textContent = `Question ${index+1} of ${questions.length}`;
  $('score').textContent = `Score: ${score}`;
  $('question').textContent = q.q;
  box.innerHTML = '';
  if (q.type === 'fill'){
    box.innerHTML = '<input type="text" id="fillbox" placeholder="Type your answer"><button id="check">Check</button>';
    $('check').onclick = check;
  } else {
    q.options.forEach((text, i) => {
      const label = document.createElement('label'); label.className = 'opt'; label.dataset.i = i;
      const input = document.createElement('input');
      input.type = q.type === 'single' ? 'radio' : 'checkbox'; input.name = 'opt'; input.value = i;
      label.append(input, text); box.append(label);
    });
    const b = document.createElement('button'); b.textContent = 'Check'; b.onclick = check; box.append(b);
  }
}
function check(){
  if (answered) return;
  const q = questions[index]; let correct = false;
  if (q.type === 'fill'){
    const v = $('fillbox').value.trim().toLowerCase();
    if (!v) return $('feedback').textContent = 'Please type an answer first.';
    correct = q.answer.includes(v);
  } else {
    const picked = [...box.querySelectorAll('input:checked')].map(i => +i.value).sort();
    if (!picked.length) return $('feedback').textContent = 'Please select an option first.';
    correct = JSON.stringify(picked) === JSON.stringify([...q.answer].sort());
    box.querySelectorAll('.opt').forEach(l => {
      const i = +l.dataset.i;
      if (q.answer.includes(i)) l.classList.add('correct'); else if (picked.includes(i)) l.classList.add('wrong');
    });
  }
  answered = true; if (correct) score++;
  $('score').textContent = `Score: ${score}`;
  $('feedback').textContent = correct ? 'Correct!' : 'Not quite.';
  box.querySelectorAll('input,button').forEach(el => el.disabled = true);
  nextBtn.disabled = false;
  nextBtn.textContent = index === questions.length - 1 ? 'See result' : 'Next';
}
nextBtn.addEventListener('click', () => { index++; index < questions.length ? load() : finish(); });
function finish(){
  const pct = Math.round(score / questions.length * 100);
  document.querySelector('.quiz').innerHTML =
    `<div class="result"><h2>Quiz complete</h2><div class="big">${score} / ${questions.length}</div><p>${pct}% correct</p><button onclick="location.reload()">Play again</button></div>`;
}
load();
