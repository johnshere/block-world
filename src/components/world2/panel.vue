<template>
  <div class="panel-wrap">
    <div class="operate">
      <button @click="add">添加</button>
      <button @click="rotate">旋转</button>
      <button @click="addExample()">留存</button>
      <button @click="remove">删除</button>
      <button v-if="!type" @click="toSecond">to 2</button>
    </div>
    <div class="panel">
      <div v-if="real">
        <span>dir:x-{{ translateDir(real.direction.x, 'x') }},y-{{ translateDir(real.direction.y, 'y') }}</span>
        <span>speed:{{ real.moveInterval }}</span>
        <span>grow:{{ real.growInterval }}</span>
      </div>
      <div class="example" style="margin-right: auto;">
        <div v-for="(row, rowIndex) in active?.cells || []" :key="rowIndex" class="row">
          <div v-for="(cell, colIndex) in row" :key="colIndex" class="cell"
            :style="!!cell ? `background:${active?.color}` : ''" @click="toggle(rowIndex, colIndex)" />
        </div>
      </div>
      <br />
      <div v-for="(it, ei) in show" class="example" :class="{ active: active === it }" @click="select(it)">
        <div v-for="(row, rowIndex) in it.cells" :key="rowIndex" class="row">
          <div v-for="(cell, colIndex) in row" :key="colIndex" class="cell"
            :style="!!cell ? `background:${it.color}` : ''" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { MapHeight, MapWidth } from '@/consts/config';
import { computed } from '@vue/reactivity';
import { Creature } from './Creature';
import { ocean, pixelToUnit, world } from './Ocean';

const props = defineProps({
  type: {
    type: String,
    default: '',
  },
})
const storageKey = computed(() => `creature-examples${props.type}`)

const localExamples = localStorage.getItem(storageKey.value)
const examStore = ref<Creature[]>([]);

const translateDir = (dir: number, type: 'x' | 'y') => {
  if (type === 'x') {
    return dir === 1 ? '右' : dir === -1 ? '左' : '';
  } else {
    return dir === 1 ? '下' : dir === -1 ? '上' : '';
  }
}
const toSecond = () => {
  localStorage.setItem(storageKey.value + '2', JSON.stringify(examStore.value));
}
const sortBySize = (arr: Creature[]) => {
  return arr.sort((a, b) => {
    const acells = a.cells || []
    const bcells = b.cells || []
    const diff = acells.length - bcells.length
    if (diff === 0) {
      const alivea = acells.slice().flat().filter(Boolean).length;
      const aliveb = bcells.slice().flat().filter(Boolean).length;
      return alivea - aliveb
    } else {
      return diff
    }
  })
}
if (localExamples) {
  const exams = localExamples ? JSON.parse(localExamples) : []
  examStore.value = sortBySize(exams).map((exam: any) => {
    exam.color = ''
    const c = new Creature(exam.cells);
    return c
  })
  localStorage.setItem(storageKey.value, JSON.stringify(examStore.value));
}

const active = ref<Creature>(new Creature(Array(6).fill(0).map(() => Array(6).fill(false))));
const real = ref<Creature>();

const show = computed(() => {
  return sortBySize(examStore.value.slice())
})
watch(() => examStore.value, () => {
  // 去重
  localStorage.setItem(storageKey.value, JSON.stringify(examStore.value));
}, { deep: true })

const add = () => {
  const exa = new Creature(active.value.cells)
  exa.position.x = Math.floor(Math.random() * (world.cols - exa.cells.length));
  ocean.value.push(exa);
}
const toggle = (row: number, col: number) => {
  if (!active.value) return;
  const cur = active.value as any;
  const cells = cur.cells;
  if (!cells[row]) return
  cells[row][col] = !cells[row][col];
}
const select = (exa: Creature) => {
  active.value = exa;
}
const rotate = () => {
  if (!active.value) return;
  const cur = active.value as any;
  const cells = cur.cells;
  const newCells = cells[0].map((_, index) => cells.map(row => row[index]).reverse());
  cur.cells = newCells;
}
const remove = () => {
  if (!active.value) return;
  const index = examStore.value.indexOf(active.value);
  examStore.value.splice(index, 1)
}
const push = (exami: number) => {
  const exam = examStore.value[exami];
  const examHeight = exam.length;
  const examWidth = exam[0].length;

  // 计算中心区域起始位置
  const centerRow = Math.floor((MapHeight - examHeight) / 2);
  const centerCol = Math.floor((MapWidth - examWidth) / 2);

  // 在中心区域随机偏移
  const maxRowOffset = Math.max(0, MapHeight - examHeight - centerRow);
  const maxColOffset = Math.max(0, MapWidth - examWidth - centerCol);

  const rowOffset =
    Math.floor(Math.random() * (maxRowOffset * 2 + 1)) - maxRowOffset;
  const colOffset =
    Math.floor(Math.random() * (maxColOffset * 2 + 1)) - maxColOffset;

  const startRow = Math.max(0, centerRow + rowOffset);
  const startCol = Math.max(0, centerCol + colOffset);

};
const addExample = (exam?: Creature) => {
  if (!exam && active.value) {
    exam = JSON.parse(JSON.stringify(active.value)) as Creature;
  }
  // 检查是否已经存在
  for (let exa of examStore.value) {
    if (exam && JSON.stringify(exa.cells) === JSON.stringify(exam.cells)) {
      return;
    }
  }
  active.value = exam!;
  examStore.value.push(exam)
}

const showExample = (exam: Creature, _real: Creature) => {
  active.value = exam;
  real.value = _real;
}
defineExpose({ showExample, addExample })
</script>

<style lang="scss">
.panel {
  width: 240px;
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
  border: 3px solid transparent;

  &.active,
  &:hover {
    border: 3px solid #84ca7e;
  }
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
