import { pi } from './pi.js';
import { words } from './words.js';

////////////////////////////////
// VARIABLES
////////////////////////////////
const app = document.getElementById('app');
const difficulties = new Map([
  ['super-easy', 10],
  ['easy', 50],
  ['medium', 100],
  ['hard', 1000],
  ['extreme', 10000],
]);
const validChars = 'abcdefghijklmnopqrstuvwxzy0123456789';
let secretNumber;
let currCell = 0;
let currRow = 0;
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

const createDifficultySelector = () => {
  const element = document.createElement('select');
  const heading = createHeading('h2', 'Difficulty');

  element.innerHTML = [...difficulties].map(
    diff =>
      `<option value="${diff[1]}">${diff[0]} (first ${diff[1]} digits)</option>`
  );

  element.addEventListener('change', e => {
    difficultyHandler(Number(e.target.value));
  });

  // add element to page
  const container = document.getElementById('difficulty');
  container.insertAdjacentHTML('beforeend', heading);
  container.insertAdjacentElement('beforeend', element);
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

const getBoard = () => document.getElementById('board');

const createHTMLStructure = () => {
  const html = '<div id="difficulty"></div><div id="boardContainer"></board>';
  app.insertAdjacentHTML('beforeend', html);
};

const createApp = () => {
  createHTMLStructure();
  createDifficultySelector();
  difficultyHandler(difficulties.get('super-easy'));
  createKeyStrokeHandler();
};

///////////////////////////////
// EVENT HANDLERS

const handleBoardClick = cell => {
  if (gameDone) return;
  const element = cell.closest('.cell');
  if (!element) return;

  const cells = getBoard().children;
  let i = 0;

  for (i; i < cells.length; i++) {
    if (cells[i] === element) break;
  }
  const row = Math.floor(i / 5);

  if (row < currRow || row > currRow) return;

  const cellIndex = Array.prototype.slice.call(cells).indexOf(cell);
  deselectCurrCell();
  currCell = cellIndex + 5 * currRow;
  selectCurrCell();
};

const difficultyHandler = length => {
  secretNumber = createNumber(length);
  createBoard();
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
    if (key === 'Backspace') {
      handleLastRowCell();
      return;
    }
    return;
  }

  if (key === 'Backspace') {
    if (firstCellInRow()) return;
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

const createNumber = length => {
  // remove 3. from pi and shorten it to required difficulty
  let number = pi.slice(2, length + 2);
  // calculate starting index of random number
  const startIndex = Math.floor(Math.random() * (number.length - 5));
  // slice number from index to index+5
  return number.slice(startIndex, startIndex + 5);
};

const rowDone = () => {
  return currCell === currRow * 5 + 5;
};

const firstCellInRow = () => currCell % 5 === 0;

const evaluateRow = () => {
  const rowCellsEl = getRowCellsEl();
  if (rowCellsEl.some(cellEl => cellEl.innerHTML === '')) return;
  for (let i = 0; i < rowCellsEl.length; i++) {
    const currCell = rowCellsEl[i];
    if (currCell.innerHTML === secretNumber[i]) {
      currCell.classList.add('correct');
    } else {
      currCell.classList.add('false');
    }
  }
  gameDone = rowCellsEl.map(el => el.innerHTML).join('') === secretNumber;
  if (!gameDone) selectCurrCell();
  currRow++;
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
