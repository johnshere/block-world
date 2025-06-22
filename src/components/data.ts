import { ref } from "vue";
import { MapHeight, MapWidth } from "../consts/config";
import { reactive } from "vue";

export const grid = ref(
  Array(MapHeight)
    .fill(null)
    .map(() => Array(MapWidth).fill(false))
);

export const store = reactive<{
  frameTime: number;
  grid: boolean[][];
  runningId: number | null;
  times: number;
}>({
  frameTime: 700,
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
  store.grid = Array(MapHeight)
    .fill(null)
    .map(() => Array(MapWidth).fill(false));
};
reset();

export const fall = (num: number = 1) => {
  if (num <= 0) {
    throw new Error("num must be greater than 0");
  }
  if (num > MapHeight) {
    throw new Error("num must be less than MapHeight");
  }
  const newGrid = [];
  for (let i = store.grid.length - 1 - num; i >= 0; i--) {
    newGrid[i + num] = store.grid[i];
  }
  for (let i = 0; i < num; i++) {
    newGrid[i] = Array(MapWidth).fill(false);
  }
  store.grid = newGrid;
};
export const run = () => {
  stop();
  // 使用现有的grid引用
  store.runningId = setInterval(() => {
    // 创建新网格用于存储下一状态
    const newGrid = Array(MapHeight)
      .fill(null)
      .map(() => Array(MapWidth).fill(false));

    // 遍历每个细胞
    for (let i = 0; i < store.grid.length; i++) {
      for (let j = 0; j < store.grid[i].length; j++) {
        // 计算周围活跃细胞数量
        let neighbors = 0;
        for (let x = -1; x <= 1; x++) {
          for (let y = -1; y <= 1; y++) {
            if (x === 0 && y === 0) continue;
            const ni = i + x;
            const nj = j + y;
            if (
              ni >= 0 &&
              ni < store.grid.length &&
              nj >= 0 &&
              nj < store.grid[i].length &&
              store.grid[ni][nj]
            ) {
              neighbors++;
            }
          }
        }

        // 在新网格中计算下一状态
        if (store.grid[i][j]) {
          newGrid[i][j] = neighbors === 2 || neighbors === 3;
        } else {
          newGrid[i][j] = neighbors === 3;
        }
      }
    }

    // 一次性更新网格状态
    store.grid = newGrid;
    store.times++;

    fall();
    if (store.times % 3 === 0) {
      if (store.times % 2 === 0) {
        randomTop(4);
      } else {
        randomTop();
      }
    } else if (store.times % 5 === 0) {
      randomTop(4);
    } else if (store.times % 7 === 0) {
      randomTop(6);
    }

    // 检查是否所有细胞都已死亡
    const allDead = store.grid.every((row) => row.every((cell) => !cell));
    if (allDead) {
      stop();
      console.log("所有细胞已死亡，自动停止");
      return;
    }
  }, store.frameTime);

  // 返回清理函数
  return {
    id: store.runningId,
  };
};
/**
 * 最上边几行随机生成一个区域
 * 区域的大小为size*size个块
 * 区域的位置为随机
 * 区域的内容为随机
 * 每个块的内容为true的概率为1/2，其余为false
 * @param size
 */
export const randomTop = (size = 3) => {
  if (size <= 0) {
    throw new Error("size must be greater than 0");
  }
  if (size > MapWidth) {
    throw new Error("size must be less than MapWidth");
  }
  let colIndex;
  // 需要检查是否有重叠的区域
  // 如果有重叠的区域，需要重新生成
  // 这里简单的判断是否有重叠的区域，如果有重叠的区域，需要重新生成
  let isOverlap = true;
  while (isOverlap) {
    colIndex = Math.floor(Math.random() * (MapWidth - size));
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (store.grid[i][colIndex + j]) {
          continue;
        }
      }
    }
    isOverlap = false;
  }
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      store.grid[i][colIndex! + j] = Math.random() > 0.5;
    }
  }
};
export const random = (num: number) => {
  if (num <= 0) {
    throw new Error("num must be greater than 0");
  }
  if (num > MapWidth * MapHeight) {
    throw new Error("num must be less than MapWidth * MapHeight");
  }
  while (num > 0) {
    if (store.grid[MapHeight - 1][MapWidth - 1]) {
      continue;
    }
    const rowIndex = Math.floor(Math.random() * MapHeight);
    const colIndex = Math.floor(Math.random() * MapWidth);
    store.grid[rowIndex][colIndex] = true;
    num--;
  }
};
export const crossKill = (rowIndex: number, colIndex: number) => {
  store.grid.forEach((row, i) => {
    row.forEach((cell, j) => {
      if (
        i === rowIndex ||
        i === rowIndex - 1 ||
        j === colIndex ||
        j === colIndex - 1
      ) {
        store.grid[i][j] = false;
      }
    });
  });
};
export const randomKill = (num: number) => {
  if (num <= 0) {
    throw new Error("num must be greater than 0");
  }
  if (num > MapWidth * MapHeight) {
    throw new Error("num must be less than MapWidth * MapHeight");
  }
  while (num > 0) {
    const rani = Math.floor(Math.random() * MapHeight);
    const ranj = Math.floor(Math.random() * MapWidth);
    store.grid[rani][ranj] = false;
    num--;
  }
};

export const toggle = (rowIndex: number, colIndex: number) => {
  store.grid[rowIndex][colIndex] = !store.grid[rowIndex][colIndex];
};
