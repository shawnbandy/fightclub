const canvas = document.getElementById('canvas');
const p1hp = document.getElementById('p1hp');
const p2hp = document.getElementById('p2hp');
const main = document.getElementById('main');
const c = canvas.getContext('2d');

canvas.height = 576;
canvas.width = 1076;

const gravity = 0.2;

class Character {
  constructor({ x, y, color, width, height, velocity, hp }) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.height = height;
    this.width = width;
    this.velocity = velocity;
    this.hp = hp;
  }

  render() {
    c.fillStyle = this.color;
    c.fillRect(this.x, this.y, this.width, this.height);
  }

  update() {
    this.render();

    this.y += this.velocity.y;
    this.x += this.velocity.x;

    //*checks the player to make sure they're nog going out of bounds. May refactor into a function for clarity
    if (this.x + this.width + this.velocity.x > canvas.width) {
      this.velocity.x = 0;
      this.x = canvas.width - this.width;
    } else {
      this.x += this.velocity.x;
    }

    //*left side
    if (this.x - this.velocity.x < 0) {
      console.log(true);
      this.velocity.x = 0;
      this.x = 0;
    }

    //*floor
    if (this.y + this.height + this.velocity.y > canvas.height) {
      this.velocity.y = 0;
    } else {
      this.velocity.y += gravity;
    }
  }

  attack() {
    //*air attack
    if (char1.y < 426) {
      c.fillStyle = 'pink';
      c.fillRect(
        this.x + this.width,
        this.y + this.height / 1.5,
        this.width / 4,
        this.height / 1.3
      );
    } else {
      char1.velocity.x = 0;
      c.fillStyle = 'pink';
      c.fillRect(
        this.x + this.width,
        this.y + this.height / 2.5,
        this.width,
        this.height / 3
      );
    }
  }
}

const char1 = new Character({
  x: 0,
  y: 0,
  color: 'blue',
  width: 100,
  height: 150,
  velocity: {
    x: 0,
    y: 0,
  },
  hp: 100,
});

const char2 = new Character({
  x: 600,
  y: 0,
  color: 'green',
  width: 100,
  height: 150,
  velocity: {
    x: 0,
    y: 0,
  },
  hp: 100,
});

window.addEventListener('keydown', (e) => {
  console.log(e.key);
  switch (e.key) {
    case 'a':
      keyPressed.a.pressed = true;
      break;
    case 'd':
      keyPressed.d.pressed = true;
      break;
    case 'w':
      if (char1.velocity.y == 0) {
        char1.velocity.y = -10;
      }
      break;
    case 'x':
      keyPressed.x.pressed = true;
      break;
  }
});

window.addEventListener('keyup', (e) => {
  console.log(e.key);
  switch (e.key) {
    case 'a':
      keyPressed.a.pressed = false;
      break;
    case 'd':
      keyPressed.d.pressed = false;
      break;
    case 'w':
      keyPressed.w.pressed = false;
      break;
    case 'x':
      keyPressed.x.pressed = false;
      break;
  }
});

const keyPressed = {
  a: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  w: {
    pressed: false,
  },
  x: {
    pressed: false,
  },
};

function updateGameStatus() {
  window.requestAnimationFrame(updateGameStatus);
  c.clearRect(0, 0, canvas.width, canvas.height);
  char1.update();
  char2.update();

  console.log(char1.y);
  if (keyPressed.a.pressed) {
    char1.velocity.x = -1;
  } else if (keyPressed.d.pressed) {
    char1.velocity.x = 2;
  } else {
    char1.velocity.x = 0;
  }

  if (keyPressed.x.pressed) {
    char1.attack();
  }
  p1hp.textContent = `P1 ${char1.hp}`;
  p2hp.textContent = `P2 ${char2.hp}`;
}

updateGameStatus();
