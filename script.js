const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const canvas_width = (canvas.width = window.innerWidth);
const canvas_height = (canvas.height = window.innerHeight);
const colorCanvas = document.getElementById("colorCanvas");
const colorCtx = colorCanvas.getContext("2d");
const colorCanvas_width = (colorCanvas.width = innerWidth);
const colorCanvas_height = (colorCanvas.height = innerHeight);
const boom_audio = new Audio();
boom_audio.src = "assets/explosion.ogg";
let ravens = [];
let score = 0;
let explosions = [];
let particle = [];
class Raven {
  constructor() {
    this.canvas_width = canvas_width;
    this.canvas_height = canvas_height;
    this.image = raven_sprite;
    this.spriteWidth = 272;
    this.spriteHeight = 179;
    this.size = Math.random() * 1 + 2;
    this.width = this.spriteWidth / this.size;
    this.height = this.spriteHeight / this.size;
    this.x = this.canvas_width;
    this.y = Math.random() * (this.canvas_height - this.height);
    this.speedX = Math.random() * 2 + 1;
    this.speedY = Math.random() * 5 - 2.5;
    this.frames = 0;
    this.interval = 0;
    this.max = 100;
    this.delete = false;
    this.randomColorArray = [
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255),
    ];
    this.color = `rgba(${this.randomColorArray[0]},${this.randomColorArray[1]},${this.randomColorArray[2]})`;
  }
  draw() {
    colorCtx.save()
    colorCtx.fillStyle = this.color
    colorCtx.fillRect(this.x, this.y, this.width, this.height)
    colorCtx.restore()
    ctx.drawImage(
      this.image,
      this.frames * this.spriteWidth,
      0,
      this.spriteWidth,
      this.spriteHeight,
      this.x,
      this.y,
      this.width,
      this.height,
    );
  }
  update() {
    this.x -= this.speedX;
    this.y -= this.speedY;
    if (
      this.y < -this.height / 3 ||
      this.y + this.height > this.canvas_height
    ) {
      this.speedY = -this.speedY;
    }
    if (this.interval > this.max) {
      if (this.frames < 5) this.frames++;
      else this.frames = 0;
      this.interval = 0;
    } else this.interval += deltaTime;
    if (this.x + this.width < 0) this.delete = true;
    particle.push(new Particles(this));
  }
}
class Particles {
  constructor(raven) {
    this.raven = raven;
    this.width = raven.width;
    this.height = raven.height;
    this.x = raven.x + this.width;
    this.y = raven.y + this.height;
    this.color = raven.color;
    this.radius = Math.random() * 30 + 5;
    this.delete = false;
    this.timer = 20;
    this.interval = 0;
  }
  draw() {
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  update() {
    if (this.interval > this.timer) {
      this.delete = true;
      this.interval = 0;
    } else this.interval++;
  }
}
class Boom {
  constructor(x, y) {
    this.image = cloud_sprite;
    this.spriteWidth = 92;
    this.spriteHeight = 181;
    this.width = 100;
    this.height = 100;
    this.x = x;
    this.y = y;
    this.delete = false;
    this.maxFrames = 5;
    this.frames = 0;
    this.max = 100;
    this.interval = 0;
    this.delete = false;
  }
  draw() {
    ctx.drawImage(
      this.image,
      this.frames * this.spriteWidth,
      0,
      this.spriteWidth,
      this.spriteHeight,
      this.x,
      this.y,
      this.spriteWidth,
      this.spriteHeight,
    );
  }
  update() {
    if (this.interval > deltaTime) {
      if (this.frames < this.maxFrames) {
        this.frames++;
      } else {
        this.delete = true;
      }
      this.interval = 0;
    } else this.interval += 2;
  }
}
let addEnemy = 0;
function addRavens(deltatime) {
  let interval = 1000;
  if (addEnemy > interval) {
    ravens.push(new Raven());
    ravens.forEach((raven) => {
      for (let i = 0; i < 10; i++) {

      }
    });

    addEnemy = 0;
  } else {
    addEnemy += deltatime;
  }
}
window.addEventListener("click", function (e) {
  let imageData = colorCtx.getImageData(e.x, e.y, 1, 1);
  let data = imageData.data;
  ravens.forEach((raven) => {
    if (
      raven.randomColorArray[0] == data[0]
    ) {
      raven.delete = true;
      explosions.push(
        new Boom(raven.x, raven.y, raven.width, raven.height, raven.color),
      );
      score++;
      boom_audio.play();
      boom_audio.volume = 0.5;
    }
  });
});
window.addEventListener("click", function (e) {
  mouseMove = new MouseMove(e.x, e.y)
})

class MouseMove {
  constructor(x, y) {
    this.radius = 30
    this.x = x
    this.y = y;
  }
  draw() {
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}
let mouseMove;
mouseMove = new MouseMove(20, 30)
let interval = 0;
function showScore() {
  ctx.fillStyle = "white";
  ctx.font = "50px cursive";
  ctx.fillText(`Score:${score}`, 50, 100);
}
function animate(timeStamp) {
  ctx.clearRect(0, 0, canvas_width, canvas_height);
  colorCtx.clearRect(0, 0, canvas_width, canvas_height);
  deltaTime = timeStamp - interval;
  interval = timeStamp;
  addRavens(deltaTime);
  [...ravens, ...explosions, ...particle].forEach((obj) => {
    obj.draw();
    obj.update(deltaTime);
  });
  ravens = ravens.filter((raven) => !raven.delete);
  explosions = explosions.filter((explosion) => !explosion.delete);
  particle = particle.filter((particle) => !particle.delete);
  showScore();
  requestAnimationFrame(animate);
}
mouseMove.draw()
animate(0);

