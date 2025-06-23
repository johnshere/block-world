<template>
  <div class="world">
    <canvas
      ref="canvas"
      :width="worldWidth"
      :height="worldHeight"
      :style="{ width: `${worldWidth}px`, height: `${worldHeight}px` }"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';

const canvas = ref<HTMLCanvasElement | null>(null);
const ctx = ref<CanvasRenderingContext2D | null>(null);
const unit = 15;
const worldWidth = unit * 80;
const worldHeight = unit * 60;

function drawGrid() {
  if (!canvas.value || !ctx.value) return;

  // 使用transform后，坐标计算更简单
  const width = canvas.value.width;
  const height = canvas.value.height;

  ctx.value.fillStyle = '#000';
  ctx.value.fillRect(0, 0, width, height);

  // 绘制网格
  for (let x = 0 % unit; x < width; x += unit) {
    if (x && x % (10 * unit) === 0) {
      ctx.value.strokeStyle = '#fff';
      ctx.value.lineWidth = 1.5;
    } else {
      ctx.value.strokeStyle = '#aaa';
      ctx.value.lineWidth = 1;
    }
    ctx.value.beginPath();
    ctx.value.moveTo(x, 0);
    ctx.value.lineTo(x, height);
    ctx.value.stroke();
  }

  for (let y = 0; y < height; y += unit) {
    if (y && y % (10 * unit) === 0) {
      ctx.value.strokeStyle = '#fff';
      ctx.value.lineWidth = 1.5;
    } else {
      ctx.value.strokeStyle = '#aaa';
      ctx.value.lineWidth = 1;
    }
    ctx.value.beginPath();
    ctx.value.moveTo(0, y);
    ctx.value.lineTo(width, y);
    ctx.value.stroke();
  }

  ctx.value.save();
  ctx.value.restore();
}

onMounted(() => {
  if (!canvas.value) return;

  ctx.value = canvas.value.getContext('2d');
  canvas.value.width = worldWidth;
  canvas.value.height = worldHeight;
  drawGrid();
});
</script>

<style>
.world {
  position: relative;
}
</style>
