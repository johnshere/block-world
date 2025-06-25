<template>
    <div class="main">
        <div class="operate">
            <button @click="start">运转</button>
            <button @click="stop">停止</button>
            <button @click="reset">重置</button>
            <span class="count">count: {{ ocean?.length }}</span>
            <span class="count">times: {{ times }}</span>
        </div>
        <div class="cosmos">
            <World />
            <Panel ref="panel" />
        </div>
    </div>
</template>
<script lang="ts" setup>
import World from "./world.vue";
import Panel from "./panel.vue";
import { ref } from "vue";
import { reset, run, stop, ocean, times } from "./Ocean";
import { Creature } from "./Creature";

const panel = ref<InstanceType<typeof Panel>>();
const generate = () => {
    if (times.value % 6 !== 0 || ocean.value.length > 70) return;
    const ran = Math.random();
    if (ran < 0.7) {
        return;
    }
    let creature: Creature
    if (ran < 0.75) {
        creature = new Creature();
    } else if (ran < 0.85) {
        creature = new Creature(4);
    } else if (ran < 0.9) {
        creature = new Creature(5);
    } else {
        creature = new Creature(6);
    }
    creature.onClick = (_, initial) => {
        console.log(1)
        if (initial) {
            panel.value?.addExample(initial.cells)
        }
    }
    ocean.value.push(creature)
}
const start = () => {

    run(generate)
}
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