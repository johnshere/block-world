import { ref } from "vue";
import { MapHeight, MapWidth } from "../consts/config";
import { reactive } from "vue";

export const grid = ref(
  Array(MapHeight)
    .fill(null)
    .map(() => Array(MapWidth).fill(false))
);

export const store = reactive<{
  grid: boolean[][];
  runningId: number | null;
  times: number;
}>({
  grid: [],
  runningId: null,
  times: 0,
});

export const stop = () => {
  store.runningId && clearInterval(store.runningId);
  store.runningId = null;
};
export const reset = () => {
  stop();
  store.times = 0;
  grid.value = Array(MapHeight)
    .fill(null)
    .map(() => Array(MapWidth).fill(false));
};
reset();

export const run = () => {
  stop();
  // 使用现有的grid引用
  store.runningId = setInterval(() => {
    // 遍历每个细胞
    for (let i = 0; i < grid.value.length; i++) {
      for (let j = 0; j < grid.value[i].length; j++) {
        // 计算周围活跃细胞数量
        let neighbors = 0;
        for (let x = -1; x <= 1; x++) {
          for (let y = -1; y <= 1; y++) {
            if (x === 0 && y === 0) continue;
            const ni = i + x;
            const nj = j + y;
            if (
              ni >= 0 &&
              ni < grid.value.length &&
              nj >= 0 &&
              nj < grid.value[i].length &&
              grid.value[ni][nj]
            ) {
              neighbors++;
            }
          }
        }

        // 应用元胞自动机规则
        if (grid.value[i][j]) {
          // 活跃细胞：2或3个邻居则存活，否则死亡
          grid.value[i][j] = neighbors === 2 || neighbors === 3;
        } else {
          // 死亡细胞：恰好3个邻居则复活
          grid.value[i][j] = neighbors === 3;
        }
      }
    }
    store.times++;

    // 检查是否所有细胞都已死亡
    const allDead = grid.value.every((row) => row.every((cell) => !cell));
    if (allDead) {
      stop();
      console.log("所有细胞已死亡，自动停止");
      return;
    }
  }, 500);

  // 返回清理函数
  return {
    id: store.runningId,
  };
};

export const random = (num: number) => {
  if (num <= 0) {
    throw new Error("num must be greater than 0");
  }
  if (num > MapWidth * MapHeight) {
    throw new Error("num must be less than MapWidth * MapHeight");
  }
  while (num > 0) {
    if (grid.value[MapHeight - 1][MapWidth - 1]) {
      continue;
    }
    const rowIndex = Math.floor(Math.random() * MapHeight);
    const colIndex = Math.floor(Math.random() * MapWidth);
    grid.value[rowIndex][colIndex] = true;
    num--;
  }
};
export const crossKill = (rowIndex: number, colIndex: number) => {
  grid.value.forEach((row, i) => {
    row.forEach((cell, j) => {
      if (i === rowIndex || j === colIndex) {
        grid.value[i][j] = false;
      }
    });
  });
};

export const toggle = (rowIndex: number, colIndex: number) => {
  grid.value[rowIndex][colIndex] = !grid.value[rowIndex][colIndex];
};
