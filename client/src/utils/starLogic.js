const STAR_COLOR = "#fff";
const STAR_SIZE = 3;
const STAR_MIN_SCALE = 0.2;
const OVERFLOW_THRESHOLD = 50;

let pointerX, pointerY;
let velocity = { x: 0, y: 0, tx: 0, ty: 0, z: 0.00000001 };
let touchInput = false;

function generate(width, height) {
  const STAR_COUNT = (width + height) / 18;
  let stars = [];
  for (let i = 0; i < STAR_COUNT; i++) {
    const star = {
      x: 0,
      y: 0,
      z: STAR_MIN_SCALE + Math.random() * (1 - STAR_MIN_SCALE),
    };
    placeStar(star, width, height);
    stars.push(star);
  }
  return stars;
}

function placeStar(star, width, height) {
  star.x = Math.random() * width;
  star.y = Math.random() * height;
}

function recycleStar(star, width, height) {
  let direction = "z";

  let vx = Math.abs(velocity.x),
    vy = Math.abs(velocity.y);

  if (vx > 1 || vy > 1) {
    let axis;

    if (vx > vy) {
      axis = Math.random() < vx / (vx + vy) ? "h" : "v";
    } else {
      axis = Math.random() < vy / (vx + vy) ? "v" : "h";
    }

    if (axis === "h") {
      direction = velocity.x > 0 ? "l" : "r";
    } else {
      direction = velocity.y > 0 ? "t" : "b";
    }
  }

  star.z = STAR_MIN_SCALE + Math.random() * (1 - STAR_MIN_SCALE);

  if (direction === "z") {
    star.z = 0.1;
    star.x = Math.random() * width;
    star.y = Math.random() * height;
  } else if (direction === "l") {
    star.x = -OVERFLOW_THRESHOLD;
    star.y = height * Math.random();
  } else if (direction === "r") {
    star.x = width + OVERFLOW_THRESHOLD;
    star.y = height * Math.random();
  } else if (direction === "t") {
    star.x = width * Math.random();
    star.y = -OVERFLOW_THRESHOLD;
  } else if (direction === "b") {
    star.x = width * Math.random();
    star.y = height + OVERFLOW_THRESHOLD;
  }
}

function resize(canvas) {
  const scale = window.devicePixelRatio || 1;
  const width = window.innerWidth * scale;
  const height = window.innerHeight * scale;

  canvas.width = width;
  canvas.height = height;

  return { scale, width, height };
}

function step(canvas, context, stars, scale, width, height) {
  context.clearRect(0, 0, width, height);
  update(stars, width, height, scale);
  render(context, stars, scale);
  requestAnimationFrame(() =>
    step(canvas, context, stars, scale, width, height)
  );
}

function update(stars, width, height, scale) {
  velocity.tx *= 0.96;
  velocity.ty *= 0.96;

  velocity.x += (velocity.tx - velocity.x) * 0.8;
  velocity.y += (velocity.ty - velocity.y) * 0.8;

  stars.forEach((star) => {
    star.x += velocity.x * star.z;
    star.y += velocity.y * star.z;

    star.x += (star.x - width / 2) * velocity.z * star.z;
    star.y += (star.y - height / 2) * velocity.z * star.z;
    star.z += velocity.z;

    if (
      star.x < -OVERFLOW_THRESHOLD ||
      star.x > width + OVERFLOW_THRESHOLD ||
      star.y < -OVERFLOW_THRESHOLD ||
      star.y > height + OVERFLOW_THRESHOLD
    ) {
      recycleStar(star, width, height);
    }
  });
}

function render(context, stars, scale) {
  stars.forEach((star) => {
    context.beginPath();
    context.lineCap = "round";
    context.lineWidth = STAR_SIZE * star.z * scale;
    context.globalAlpha = 0.5 + 0.5 * Math.random();
    context.strokeStyle = STAR_COLOR;

    context.beginPath();
    context.moveTo(star.x, star.y);

    var tailX = velocity.x * 2,
      tailY = velocity.y * 2;

    // stroke() wont work on an invisible line
    if (Math.abs(tailX) < 0.1) tailX = 0.5;
    if (Math.abs(tailY) < 0.1) tailY = 0.5;

    context.lineTo(star.x + tailX, star.y + tailY);

    context.stroke();
  });
}

function movePointer(x, y, scale) {
  if (typeof pointerX === "number" && typeof pointerY === "number") {
    let ox = x - pointerX,
      oy = y - pointerY;

    velocity.tx = velocity.tx + (ox / 8) * scale * (touchInput ? 1 : -1);
    velocity.ty = velocity.ty + (oy / 8) * scale * (touchInput ? 1 : -1);
  }
  pointerX = x;
  pointerY = y;
}

function onMouseMove(event, canvas, scale) {
  // console.log("onMouseMove is called", event.clientX, event.clientY);
  touchInput = false;
  movePointer(event.clientX, event.clientY, scale);
}

function onTouchMove(event, canvas, scale) {
  touchInput = true;
  movePointer(event.touches[0].clientX, event.touches[0].clientY, scale);
  event.preventDefault();
}

function onMouseLeave() {
  pointerX = null;
  pointerY = null;
}

export function initStars(canvasId) {
  const canvas = document.getElementById(canvasId);
  const context = canvas.getContext("2d");
  const infoElement = document.getElementById("content"); // Получаем infoElement

  if (!canvas) {
    console.error("Canvas element not found!");
    return;
  }
  if (!infoElement) {
    // Добавляем проверку
    console.error("Content element not found!");
    return;
  }

  let { scale, width, height } = resize(canvas);
  let stars = generate(width, height);

  infoElement.addEventListener("mousemove", (event) =>
    onMouseMove(event, canvas, scale)
  ); // Привязываем к infoElement
  infoElement.addEventListener("touchmove", (event) =>
    onTouchMove(event, canvas, scale)
  ); // Привязываем к infoElement
  infoElement.addEventListener("mouseleave", onMouseLeave);

  step(canvas, context, stars, scale, width, height);
}
