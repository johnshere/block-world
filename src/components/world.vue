<template>
    <div class="world">
        <div v-for="(row, rowIndex) in store.grid" :key="rowIndex" class="row">
            <Cell v-for="(cell, colIndex) in row" :key="colIndex" :active="cell"
                @click="handleClick(rowIndex, colIndex)" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { toggle, store, crossKill } from './data';
import Cell from './cell.vue';

const handleClick = (row: number, col: number) => {
    if (store.runningId) {
        crossKill(row, col);
    } else {
        toggle(row, col);
    }
}
</script>

<style>
.world {
    display: flex;
    flex-direction: column;
    gap: 1px;
    background-color: #aaa;
    overflow: hidden;
}

.row {
    flex: 1;
    display: flex;
    gap: 1px;
}
</style>