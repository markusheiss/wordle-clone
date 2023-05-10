import words from './words.js';

const model = {
  state: {
    validChars: 'qwertyuiopasdfghjklzxcvbnm',
    board: [
      ['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', ''],
    ],
    validation: [
      ['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', ''],
    ],
    keyboard: {},
    rowEvaluated: true,
    done: false,
    win: false,
    currRow: 0,
    currCell: 0,
    secretWord: 'mards',
  },

  addKey(key) {
    if (this.state.done) return;
    if (
      this.state.currRow > 5 ||
      this.state.currCell > 4 ||
      !this.state.rowEvaluated
    )
      return;
    this.state.board[this.state.currRow][this.state.currCell] = key;
    this.state.currCell++;
    if (this.state.currCell == 5) {
      this.state.currCell = 0;
      this.state.currRow++;
      this.state.rowEvaluated = false;
    }
  },

  removeKey() {
    if (this.state.done) return;
    if (this.state.currRow > 5 && !this.state.rowEvaluated) {
      this.state.currRow = 5;
      this.state.currCell = 4;
      this.state.rowEvaluated = true;
      return;
    }
    if (this.state.board[this.state.currRow][this.state.currCell] !== '') {
      this.state.board[this.state.currRow][this.state.currCell] = '';
      return;
    }
    if (!this.state.rowEvaluated) {
      this.state.rowEvaluated = true;
      this.state.currCell = 4;
      this.state.currRow--;
      this.state.board[this.state.currRow][this.state.currCell] = '';
      return;
    }
    if (this.state.currCell === 0) return;
    this.state.currCell--;
    this.state.board[this.state.currRow][this.state.currCell] = '';
  },

  saveState() {
    localStorage.setItem('data', JSON.stringify(this.state));
  },

  countChars(char) {
    let count = 0;
    for (const c of this.state.secretWord) {
      if (c === char) count++;
    }
    return count;
  },

  otherCorrectPosition(char, guess, index) {
    let word = Array.from(guess);
    word[index] = ' ';
    word = word.join('');

    for (let i = 0; i < word.length; i++) {
      if (char === word[i]) return true;
    }
    return false;
  },

  evaluateRow() {
    if (this.state.rowEvaluated) return;
    const data = [];
    const guessed = {};
    const row = this.state.board[this.state.currRow - 1];

    if (!words.includes(row.join(''))) return false;

    for (let i = 0; i < row.length; i++) {
      if (this.state.secretWord[i] === row[i]) {
        data.push('correct');
        this.state.keyboard[row[i]] = 'correct';
      } else if (
        this.state.secretWord.includes(row[i]) &&
        (guessed[row[i]] < this.countChars(row[i]) ||
          guessed[row[i]] === undefined) &&
        !this.otherCorrectPosition(row[i], row.join(''), i)
      ) {
        data.push('position');
        if (!this.state.keyboard[row[i]])
          this.state.keyboard[row[i]] = 'position';
      } else {
        data.push('false');
        if (!this.state.keyboard[row[i]]) this.state.keyboard[row[i]] = 'false';
      }
      guessed[row[i]] = guessed[row[i]] ? (guessed[row[i]] += 1) : 1;
    }

    this.state.rowEvaluated = true;
    this.state.validation[this.state.currRow - 1] = data;

    console.log(this.state.currRow);

    this.state.done =
      row.join('') === this.state.secretWord || this.state.currRow === 6;
    this.state.win = row.join('') === this.state.secretWord;

    this.saveState();
    return true;
  },

  setCurrentCell(index) {
    if (this.state.done) return;
    const row = Math.floor(index / 5);
    const cell = index % 5;

    if (!this.state.rowEvaluated && this.state.currRow - 1 === row) {
      this.state.currRow--;
      this.state.currCell = cell;
      this.state.rowEvaluated = true;
      return true;
    }
    if (row !== this.state.currRow || !this.state.rowEvaluated) return;

    this.state.currCell = cell;
    return true;
  },

  reset() {
    this.state = {
      validChars: 'qwertyuiopasdfghjklzxcvbnm',
      board: [
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
      ],
      validation: [
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
      ],
      keyboard: {},
      rowEvaluated: true,
      done: false,
      currRow: 0,
      currCell: 0,
      secretWord: 'speed',
    };
  },

  chooseSecretWord(words) {
    const date = this.state.setDate;
    const today = new Date().getDay();
    if (!date || today !== date) {
      this.reset();
      this.state.secretWord = words[Math.floor(Math.random() * words.length)];
      this.state.setDate = new Date().getDay();
      this.saveState();
    }
  },

  checkLocalStorage() {
    const data = JSON.parse(localStorage.getItem('data'));
    if (!data) return;
    this.state = data;
  },
};

export default model;
