/* Session 1 knowledge checks: instant local feedback; no progress scores or submission. */
document.querySelectorAll('.note-question').forEach(function(question){
 const feedback=question.querySelector('.note-feedback');
 const answers=question.querySelectorAll('.note-answer');
 const correct=Array.from(answers).find(b=>b.dataset.correct==='true');
 answers.forEach(function(button){button.addEventListener('click',function(){
  answers.forEach(x=>x.setAttribute('aria-pressed','false'));
  button.setAttribute('aria-pressed','true');
  const right=button.dataset.correct==='true';
  feedback.dataset.result=right?'correct':'wrong';
  feedback.textContent=(right?'✓ Correct. ':'Not quite. Correct answer: '+correct.textContent+'. ')+question.querySelector('.note-print-answer').textContent.replace(/^Answer:\s*[^.]*\.\s*/, '');
 });});
});

/* Make collapsed explanations visible on paper, then restore reading state. */
let printPreviouslyClosed = [];
window.addEventListener('beforeprint', () => {
  printPreviouslyClosed = Array.from(document.querySelectorAll('.ppt-notes .note-expand:not([open])'));
  printPreviouslyClosed.forEach(item => { item.open = true; });
});
window.addEventListener('afterprint', () => {
  printPreviouslyClosed.forEach(item => { item.open = false; });
  printPreviouslyClosed = [];
});
