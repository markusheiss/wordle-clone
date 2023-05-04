import { words } from './words.js';

////////////////////////////////
// VARIABLES
////////////////////////////////
const app = document.getElementById('app');
const validChars = 'abcdefghijklmnopqrstuvwxzy0123456789';
let secretWord = words[Math.floor(Math.random() * words.length)];
let guessedWord = [...secretWord];
let currCell = 0;
let currRow = 0;
let evaluatedRow = false;
let gameDone = false;

////////////////////////////////
// FUNCTIONS
////////////////////////////////

///////////////////////////////
// UI ELEMENTS
const createHeading = (size, text) => `<${size}>${text}</${size}>`;

const createBoard = () => {
  const board = document.createElement('div');
  board.id = 'board';
  const boardContainer = document.getElementById('boardContainer');

  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 5; col++) {
      if (row === 0 && col == 0)
        board.innerHTML += '<div class="cell active"></div>';
      else board.innerHTML += '<div class="cell"></div>';
    }
  }
  board.addEventListener('click', e => {
    handleBoardClick(e.target);
  });

  boardContainer.innerHTML = '';
  boardContainer.insertAdjacentElement('beforeend', board);
};

const getCurrCellEl = () => {
  const cells = getBoard().children;
  for (let i = 0; i < cells.length; i++) {
    if (i === currCell) return cells[i];
  }
};

const clearCurrentCell = () => {
  getCurrCellEl().innerHTML = '';
};

const deselectCurrCell = () => {
  if (currCell >= 30) return;
  getCurrCellEl().classList.remove('active');
};

const selectCurrCell = () => {
  if (currCell >= 30) return;
  getCurrCellEl().classList.add('active');
};

const getRowCellsEl = () => {
  const cells = getBoard().children;
  const rowCells = [];

  for (let i = 0; i < cells.length; i++) {
    if (i >= 5 * currRow && i <= 4 + currRow * 5) {
      rowCells.push(cells[i]);
    }
  }
  return rowCells;
};

const selectPrevCell = () => {
  if (currCell <= 0) return;
  const activeCell = getCurrCellEl();
  deselectCurrCell();
  activeCell.previousSibling.classList.add('active');
  activeCell.previousSibling.innerHTML = '';
  currCell--;
};

const selectNextCell = () => {
  if (currCell > 29) return;
  deselectCurrCell();
  currCell++;
  console.log(currCell);

  if (currCell <= 29) selectCurrCell();
};

const selectRowFirstCell = () => {
  deselectCurrCell();
  currCell = currRow * 5;
  selectCurrCell();
};

const getBoard = () => document.getElementById('board');

const createHTMLStructure = () => {
  const html = '<div id="difficulty"></div><div id="boardContainer"></board>';
  app.insertAdjacentHTML('beforeend', html);
};

const createApp = () => {
  createHTMLStructure();
  createBoard();
  createKeyStrokeHandler();
};

///////////////////////////////
// EVENT HANDLERS

const handleBoardClick = cell => {
  if (gameDone) return;
  const element = cell.closest('.cell');
  if (!element) return;

  const cells = getBoard().children;
  const cellIndex = Array.prototype.slice.call(cells).indexOf(element);
  const clickedRow = Math.floor(cellIndex / 5);

  if (clickedRow < currRow || clickedRow > currRow) return;

  deselectCurrCell();
  currCell = cellIndex;
  selectCurrCell();
};

const handleLastRowCell = () => {
  const lastRowCell = getBoard().children[currCell].previousSibling;

  lastRowCell.classList.add('active');
  lastRowCell.innerHTML = '';
  currCell--;
};

const handleKeyStroke = key => {
  if (gameDone || currCell >= 30) return;
  if (rowDone()) {
    if (key === 'Enter') {
      evaluateRow();
      evaluateGameDone();
      return;
    }
    // if (key === 'Backspace') {
    //   // handleLastRowCeldfgdfsg();
    //   if (getCurrCellEl().innerHTML === '') {
    //     selectPrevCell();
    //     return;
    //   } else getCurrCellEl().innerHTML = '';
    //   return;
    // }
    return;
  }

  if (key === 'Backspace') {
    if (firstCellInRow()) return;
    if (rowDone()) {
      handleLastRowCell();
      if (getCurrCellEl().innerHTML === '') {
        selectPrevCell();
        return;
      } else getCurrCellEl().innerHTML = '';
      return;
    }

    clearCurrentCell();
    selectPrevCell();
    return;
  }

  if (validChars.includes(key)) {
    getCurrCellEl().innerHTML = key;
    selectNextCell();
    if (rowDone()) deselectCurrCell();
  }
};

const createKeyStrokeHandler = () => {
  document.body.addEventListener('keydown', e => {
    if (gameDone) return;

    let key = e.key;
    handleKeyStroke(key);
  });
};

///////////////////////////////
// UTILITY FUNCTIONS

const rowDone = () => {
  // return currCell === currRow * 5 + 5;
  return getRowCellsEl().every(cell => cell.innerHTML !== '');
};

const firstCellInRow = () => currCell % 5 === 0;

const evaluateRow = () => {
  const rowCellsEl = getRowCellsEl();

  if (rowCellsEl.some(cellEl => cellEl.innerHTML === '')) return;

  for (let i = 0; i < rowCellsEl.length; i++) {
    const currCell = rowCellsEl[i];
    const char = currCell.innerHTML;
    if (char === secretWord[i]) {
      currCell.classList.add('correct');
      guessedWord.splice(guessedWord.indexOf(char), 1);
      console.log(guessedWord);
    } else {
      currCell.classList.add('false');
    }
  }

  for (let i = 0; i < rowCellsEl.length; i++) {
    const currCell = rowCellsEl[i];
    const char = currCell.innerHTML;
    if (char !== secretWord[i] && guessedWord.includes(char)) {
      guessedWord.splice(guessedWord.indexOf(char), 1);
      currCell.classList.add('position');
    }
  }

  gameDone = rowCellsEl.map(el => el.innerHTML).join('') === secretWord;
  if (!gameDone) selectCurrCell();
  currRow++;
  selectRowFirstCell();
};

const evaluateGameDone = () => {
  if (gameDone) console.log('you won!');
  if (currCell >= 30) {
    gameDone = true;
    console.log('you lost!');
  }
};

// APP
////////////////////////////////
createApp();
