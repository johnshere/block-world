import { setLight, world } from "./Ocean";

export type Size = {
  width: number;
  height: number;
};
export interface Position {
  x: number;
  y: number;
  rows: number;
  cols: number;
}
/**
 * 运动方向，0为静止
 * x:1为向右，2为向左
 * y:1为向下，2为向上
 */
export type Direction = 0 | 1 | 2;

export const Colors = [
  "#FF0000", // 纯红
  "#00FF00", // 纯绿
  "#0000FF", // 纯蓝
  "#FFFF00", // 纯黄
  "#FF00FF", // 品红
  "#00FFFF", // 青色
  "#FFFFFF", // 纯白
  "#FFA500", // 橙色
  "#FF69B4", // 热粉
  "#7CFC00", // 草绿
  "#00BFFF", // 深天蓝
  "#FF4500", // 橙红
  "#FF6B6B", // 亮珊瑚
  "#4ECDC4", // 绿松石
  "#FFE66D", // 亮黄
  "#7BED9F", // 薄荷绿
  "#70C1B3", // 海蓝
  "#FF9F1C", // 橙黄
  "#FFDAB9", // 桃色
  "#FF7F50", // 珊瑚
  "#87CEEB", // 天蓝色
  "#FFD700", // 金色
  "#6A5ACD", // 中紫色
  "#FFC0CB", // 淡紫色
  "#FFA07A", // 浅珊瑚
  "#98FB98", // 淡绿色
  "#ADD8E6", // 淡蓝色
  "#FFB6C1", // 淡粉红色
  "#FFE4B5", // 米绸色
  "#DDA0DD", // 淡紫色
];

function RanDirection(type?: "x" | "y") {
  if (type === "x") {
    return 0; //Math.random() < 0.1 ? (Math.random() < 0.5 ? 2 : 1) : 0;
  } else if (type === "y") {
    return Math.random() < 0.5 ? 2 : 1;
  }
  return Math.random() < 0.5 ? 2 : 1;
}

