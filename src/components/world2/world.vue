<template>
  <div ref="world" class="world">
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { createOcean, storm, unit } from './Ocean';
import { Creature } from './Creature';

let width = screen.availWidth * 0.5;
width = width - (width % (unit * 10));
let height = screen.availHeight * 0.8;
height = height - (height % (unit * 10));

const world = ref<HTMLElement>();
onMounted(() => {
  createOcean({ width, height }, world.value!);
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
