<template>
  <div class="panel-wrap">
    <div class="operate">
      <button @click="rotate">旋转</button>
      <button @click="remove">删除</button>
      <!-- <span>选中：{{ active }}</span> -->
    </div>
    <div class="panel">
      <div v-for="(example, ei) in show" class="example" :class="{ active: active === example }"
        @click="select(example)">
        <div v-for="(row, rowIndex) in example" :key="rowIndex" class="row">
          <div v-for="(cell, colIndex) in row" :key="colIndex" :class="['cell', { active: !!cell }]" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { MapHeight, MapWidth } from '@/consts/config';
import { computed } from '@vue/reactivity';

const localExamples = localStorage.getItem('creature-examples')
const examples = ref<boolean[][][]>(localExamples ? JSON.parse(localExamples) : []);
const show = computed(() => {
  return examples.value.slice().sort((a, b) => {
    return a.length - b.length;
  })
})
watch(() => examples.value, () => {
  // 去重
  localStorage.setItem('creature-examples', JSON.stringify(examples.value));
}, { deep: true })

const active = ref<boolean[][]>();
const select = (exa: boolean[][]) => {
  active.value = exa;
}
const rotate = () => {
  if (!active.value) return;
  // 旋转90度
}
const remove = () => {
  if (!active.value) return;
  const index = examples.value.indexOf(active.value);
  examples.value.splice(index, 1)
}
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

};
const addExample = (exam: boolean[][]) => {
  // 检查是否已经存在
  if (examples.value.some(t => JSON.stringify(t) === JSON.stringify(exam))) {
    return;
  }
  examples.value.push(exam)
}
defineExpose({ addExample })
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
  border: 2px solid transparent;

  &.active,
  &:hover {
    border: 2px solid #84ca7e;
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
