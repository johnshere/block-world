<template>
  <div ref="world" class="world">
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { createOcean } from './Ocean';


const world = ref<HTMLElement>();
onMounted(() => {
  createOcean(world.value!);
});
</script>

<style>
.world {
  position: relative;
}
</style>
