# block-world

> 细胞世界的浏览器原型（2025-06）：用 Vue 3 + canvas 让「一格一格的生物世界」跑起来，并把两种世界表示各实现一遍做对照。

## 这是什么

两套「世界」+ 一套控制面板：

| 目录 | 实现 | 内容 |
| --- | --- | --- |
| `src/components/world1/` | DOM 网格 | 每个格子是一个 `div`（`cell.vue`），世界数据与生成规则在 `data.ts`，`panel.vue` 直接调参 |
| `src/components/world2/` | canvas | `Ocean.ts` 是模块级单例世界（画布、`ctx`、生物列表、主循环都挂在它上面），`Creature.ts` 是生物模型 |

`world2/index.vue` 提供 随机 / 停止 / 重置 / 消除 四个操作，并实时显示生物数量。

## 值得看的三处

- **deltaTime 主循环**（`Ocean.ts`）：`lastTime` + 帧回调算出 deltaTime，运动按真实流逝时间推进——帧率高低不影响移动速度。
- **像素 ↔ 格换算**（`pixelToUnit`）：世界以「格」为单位、渲染以像素为单位，全项目只保留这一个换算点；画布尺寸按屏幕可用宽高取整到格宽。
- **同一规则、两种表示**：`world1`（DOM）与 `world2`（canvas）跑同样的世界规则，可以直接看出 DOM 方案在格子数上去后吃不住——这也是后来换渲染方式的直接原因。

## 运行

```bash
npm i
npm run dev
```

依赖只有 `vue`，无第三方渲染/物理库。

## 现状

5 天的原型（13 次提交，2025-06-22 ~ 2025-06-26），没有测试与设计文档；同主题的后续实现在 [cell-world](https://github.com/johnshere/cell-world) 仓库继续。

## License

MIT
