import { ref } from "vue";
import type { Creature, Size } from "./Creature";

export const world = { width: 100, height: 100 };

export const unit = 15;

export const canvas = ref<HTMLCanvasElement | null>(null);
export const ctx = ref<CanvasRenderingContext2D | null>(null);

export const ocean = ref<Creature[]>([]);

export function pixelToUnit(pixel: number) {
  return Math.floor(pixel / unit);
}

export function createOcean(_world: Size, wrap: HTMLElement) {
  world.width = _world.width || 100;
  world.height = _world.height || 100;
  canvas.value = document.createElement("canvas");
  canvas.value.width = _world.width;
  canvas.value.height = _world.height;
  canvas.value.style.width = `${_world.width}px`;
  canvas.value.style.height = `${_world.height}px`;

  ctx.value = canvas.value.getContext("2d");

  wrap.appendChild(canvas.value);
}

export function storm() {
  if (!canvas.value || !ctx.value) return;

  // 使用transform后，坐标计算更简单
  const width = canvas.value.width;
  const height = canvas.value.height;

  ctx.value.fillStyle = "#000";
  ctx.value.fillRect(0, 0, width, height);

  // 绘制网格
  for (let x = 0 % unit; x < width; x += unit) {
    if (x && x % (10 * unit) === 0) {
      ctx.value.strokeStyle = "#fff";
      ctx.value.lineWidth = 1.5;
    } else {
      ctx.value.strokeStyle = "#aaa";
      ctx.value.lineWidth = 1;
    }
    ctx.value.beginPath();
    ctx.value.moveTo(x, 0);
    ctx.value.lineTo(x, height);
    ctx.value.stroke();
  }

  for (let y = 0; y < height; y += unit) {
    if (y && y % (10 * unit) === 0) {
      ctx.value.strokeStyle = "#fff";
      ctx.value.lineWidth = 1.5;
    } else {
      ctx.value.strokeStyle = "#aaa";
      ctx.value.lineWidth = 1;
    }
    ctx.value.beginPath();
    ctx.value.moveTo(0, y);
    ctx.value.lineTo(width, y);
    ctx.value.stroke();
  }

  ctx.value.save();
  ctx.value.restore();
  ocean.value.forEach((c) => {
    c.run();
  });

  // 保留活着
  ocean.value = ocean.value.filter((c) => c.isAlive);
}

export function setAlive(row: number, col: number) {
  if (!canvas.value || !ctx.value) return;

  ctx.value.fillStyle = "#fff";
  ctx.value.fillRect(col * unit, row * unit, unit, unit);
}
