<template>
  <div class="panel">
    <div v-for="(example, ei) in examples" class="example" @click="push(ei)">
      <div v-for="(row, rowIndex) in example" :key="rowIndex" class="row">
        <div
          v-for="(cell, colIndex) in row"
          :key="colIndex"
          :class="['cell', { active: !!cell }]"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { store, reset } from './data';
import { MapHeight, MapWidth } from '@/consts/config';

const examples = ref([
  // 竖线（Blinker）（闪烁）
  [
    [1, 0, 0],
    [1, 0, 0],
    [1, 0, 0],
  ],
  // 蟾蜍（Toad）
  [
    [0, 1, 1, 1],
    [1, 1, 1, 0],
  ],
  // 信标（Beacon）
  [
    [1, 1, 0, 0],
    [1, 1, 0, 0],
    [0, 0, 1, 1],
    [0, 0, 1, 1],
  ],
  // 闪烁：恒星
  [
    [1, 1, 1],
    [1, 0, 1],
    [1, 1, 1],
  ],
  // 闪烁：恒星
  [
    [0, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0],
    [1, 1, 1, 0, 0, 0, 1, 1, 1],
  ],
  // 静态：两个方块
  [
    [1, 1, 0, 0, 1, 1],
    [1, 1, 0, 0, 1, 1],
    [0, 0, 1, 1, 0, 0],
    [0, 0, 1, 1, 0, 0],
  ],
  // 消失：地基
  [
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
  ],
  // 笑脸
  [
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1],
  ],
  // 闪标（Beacon）
  [
    [1, 1, 0, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 0],
  ],
  // 静态：大房子
  [
    [0, 1, 1, 0],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [0, 1, 1, 0],
  ],
  // 静态形状：方块（Block）
  [
    [1, 1, 0],
    [1, 1, 0],
    [0, 0, 0],
  ],
  // 飞镖（Beam）
  [
    [1, 1, 0],
    [1, 0, 1],
    [0, 1, 0],
  ],
  // 静态形状：蜂巢（Beehive）
  [
    [0, 1, 1, 0],
    [1, 0, 0, 1],
    [0, 1, 1, 0],
  ],
  // 滑翔机（Glider）（向右下角飞行）
  [
    [0, 1, 0],
    [0, 0, 1],
    [1, 1, 1],
  ],
  // 飞船（Spaceship）（向右飞行）
  [
    [0, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [0, 0, 0, 0, 1],
    [1, 0, 0, 1, 0],
  ],
  // 十字符（R-pentomino）（扩张缓慢
  [
    [0, 1, 1],
    [1, 1, 0],
    [0, 1, 0],
  ],
]);

const push = (exampleIndex: number) => {
  const example = examples.value[exampleIndex];
  const exampleHeight = example.length;
  const exampleWidth = example[0].length;

  // 计算中心区域起始位置
  const centerRow = Math.floor((MapHeight - exampleHeight) / 2);
  const centerCol = Math.floor((MapWidth - exampleWidth) / 2);

  // 在中心区域随机偏移
  const maxRowOffset = Math.max(0, MapHeight - exampleHeight - centerRow);
  const maxColOffset = Math.max(0, MapWidth - exampleWidth - centerCol);

  const rowOffset =
    Math.floor(Math.random() * (maxRowOffset * 2 + 1)) - maxRowOffset;
  const colOffset =
    Math.floor(Math.random() * (maxColOffset * 2 + 1)) - maxColOffset;

  const startRow = Math.max(0, centerRow + rowOffset);
  const startCol = Math.max(0, centerCol + colOffset);

  // 将案例放置到计算出的位置
  for (let i = 0; i < exampleHeight; i++) {
    for (let j = 0; j < exampleWidth; j++) {
      if (startRow + i < MapHeight && startCol + j < MapWidth) {
        store.grid[startRow + i][startCol + j] = !!example[i][j];
      }
    }
  }
};
</script>

<style>
.panel {
  width: 160px;
  padding: 6px;
  background-color: #aaa;
  overflow: hidden;
}

.example {
  display: inline-flex;
  flex-direction: column;
  gap: 1px;
  background-color: #aaa;
  overflow: hidden;
  margin: 0 6px 6px 0;
  cursor: pointer;
}

.row {
  flex: 1;
  display: flex;
  gap: 1px;
}
.cell {
  width: 7px;
  height: 7px;
  background-color: black;
}

.cell.active {
  background-color: white;
}
</style>
