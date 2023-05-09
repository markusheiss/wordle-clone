class KeyboardView {
  _parentEl = document.querySelector('#keyboard-container');

  render(keys) {
    let keyboard = document.createElement('div');
    keyboard.classList.add('keyboard');
    const validChars = 'qwertyuiopasdfghjklzxcvbnm';

    for (let i = 0; i < 3; i++) {
      const row = document.createElement('div');
      row.classList.add('keyboard-row');
      for (let j = 0; j < validChars.length; j++) {
        if (i === 1 && j < 10) continue;
        if (i === 2 && j < 19) continue;
        if (validChars[j] === 'z') {
          row.innerHTML += `<div class="key key__enter">enter</div>`;
        }
        const valid = keys[validChars[j]] || '';

        row.innerHTML += `<div class="key ${valid}">${validChars[j]}</div>`;
        if (validChars[j] === 'm') {
          row.innerHTML += `<div class="key key__back"><svg class="key__back key__back-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9.75L14.25 12m0 0l2.25 2.25M14.25 12l2.25-2.25M14.25 12L12 14.25m-2.58 4.92l-6.375-6.375a1.125 1.125 0 010-1.59L9.42 4.83c.211-.211.498-.33.796-.33H19.5a2.25 2.25 0 012.25 2.25v10.5a2.25 2.25 0 01-2.25 2.25h-9.284c-.298 0-.585-.119-.796-.33z" />
            </svg></div>
            `;
        }
        if (i === 0 && validChars[j] === 'p') break;
        if (i === 1 && validChars[j] === 'l') break;
      }
      keyboard.insertAdjacentElement('beforeend', row);
    }

    this._parentEl.innerHTML = '';
    this._parentEl.insertAdjacentElement('beforeend', keyboard);
  }

  addHandlerClick(handler) {
    this._parentEl.addEventListener('click', function (e) {
      const el = e.target;
      handler(el);
    });
  }

  clear() {
    this._parentEl.innerHTML = '';
  }
}

export default new KeyboardView();
