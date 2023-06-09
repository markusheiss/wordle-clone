import model from './model.js';
import keyboardView from './views/keyboardView.js';
import boardView from './views/boardView.js';
import toggleView from './views/toggleView.js';
import words from './words.js';

const handleKeyStroke = function (key) {
  const validChars = 'qwertyuiopasdfghjklzxcvbnm';
  if (validChars.includes(key)) {
    model.addKey(key);
  }
  if (key === 'Backspace') {
    model.removeKey();
  }
  if (key === 'Enter') {
    const wordInList = model.evaluateRow();
    if (!wordInList && !model.state.rowEvaluated) {
      boardView.shakeRow(model.state.currRow - 1);
      return;
    }
  }
  if (key === ' ') {
    model.setCurrentCell(model.state.currRow * 5);
  }

  console.log(model.state.done);

  boardView.render(
    model.state.board,
    model.state.validation,
    model.state.done,
    model.state.win,
    model.state.secretWord
  );
  keyboardView.render(model.state.keyboard);
  if (model.state.done) {
    // boardView.viewSecretWord(model.state.secretWord);
    keyboardView.clear();
  }
  if (model.state.rowEvaluated && !model.state.done)
    boardView.selectCell(model.state.currRow, model.state.currCell);
};

const handleBoardClick = function (index) {
  const cellOK = model.setCurrentCell(index);
  if (!cellOK) return;
  boardView.selectCell(model.state.currRow, model.state.currCell);
};

const handleKeyboardClick = function (key) {
  if (key.classList.contains('key__back')) {
    handleKeyStroke('Backspace');
    return;
  }
  if (key.classList.contains('key__enter')) {
    handleKeyStroke('Enter');
    return;
  }
  const char = key.innerHTML;
  handleKeyStroke(char);
};

const init = function () {
  model.checkLocalStorage();
  model.chooseSecretWord(words);
  keyboardView.render(model.state.keyboard);
  keyboardView.addHandlerClick(handleKeyboardClick);
  toggleView.render();
  boardView.render(
    model.state.board,
    model.state.validation,
    model.state.done,
    model.state.win,
    model.state.secretWord
  );
  if (model.state.done) keyboardView.clear();
  boardView.addHandlerKeydown(handleKeyStroke);
  boardView.addHandlerClick(handleBoardClick);
  console.log(model.state.secretWord);
};

init();
