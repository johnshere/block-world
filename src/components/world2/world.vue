<template>
  <div ref="world" class="world">
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { createOcean, storm } from './Ocean';


const world = ref<HTMLElement>();
onMounted(() => {
  createOcean(world.value!);
  storm()
  // let creature: any;
  // setInterval(() => {
  //   if (!creature) {
  //     creature = new Creature();
  //   }
  //   creature.run();
  // }, 1000);
});
</script>

<style>
.world {
  position: relative;
}
</style>
