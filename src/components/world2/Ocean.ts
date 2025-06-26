import { ref } from "vue";
import { Creature } from "./Creature";

export const world = { width: 100, height: 100, rows: 100, cols: 100 };

export const unit = 4;
export const lineWidth = unit / 30;

export const canvas = ref<HTMLCanvasElement | null>(null);
export const ctx = ref<CanvasRenderingContext2D | null>(null);

export const ocean = ref<Creature[]>([]);

let lastTime = 0;
let runningTimer: number | null = null;
type Callback = (deltaTime: number) => void;
let runCallback: Callback | undefined = undefined;

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

function checkCollision() {
  // 检测碰撞
  const arr = ocean.value;
  for (let i = 0; i < arr.length; i++) {
    if (!arr[i].isAlive) {
      continue;
    }
    const source = arr[i];
    for (let j = i + 1; j < arr.length; j++) {
      const target = arr[j];
      if (!target.isAlive) {
        continue;
      }
      if (source.checkCollision(target)) {
        source.onCollision(target);
      }
    }
  }
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
  runningTimer && cancelAnimationFrame(runningTimer);
  runningTimer = null;
  runCallback = undefined;
};
export const reset = () => {
  // stop();
  ocean.value = [];
};
reset();

function storm(timestamp: number) {
  if (!canvas.value || !ctx.value) return;

  // 计算deltaTime
  const deltaTime = timestamp - lastTime;
  // 根据实际帧间隔调整逻辑
  // if (deltaTime > 100) return; // 防止卡顿导致异常
  lastTime = timestamp;

  // 清空画布
  ctx.value.fillStyle = "#000";
  ctx.value.fillRect(0, 0, canvas.value.width, canvas.value.height);

  ocean.value.forEach((c) => {
    c.run(deltaTime); // 传入时间缩放因子
  });

  checkCollision();

  // 过滤死亡生物
  ocean.value = ocean.value.filter((c) => c.isAlive);

  runCallback?.(deltaTime);
  runningTimer = requestAnimationFrame(storm);
}
export const run = (callback?: Callback) => {
  stop();
  runCallback = callback;
  lastTime = performance.now();
  runningTimer = requestAnimationFrame(storm);
};
