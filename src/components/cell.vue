<template>
    <div :class="['cell', { active }]" />
</template>
<script lang="ts" setup>
defineProps<{ active: boolean }>()
</script>
<style lang="scss" scoped>
.cell {
    width: 7px;
    height: 7px;
    background-color: black;
}

.cell.active {
    background-color: white;
}
</style>