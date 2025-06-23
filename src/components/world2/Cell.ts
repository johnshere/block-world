type Position = {
  x: number;
  y: number;
  width: number;
  height: number;
};
/**
 * 动物
 * 元胞自动机的动物，细胞的集合
 */
type Animal = {
  position: Position;
  cells: number[][];
  frameStep: number;
  /**
   * 状态，死亡后销毁，静止后不再变动
   * 0: 死亡
   * 1: 正常
   * 2: 静止
   */
  status: 0 | 1 | 2;
  /**
   * 碰撞，判断是否碰撞，两个单位内没有其他动物则无碰撞
   * @returns boolean
   */
  checkCollision: () => boolean;
  /**
   * 运行
   * 每次运行结束都要重新计算体积和位置
   */
  run: () => void;
};