export class Creature {
  position: Position = { x: 0, y: 0, rows: 0, cols: 0 };
  cells: boolean[][];
  growInterval = Math.floor(Math.random() * 100 + 150);
  moveInterval = Math.floor(Math.random() * 130 + 260);
  step = 1; //Math.floor(Math.random() * 2 + 1);
  /**
   * 运动方向，0为静止
   * x:1为向右，2为向左
   * y:1为向下，2为向上
   */
  direction: { x: Direction; y: Direction } = {
    y: 1,
    x: RanDirection("x"),
  };
  isAlive = true;
  isStatic = false;
  color = Colors[Math.floor(Math.random() * Colors.length)];
  initial: Creature | undefined;
  /**
   * 构造函数
   * @param initial 大小，默认为3
   */
  constructor(initial: boolean[][] | Creature | number = 3) {
    if (Array.isArray(initial)) {
      // 二维数组
      this.cells = initial;
      this.position.rows = initial.length;
      this.position.cols = initial[0].length;
    } else if (
      typeof initial !== "number" &&
      initial?.cells &&
      Array.isArray(initial.cells)
    ) {
      this.cells = initial.cells;
      this.position.rows = initial.cells.length;
      this.position.cols = initial.cells[0].length;
      if (initial.color) this.color = initial.color;
    } else {
      initial = initial as number;
      if (!initial || initial < 2) initial = Math.floor(Math.random() * 3 + 2);
      this.cells = [];
      for (let i = 0; i < initial; i++) {
        if (!this.cells[i]) this.cells[i] = [];
        for (let j = 0; j < initial; j++) {
          this.cells[i][j] = Math.random() > 0.5;
        }
      }
      this.position.rows = this.position.cols = initial;
    }

    this.initial = JSON.parse(JSON.stringify(this)) as Creature;
  }
  /**
   * 更新size
   */
  updateSize() {
    if (!this.isAlive || this.isStatic) return;
    let minw = this.position.cols;
    let maxw = 0;
    let minh = this.position.rows;
    let maxh = 0;
    for (let i = 0; i < this.cells.length; i++) {
      for (let j = 0; j < this.cells[i].length; j++) {
        if (this.cells[i][j]) {
          minw = Math.min(minw, j);
          maxw = Math.max(maxw, j);
          minh = Math.min(minh, i);
          maxh = Math.max(maxh, i);
        }
      }
    }
    // 需要修正position
    this.position.x = this.position.x + minw;
    this.position.y = this.position.y + minh;
    this.position.cols = maxw - minw + 1;
    this.position.rows = maxh - minh + 1;
    if (this.position.cols <= 0 || this.position.rows <= 0) {
      this.isAlive = false;
      return;
    }
    // 修正cells
    const newCells = Array(this.position.rows)
      .fill(null)
      .map(() => Array(this.position.cols).fill(false));
    for (let i = minh; i <= maxh; i++) {
      for (let j = minw; j <= maxw; j++) {
        newCells[i - minh][j - minw] = this.cells[i][j];
      }
    }
    this.cells = newCells;
  }
  /**
   * 检测边界
   */
  checkBound() {
    if (!this.isAlive) return;
    const { cols, rows } = world;
    if (this.position.x <= 0) {
      this.direction.x = 1;
    }
    if (this.position.y <= 0) {
      this.direction.y = 1;
    }
    if (this.position.x + this.position.cols >= cols) {
      this.direction.x = 2;
    }
    if (this.position.y + this.position.rows >= rows) {
      // this.direction.y = 2;
      this.isAlive = false;
    }
  }
  /**
   * 检测碰撞
   */
  checkCollision(target: Creature) {
    if (!this.isAlive || !target.isAlive) return false;

    // 边界检测优化
    if (
      this.position.x + this.position.cols <= target.position.x ||
      this.position.x >= target.position.x + target.position.cols ||
      this.position.y + this.position.rows <= target.position.y ||
      this.position.y >= target.position.y + target.position.rows
    ) {
      return false;
    }

    // 使用更高效的碰撞检测算法
    const x1 = Math.max(this.position.x, target.position.x);
    const x2 = Math.min(
      this.position.x + this.position.cols,
      target.position.x + target.position.cols
    );
    const y1 = Math.max(this.position.y, target.position.y);
    const y2 = Math.min(
      this.position.y + this.position.rows,
      target.position.y + target.position.rows
    );

    // 检查重叠区域内的活跃细胞
    for (let i = y1 - this.position.y; i < y2 - this.position.y; i++) {
      for (let j = x1 - this.position.x; j < x2 - this.position.x; j++) {
        if (
          i >= 0 &&
          i < this.cells.length &&
          j >= 0 &&
          j < this.cells[i].length &&
          this.cells[i][j]
        ) {
          const ti = y1 - target.position.y + i;
          const tj = x1 - target.position.x + j;
          if (
            ti >= 0 &&
            ti < target.cells.length &&
            tj >= 0 &&
            tj < target.cells[ti].length &&
            target.cells[ti][tj]
          ) {
            return true;
          }
        }
      }
    }
    return false;
  }
  onCollision(target: Creature) {
    if (!this.isAlive || !target.isAlive) return;
    const aliveCount = this.getAliveCount();
    const tAliveCount = target.getAliveCount();
    if (aliveCount > tAliveCount) {
      // 死亡
      target.isAlive = false;
      this.pickUp();
    } else {
      // 死亡
      this.isAlive = false;
      target.pickUp();
    }
  }
  getAliveCount() {
    if (!this.isAlive) return 0;
    return this.cells.flat().filter((cell) => cell).length;
  }
  grow() {
    if (!this.isAlive || this.isStatic) return;
    // 元胞自动机生存检测
    const newGrid = Array(this.position.rows + 2)
      .fill(null)
      .map(() => Array(this.position.cols + 2).fill(false));
    let hasChange = false;
    for (let ri = -1; ri < this.position.rows + 1; ri++) {
      for (let ci = -1; ci < this.position.cols + 1; ci++) {
        // 计算周围活跃细胞数量
        let neighbors = 0;
        for (let x = -1; x <= 1; x++) {
          for (let y = -1; y <= 1; y++) {
            if (x === 0 && y === 0) continue;
            const nri = ri + y;
            const nci = ci + x;
            if (
              nri >= 0 &&
              nri < this.cells.length &&
              nci >= 0 &&
              nci < this.cells[nri].length &&
              this.cells[nri][nci]
            ) {
              neighbors++;
            }
          }
        }
        let cell;
        if (ri > -1 && ri < this.cells.length) {
          if (ci > -1 && ci < this.cells[ri].length) {
            cell = this.cells[ri][ci];
          }
        }

        if (cell) {
          newGrid[ri + 1][ci + 1] = neighbors === 2 || neighbors === 3;
        } else {
          newGrid[ri + 1][ci + 1] = neighbors === 3;
        }
        if (newGrid[ri + 1][ci + 1] !== cell) {
          hasChange = true;
        }
      }
    }
    if (!hasChange) {
      this.isStatic = true;
      return;
    }
    this.cells = newGrid;
    this.position.x--;
    this.position.y--;
    this.position.cols += 2;
    this.position.rows += 2;
  }
  pickUp() {
    if (!this.isAlive || this.isStatic) return;
    this.moveInterval = Math.max(4, this.moveInterval - 1);
    this.growInterval = Math.max(5, this.growInterval - 1);
    this.direction.x = RanDirection("x");
  }
  private lastGrowTime = 0;
  private lastMoveTime = 0;
  run(deltaTime: number) {
    // 更新时间累积器
    this.lastGrowTime += deltaTime;
    this.lastMoveTime += deltaTime;

    // 生长逻辑
    if (this.lastGrowTime >= this.growInterval) {
      this.lastGrowTime = 0;
      this.grow();
      this.updateSize();
    }

    // 移动逻辑
    if (this.lastMoveTime >= this.moveInterval) {
      this.lastMoveTime = 0;
      this.move();
    }

    this.draw();
  }
  draw() {
    if (!this.isAlive) return;
    // 绘制边框
    // setRect({
    //   x: this.position.x * unit,
    //   y: this.position.y * unit,
    //   width: this.position.cols * unit,
    //   height: this.position.rows * unit,
    // });
    // 绘制
    for (let i = 0; i < this.cells.length; i++) {
      for (let j = 0; j < this.cells[i].length; j++) {
        if (this.cells[i][j]) {
          // 绘制
          const x = this.position.x + j;
          const y = this.position.y + i;
          setLight(y, x, this.color);
        }
      }
    }
  }
  move() {
    if (!this.isAlive) return;

    if (Math.random() > 0.9) {
      this.pickUp();
    }
    // 移动
    if (this.direction.x === 1) {
      this.position.x += this.step;
    } else if (this.direction.x === 2) {
      this.position.x -= this.step;
    }
    if (this.direction.y === 1) {
      this.position.y += this.step;
    } else if (this.direction.y === 2) {
      this.position.y -= this.step;
    }
    // 检测边界
    this.checkBound();
  }
  // 捕获点击事件
  linstenClick(row: number, col: number) {
    // 判断是否点击在生命上
    if (
      row >= this.position.y &&
      row < this.position.y + this.position.rows &&
      col >= this.position.x &&
      col < this.position.x + this.position.cols // &&
      // this.cells[row - this.position.y][col - this.position.x]
    ) {
      this.onClick(this, this.initial);
    }
  }
  onClick(_this: Creature, initial?: Creature) {
    console.log("onClick", initial);
  }
}
