<template>
    <div class="main">
        <div class="operate">
            <button @click="run">运转</button>
            <button @click="random(30)">随机</button>
            <button @click="randomKill(2000)">随机kill</button>
            <button @click="stop">停止</button>
            <button @click="reset">重置</button>
            <span class="count">count: {{ activeCount }}</span>
            <span class="count">times: {{ store.times }}</span>
        </div>
        <div class="cosmos">
            <World />
            <Panel />
        </div>
    </div>
</template>
<script lang="ts" setup>
import World from "./world.vue";
import Panel from "./panel.vue";
import { random, reset, run, store, stop, randomKill } from "./data";
import { computed } from "vue";

const activeCount = computed(() => store.grid.flat().filter((cell) => cell).length)
</script>
<style lang="scss">
.main {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 18px;
}

.operate {
    margin: 0 auto 12px;

    button {
        padding: 6px 12px;
        margin-left: 6px;
    }

    .count {
        margin-left: 6px;
    }
}

.cosmos {
    width: 100%;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: stretch;
    gap: 18px;
}
</style>