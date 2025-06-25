import { ref } from "vue";
import { Creature } from "./Creature";

export const world = { width: 100, height: 100, rows: 100, cols: 100 };

export const unit = 4;
export const lineWidth = unit / 30;

export const canvas = ref<HTMLCanvasElement | null>(null);
export const ctx = ref<CanvasRenderingContext2D | null>(null);

export const ocean = ref<Creature[]>([]);

const runningTimer = ref<number | undefined>(undefined);

export function pixelToUnit(pixel: number) {
  return Math.floor(pixel / unit);
}

export function createOcean(wrap: HTMLElement) {
  let width = screen.availWidth * 0.5;
  width = width - (width % (unit * 10));
  let height = screen.availHeight * 0.9;
  height = height - (height % (unit * 10));

  world.width = width;
  world.height = height;
  world.rows = pixelToUnit(height);
  world.cols = pixelToUnit(width);

  canvas.value = document.createElement("canvas");
  canvas.value.width = width;
  canvas.value.height = height;
  canvas.value.style.width = `${width}px`;
  canvas.value.style.height = `${height}px`;

  ctx.value = canvas.value.getContext("2d");

  wrap.appendChild(canvas.value);

  // 监听点击事件，并通知所有生命
  canvas.value?.addEventListener("click", (e) => {
    const x = e.offsetX;
    const y = e.offsetY;
    const row = Math.floor(y / unit);
    const col = Math.floor(x / unit);
    ocean.value.forEach((c) => {
      c.linstenClick(row, col);
    });
  });
}

export const times = ref(-1);

function storm() {
  if (!canvas.value || !ctx.value) return;

  times.value++;

  // 使用transform后，坐标计算更简单
  const width = canvas.value.width;
  const height = canvas.value.height;

  ctx.value.fillStyle = "#000";
  ctx.value.fillRect(0, 0, width, height);

  // 绘制网格
  // for (let x = 0 % unit; x < width; x += unit) {
  //   ctx.value.strokeStyle = "#aaa";
  //   ctx.value.lineWidth = lineWidth;
  //   // if (x && x % (10 * unit) === 0) {
  //   //   ctx.value.strokeStyle = "#fff";
  //   //   ctx.value.lineWidth = 1.5*lineWidth;
  //   // }
  //   ctx.value.beginPath();
  //   ctx.value.moveTo(x, 0);
  //   ctx.value.lineTo(x, height);
  //   ctx.value.stroke();
  // }

  // for (let y = 0; y < height; y += unit) {
  //   ctx.value.strokeStyle = "#aaa";
  //   ctx.value.lineWidth = lineWidth;
  //   // if (y && y % (10 * unit) === 0) {
  //   //   ctx.value.strokeStyle = "#fff";
  //   //   ctx.value.lineWidth = 1.5*lineWidth;
  //   // }
  //   ctx.value.beginPath();
  //   ctx.value.moveTo(0, y);
  //   ctx.value.lineTo(width, y);
  //   ctx.value.stroke();
  // }

  ctx.value.save();
  ctx.value.restore();
  ocean.value.forEach((c) => {
    c.run();
  });

  // 保留活着
  ocean.value = ocean.value.filter((c) => c.isAlive);
}

export function setRect(
  p: { x: number; y: number; width: number; height: number },
  strokeColor = "#ddd"
) {
  if (!canvas.value || !ctx.value) return;

  // 设置边框样式
  ctx.value.strokeStyle = strokeColor.startsWith("#")
    ? strokeColor
    : `#${strokeColor}`;
  ctx.value.lineWidth = 1; // 设置边框宽度

  // 绘制边框
  ctx.value.strokeRect(p.x, p.y, p.width, p.height);
}
export function setLight(row: number, col: number, fill = "#fff") {
  if (!canvas.value || !ctx.value) return;

  ctx.value.fillStyle = fill.startsWith("#") ? fill : `#${fill}`;
  ctx.value.fillRect(col * unit, row * unit, unit, unit);
}

export const stop = () => {
  runningTimer && clearInterval(runningTimer.value);
  runningTimer.value = undefined;
};
export const reset = () => {
  // stop();
  ocean.value = [];
};
reset();

export const fall = (num: number = 1) => {
  if (num <= 0) {
    throw new Error("num must be greater than 0");
  }
};
export const run = (beforeEach?: Function) => {
  stop();

  let frameTime = 39; // 默认50ms，即20FPS

  const running = () => {
    beforeEach?.();

    storm();

    // fall();
    runningTimer.value = undefined;
    run(beforeEach);
  };

  runningTimer.value = setTimeout(running, frameTime);
};
