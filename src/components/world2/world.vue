<template>
    <div class="world">
       <canvas ref="canvas" class="world-canvas"></canvas>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'

const canvas = ref<HTMLCanvasElement | null>(null)
const ctx = ref<CanvasRenderingContext2D | null>(null)
const scale = ref(1)
const offset = ref({ x: 0, y: 0 })
const isDragging = ref(false)
const lastPos = ref({ x: 0, y: 0 })

function drawGrid() {
  if (!canvas.value || !ctx.value) return
  
  const width = canvas.value.width
  const height = canvas.value.height
  const gridSize = 20 * scale.value
  
  ctx.value.fillStyle = '#000'
  ctx.value.fillRect(0, 0, width, height)
  ctx.value.strokeStyle = '#aaa'
  ctx.value.lineWidth = 1
  
  // 绘制网格
  for (let x = -offset.value.x % gridSize; x < width; x += gridSize) {
    ctx.value.beginPath()
    ctx.value.moveTo(x, 0)
    ctx.value.lineTo(x, height)
    ctx.value.stroke()
  }
  
  for (let y = -offset.value.y % gridSize; y < height; y += gridSize) {
    ctx.value.beginPath()
    ctx.value.moveTo(0, y)
    ctx.value.lineTo(width, y)
    ctx.value.stroke()
  }
  
  // 绘制白色坐标轴
  ctx.value.save()
  ctx.value.strokeStyle = '#fff'
  ctx.value.lineWidth = 2
  
  // X轴
  ctx.value.beginPath()
  ctx.value.moveTo(0, height/2 - offset.value.y)
  ctx.value.lineTo(width, height/2 - offset.value.y)
  ctx.value.stroke()
  
  // Y轴
  ctx.value.beginPath()
  ctx.value.moveTo(width/2 - offset.value.x, 0)
  ctx.value.lineTo(width/2 - offset.value.x, height)
  ctx.value.stroke()
  
  ctx.value.restore()
}

function handleWheel(e: WheelEvent) {
  e.preventDefault()
  const delta = e.deltaY > 0 ? 0.97 : 1.03
  scale.value = Math.max(0.7, Math.min(2, scale.value * delta))
  drawGrid()
}

function handleMouseDown(e: MouseEvent) {
  isDragging.value = true
  lastPos.value = { x: e.clientX, y: e.clientY }
}

function handleMouseMove(e: MouseEvent) {
  if (!isDragging.value) return
  
  const dx = e.clientX - lastPos.value.x
  const dy = e.clientY - lastPos.value.y
  
  offset.value = {
    x: offset.value.x - dx,
    y: offset.value.y - dy
  }
  
  lastPos.value = { x: e.clientX, y: e.clientY }
  drawGrid()
}

function handleMouseUp() {
  isDragging.value = false
}

onMounted(() => {
  if (!canvas.value) return
  
  ctx.value = canvas.value.getContext('2d')
  canvas.value.width = canvas.value.offsetWidth
  canvas.value.height = canvas.value.offsetHeight
  
  // 添加事件监听
  canvas.value.addEventListener('wheel', handleWheel)
  canvas.value.addEventListener('mousedown', handleMouseDown)
  canvas.value.addEventListener('mousemove', handleMouseMove)
  canvas.value.addEventListener('mouseup', handleMouseUp)
  canvas.value.addEventListener('mouseleave', handleMouseUp)
  
  drawGrid()
})
</script>

<style>
.world {
  width: 1000px;
  height: 1000px;
  position: relative;
}

.world-canvas {
  width: 100%;
  height: 100%;
}
</style>