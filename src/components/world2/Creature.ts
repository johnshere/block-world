import { setAlive, ocean, world, pixelToUnit } from "./Ocean";

export type Size = {
  width: number;
  height: number;
};
export interface Position extends Size {
  x: number;
  y: number;
}
export type Cell = {
  x: number; // 相对于position的x坐标
  y: number; // 相对于position的y坐标
  isAlive: boolean;
};
export class Creature {
  position: Position = { x: 0, y: 0, width: 0, height: 0 };
  cells: Cell[][];
  step = 2;
  /**
   * 运动方向，0为静止
   * x:1为向右，2为向左
   * y:1为向下，2为向上
   */
  direction: { x: 0 | 1 | 2; y: 0 | 1 | 2 };
  isAlive = true;
  /**
   * 构造函数
   * @param size 大小，默认为3
   */
  constructor(size: number = 3) {
    this.direction = {
      x: Math.floor(Math.random() * 2.5 + 0.5) as 0 | 1 | 2,
      y: Math.floor(Math.random() * 2.5 + 0.5) as 0 | 1 | 2,
    };

    if (!size || size < 2) size = Math.floor(Math.random() * 3 + 2);
    this.cells = [];
    for (let i = 0; i < size; i++) {
      if (!this.cells[i]) this.cells[i] = [];
      for (let j = 0; j < size; j++) {
        const isAlive = Math.random() > 0.5;
        this.cells[i][j] = { x: j, y: i, isAlive };
      }
    }

    const halfw = Math.floor(world.width / 2);
    const halfh = Math.floor(world.height / 2);

    // 随机生成一个位置，位置为中心，大小为size*size，但是要校验当时是否与其他的creature重叠
    // 如果重叠，重新生成
    let isOverlap = true;
    let count = 0;
    while (isOverlap) {
      count++;
      if (count > 30) {
        return;
      }
      const x = pixelToUnit(
        halfw + Math.floor(Math.random() * halfw - halfw / 2)
      );
      const y = pixelToUnit(
        halfh + Math.floor(Math.random() * halfh - halfh / 2)
      );
      this.position = {
        x,
        y,
        width: size,
        height: size,
      };
      this.updateSize();
      isOverlap = ocean.value.some((c) => !!this.checkCollision(c));
    }

    ocean.value.push(this);
  }
  /**
   * 更新size
   */
  updateSize() {
    let minw = this.position.width;
    let maxw = 0;
    let minh = this.position.height;
    let maxh = 0;
    for (let i = 0; i < this.cells.length; i++) {
      for (let j = 0; j < this.cells[i].length; j++) {
        if (this.cells[i][j]?.isAlive) {
          minw = Math.min(minw, j + 1);
          maxw = Math.max(maxw, j + 1);
          minh = Math.min(minh, i + 1);
          maxh = Math.max(maxh, i + 1);
        }
      }
    }
    // 需要修正position
    this.position.x = this.position.x + minw;
    this.position.y = this.position.y + minh;
    this.position.width = maxw - minw;
    this.position.height = maxh - minh;
  }
  /**
   * 检测边界
   */
  checkBound(width: number, height: number) {
    if (this.position.x <= 0) {
      this.direction.x = 1;
    }
    if (this.position.y <= 0) {
      this.direction.y = 1;
    }
    if (this.position.x + this.position.width >= width) {
      this.direction.x = 2;
    }
    if (this.position.y + this.position.height >= height) {
      this.direction.y = 2;
    }
  }
  /**
   * 检测碰撞
   */
  checkCollision(target: Creature) {
    // 检测两者区域是否靠近，距离小于等于1则碰撞
    const { x, y, width, height } = this.position;
    const { x: tx, y: ty, width: twidth, height: theight } = target.position;
    if (
      x + width + 1 < tx ||
      x > tx + twidth + 1 ||
      y + height + 1 < ty ||
      y > ty + theight + 1
    ) {
      return false;
    }
    return true;
  }
  run() {
    // 检测边界
    this.checkBound(world.width, world.height);
    // 检测碰撞
    // const targets = ocean.value
    //   .filter((t) => t !== this)
    //   .filter((t) => this.checkCollision(t));

    // 移动

    // 元胞自动机生存检测
    const newGrid = [] as Cell[][];
    for (let i = 0; i < this.cells.length; i++) {
      if (!newGrid[i]) newGrid[i] = [];
      for (let j = 0; j < this.cells[i].length; j++) {
        newGrid[i][j] = { x: j, y: i, isAlive: false };
      }
    }
    for (let i = 0; i < this.cells.length; i++) {
      for (let j = 0; j < this.cells[i].length; j++) {
        // 计算周围活跃细胞数量
        let neighbors = 0;
        for (let x = -1; x <= 1; x++) {
          for (let y = -1; y <= 1; y++) {
            if (x === 0 && y === 0) continue;
            const ni = i + x;
            const nj = j + y;
            if (
              ni >= 0 &&
              ni < this.position.width &&
              nj >= 0 &&
              nj < this.position.height &&
              this.cells[ni][nj].isAlive
            ) {
              neighbors++;
            }
          }
        }

        if (this.cells[i][j].isAlive) {
          newGrid[i][j].isAlive = neighbors === 2 || neighbors === 3;
        } else {
          newGrid[i][j].isAlive = neighbors === 3;
        }
      }
    }
    this.cells = newGrid;

    // 判断死亡
    if (this.cells.every((row) => row.every((cell) => !cell.isAlive))) {
      this.isAlive = false;
      return;
    }

    // 绘制
    for (let i = 0; i < this.cells.length; i++) {
      for (let j = 0; j < this.cells[i].length; j++) {
        if (this.cells[i][j]?.isAlive) {
          const cell = this.cells[i][j];
          // 绘制
          const x = this.position.x + cell.x;
          const y = this.position.y + cell.y;
          setAlive(y, x);
        }
      }
    }
  }
}
