import { reactive } from "vue";
import { storm } from "./Ocean";
import { Creature } from "./Creature";

export const store = reactive<{
  frameTime: number;
  runningId: number | null;
  times: number;
}>({
  frameTime: 700,
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
};
reset();

export const fall = (num: number = 1) => {
  if (num <= 0) {
    throw new Error("num must be greater than 0");
  }
};
export const run = () => {
  stop();
  // 使用现有的grid引用
  store.runningId = setInterval(() => {
    // 一次性更新网格状态

    new Creature();

    storm();
    store.times++;

    // fall();
    // 检查是否所有细胞都已死亡
  }, store.frameTime);

  // 返回清理函数
  return {
    id: store.runningId,
  };
};
