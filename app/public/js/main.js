const app = {
  url: 'https://obuilder.herokuapp.com',
  local: 'http://localhost:3456',
  init() {
    app.hackEffect2('H1', 30, 3);
    app.hackEffect2('.header-link', 30, 1);

    app.click('.top', app.toggleForm);
    app.text = app.select('h2');
    app.main = app.select('main');
    app.form = app.select('form');
    app.cube = app.select('.cube');
    app.fall = app.select('.fall');
    app.delay = app.select('.form-delay');
  },

  select(elem) {
    return document.querySelector(elem);
  },

  check(elem, callback) {
    return document.querySelector(elem).addEventListener('change', callback);
  },
  submit(elem, callback) {
    return document.querySelector(elem).addEventListener('submit', callback);
  },
  click(elem, callback) {
    return document.querySelector(elem).addEventListener('click', callback);
  },

  create(elem, parent) {
    return app.select(parent).appendChild(document.createElement(elem));
  },

  toggleForm() {
    app.main.classList.toggle('admin');
    app.form.classList.toggle('hide');
    app.cube.classList.toggle('hide');
    app.form.addEventListener('submit', app.handleSubmit);
  },

  handleSubmit(e) {
    // on evite le rechargement de la page
    e.preventDefault();

    const data = new FormData(e.target);
    if (!data.get('password')
          || !data.get('name')
          || !data.get('email')) {
      app.main.style.background = '#F0F';
      app.text.innerText = 't\'as oublié un truc on dirait';
      setTimeout(() => {
        app.form.classList.toggle('shake');
      }, 3);
    } else {
      app.login(data);
    }
  },

  hackEffect2(selector, speed, iteration) {
    const letters = 'ABCDEFGHIJKLMNOOPQRSTIVWXYZ';
    const hack = app.select(selector);
    hack.dataset.value = hack.innerText;

    hack.onmouseover = () => {
      let iterations = 0;
      const interval = setInterval(() => {
        hack.innerText = hack.innerText
          .split('')
          .map((letter, index) => {
            if (index < iterations) {
              return hack.dataset.value[index];
            }
            return letters[Math.floor(Math.random() * 26)];
          })
          .join('');
        if (iterations >= hack.dataset.value.length) {
          clearInterval(interval);
        }
        iterations += 1 / iteration;
      }, speed);
    };
  },

  //* =======================fetch=======================*//

  async login(data) {
    try {
      const response = await fetch(`${app.local}/login`, {
        method: 'POST',
        body: data,
      });
      if (response.status === 200) {
        app.main.style.background = '#0F0';
        app.text.innerText = 'Bienvenue';
        setTimeout(() => {
          app.form.classList.toggle('hide');
        }, 1000);
      }
    } catch (err) {
      console.log(err);
    }
  },
};
document.addEventListener('DOMContentLoaded', app.init);
