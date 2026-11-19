const display = document.getElementById('display');
const startBtn = document.getElementById('start');
const lapBtn = document.getElementById('lap');
const resetBtn = document.getElementById('reset');
const lapList = document.getElementById('laps');

let elapsed = 0, startTime = 0, timer = null, lastLap = 0, lapCount = 0;

function format(ms){
  const cs = Math.floor(ms / 10) % 100;
  const s = Math.floor(ms / 1000) % 60;
  const m = Math.floor(ms / 60000) % 60;
  const h = Math.floor(ms / 3600000);
  const p = n => String(n).padStart(2, '0');
  return `${p(h)}:${p(m)}:${p(s)}.${p(cs)}`;
}
function tick(){ elapsed = Date.now() - startTime; display.textContent = format(elapsed); }

function startPause(){
  if (timer){                       // pause
    clearInterval(timer); timer = null;
    startBtn.textContent = 'Resume'; startBtn.classList.remove('running'); lapBtn.disabled = true;
  } else {                          // start / resume
    startTime = Date.now() - elapsed;
    timer = setInterval(tick, 10);
    startBtn.textContent = 'Pause'; startBtn.classList.add('running'); lapBtn.disabled = false;
  }
}
function addLap(){
  lapCount++;
  const split = elapsed - lastLap; lastLap = elapsed;
  const li = document.createElement('li');
  li.innerHTML = `<span>Lap ${lapCount}</span><span>${format(split)}</span><span>${format(elapsed)}</span>`;
  lapList.prepend(li);
}
function reset(){
  clearInterval(timer); timer = null; elapsed = 0; lastLap = 0; lapCount = 0;
  display.textContent = format(0); lapList.innerHTML = '';
  startBtn.textContent = 'Start'; startBtn.classList.remove('running'); lapBtn.disabled = true;
}
startBtn.addEventListener('click', startPause);
lapBtn.addEventListener('click', addLap);
resetBtn.addEventListener('click', reset);
