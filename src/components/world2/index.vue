<template>
    <div class="main">
        <div class="operate">
            <button @click="start">随机</button>
            <button @click="stop">停止</button>
            <button @click="reset">重置</button>
            <button @click="remove">消除</button>
            <span class="count">count: {{ ocean?.length }}</span>
        </div>
        <div class="cosmos">
            <World />
            <Panel ref="panel" />
            <Panel ref="panel2" type="2" />
        </div>
    </div>
</template>
<script lang="ts" setup>
import World from "./world.vue";
import Panel from "./panel.vue";
import { onMounted, ref } from "vue";
import { reset, run, stop, ocean, world } from "./Ocean";
import { Creature } from "./Creature";

const panel = ref<InstanceType<typeof Panel>>();
// 更均匀的类型分布
const typeRanges = [
    { max: 0.4, size: 3 },  // 基础生物
    { max: 0.7, size: 4 },  // 中等生物
    { max: 0.9, size: 5 }, //  大型生物
    { max: 0.95, size: 6 }, // 5% 大型生物
    { max: 0.98, size: 7 },  // 3% 巨型生物
    { max: 1.00, size: 8 }   // 2% 巨型生物
];
const check = ref<Creature>()
const remove = () => {
    if (!check.value) return;
    check.value.isAlive = false
}
let generateInterval: number = 0;
const generate = (deltaTime: number) => {
    generateInterval += deltaTime;
    if (generateInterval < 1000) return;
    generateInterval = 0;
    // 使用更均匀的随机分布
    let ran = Math.random();

    // 根据当前生物数量动态调整生成概率
    const densityFactor = (ocean.value.length / 70);
    if (ran < densityFactor) return;

    let creature: Creature | undefined = undefined;
    // if (ran > 0.1) {
    //     const localExamples = localStorage.getItem('creature-examples')
    //     const examples = localExamples ? JSON.parse(localExamples) : []
    //     const exam = examples[Math.floor(Math.random() * examples.length)];
    //     creature = new Creature(exam);
    // }
    if (!creature) {
        ran = Math.random();
        const selectedType = typeRanges.find(range => ran <= range.max);
        creature = new Creature(selectedType?.size);
        // creature.color = '#fff'
    }


    // 随机生成一个位置，位置为中心，大小为size*size，但是要校验当时是否与其他的creature重叠
    let x = Math.floor(Math.random() * (world.cols - creature.position.cols));
    const y = Math.floor((Math.random() * world.rows) / 8);
    creature.position.x = x;
    creature.position.y = y;

    // 确保新生物不会与现有生物重叠
    const canPlace = ocean.value.every(c => !c.checkCollision(creature));
    if (canPlace) {
        creature.onClick = (real, initial) => {
            check.value = real;
            if (real) {
                real.color = '#FF0000'
                setTimeout(() => {
                    real.moveInterval = Math.max(4, real.moveInterval - 8);
                }, 5000);
            }
            if (initial) {
                initial.color = '#FF0000'
                panel.value?.showExample(initial, real);
            }
        };
        ocean.value.push(creature);
    }
}
const start = () => {
    run(generate)
}
onMounted(() => run())
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
        padding: 3px 6px;
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