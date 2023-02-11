const canvas = document.getElementById('canvas');
const p1hp = document.getElementById('p1hp');
const p2hp = document.getElementById('p2hp');
const main = document.getElementById('main');
const c = canvas.getContext('2d');

/*
    TODO: add character classes
    TODO: move character to different .js file and import it instead
    TODO: add blocking 
    TODO: game over screen
    TODO: character collision, to prevent them from going inside of each other
*/

canvas.height = 576;
canvas.width = 1076;

const gravity = 0.2;

//*x and y are coordinates where the character is on the canvas
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

  //*redraws the character
  render() {
    c.fillStyle = this.color;
    c.fillRect(this.x, this.y, this.width, this.height);
  }

  //*this will rerender the player with any changes in velocity
  update() {
    this.render();

    this.y += this.velocity.y;
    this.x += this.velocity.x;

    //*checks the player to make sure they're not going out of bounds. May refactor into a function for clarity
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

  //*creates a rectangle attached to the character. attacking will pause player movement (intentional)
  //TODO figure out if the attack rectangle collides/overlaps with the enemy character
  attack() {
    //*air attack, which is a downwards strike, if character is NOT on the floor. otherwise regular strike
    //*will need to change this since I reference char2 in a class. maybe the attack box is made outside character class?
    if (char1.y < 426 && char2.x > this.x + this.width) {
      c.fillStyle = 'pink';
      c.fillRect(
        this.x + this.width,
        this.y + this.height / 1.5,
        this.width / 4,
        this.height / 1.3
      );
    } else if (char1.y > 426 && char2.x > this.x + this.width) {
      char1.velocity.x = 0;
      c.fillStyle = 'pink';
      c.fillRect(
        this.x + this.width,
        this.y + this.height / 2.5,
        this.width,
        this.height / 3
      );
    } else if (char1.y < 426 && char2.x < this.x + this.width) {
      c.fillStyle = 'pink';
      c.fillRect(
        this.x,
        this.y + this.height / 1.5,
        this.width / -4,
        this.height / 1.3
      );
    } else if (char1.y > 426 && char2.x > this.x + this.width) {
      char1.velocity.x = 0;
      c.fillStyle = 'pink';
      c.fillRect(
        this.x,
        this.y + this.height / 2.5,
        this.width,
        this.height / 3
      );
      c.fillRect();
    }
  }
}

const char1 = new Character({
  x: 160,
  y: 426,
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
  x: 807,
  y: 426,
  color: 'green',
  width: 100,
  height: 150,
  velocity: {
    x: 0,
    y: 0,
  },
  hp: 100,
});

//*listens for specific movement keys, which will affect movement
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

//*listens for when the movement key is released, which switches the movement off
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

//*obj with keys to switch to true/false
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

function detectCollision(char1, char2) {
  let collision = false;

  if (
    char1.x < char2.x + char2.width &&
    char1.x + char1.width > char2.x &&
    char1.y < char2.y + char2.height &&
    char1.height + char1.y > char2.y
  ) {
    collision = true;
  }

  if (collision) {
    char1.velocity.x = 0;
  }
  return collision;
}

/*
 *recursive function that updates the game state
 *starts by clearing the canvas, then redraws the characters
 *checks to see if a left/right movement key was pressed, and changes velocity depending on that
 *checks to see if an attack was pressed
 *updates the player HP
 */

function updateGameStatus() {
  window.requestAnimationFrame(updateGameStatus);
  c.clearRect(0, 0, canvas.width, canvas.height);
  let isCollision = detectCollision(char1, char2);
  char1.update();
  char2.update();

  if (!isCollision) {
    if (keyPressed.a.pressed) {
      char1.velocity.x = -1;
    } else if (keyPressed.d.pressed) {
      char1.velocity.x = 2;
    } else {
      char1.velocity.x = 0;
    }
  }

  //TODO, run collision detection to check for damage
  if (keyPressed.x.pressed) {
    char1.attack();
  }
  p1hp.textContent = `P1 ${char1.hp}`;
  p2hp.textContent = `P2 ${char2.hp}`;
}

updateGameStatus();
