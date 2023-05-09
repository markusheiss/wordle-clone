class BoardView {
  _parentEl = document.querySelector('#board-container');
  displaySecret = false;

  render(boardState, boardValidation) {
    let html = '';

    for (let row = 0; row < 6; row++) {
      for (let cell = 0; cell < 5; cell++) {
        html += `<div class="cell ${boardValidation[row][cell]}">${boardState[row][cell]}</div>`;
      }
    }

    this._parentEl.innerHTML = '';
    this._parentEl.insertAdjacentHTML('beforeend', html);
  }

  invalidRowOrCell(row, cell) {
    return row > 5 || cell > 4;
  }

  getCellElement(row, cell) {
    return this._parentEl.children[row * 5 + cell];
  }

  selectCell(row, cell) {
    if (this.invalidRowOrCell(row, cell)) return;
    this.deselectAllCells();
    this.getCellElement(row, cell).classList.add('active');
  }

  deselectAllCells() {
    const cells = this._parentEl.children;
    for (const cell of cells) cell.classList.remove('active');
  }

  getRowCells(row) {
    if (this.invalidRowOrCell(row, 0)) return;
    const cells = this._parentEl.children;
    const elements = Array.prototype.slice
      .call(cells)
      .slice(5 * row, 5 * row + 5);
    return elements;
  }

  clearCell(row, cell) {
    if (this.invalidRowOrCell(row, cell)) return;
    this.getCellElement(row, cell).innerHTML = '';
  }

  clearCellPrev(row, cell) {
    if (this.invalidRowOrCell(row, cell)) return;
    this.getCellElement(row, cell).previousSibling.innerHTML = '';
  }

  addHandlerKeydown(handler) {
    document.body.addEventListener('keydown', function (e) {
      handler(e.key);
    });
  }

  addHandlerClick(handler) {
    document.body.addEventListener('click', function (e) {
      const el = e.target;
      if (!el.classList.contains('cell')) return;

      const cells = document.querySelectorAll('.cell');

      for (let i = 0; i < cells.length; i++) {
        if (cells[i] === el) {
          handler(i);
        }
      }
    });
  }

  shakeRow(row) {
    const rowElements = this.getRowCells(row);

    rowElements.forEach(el => {
      el.classList.add('shake');
    });

    setTimeout(
      () => rowElements.forEach(el => el.classList.remove('shake')),
      500
    );
  }

  viewSecretWord(word) {
    if (this.displaySecret) return;
    this.displaySecret = true;
    const el = document.createElement('div');
    el.classList.add('secret');
    el.innerHTML = `<span>You didn't guessed The word 🙁</span><span>It was <span class="word">${word}</span>!</span><span>Come back tomorrow and guess a new word 😉</span>`;
    this._parentEl.parentNode.insertBefore(el, this._parentEl.nextSibling);
  }
}

export default new BoardView();
