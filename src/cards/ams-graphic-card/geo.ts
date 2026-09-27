/*
 * AMS Graphic Card —— 几何常量与工具函数
 *
 * 坐标系：1× 设计单位，画布 700 × 360（与 src/images/*.png 的实际分辨率一致）。
 * 各机型的各层素材都按同一画布对齐，因此所有坐标可以直接写在几何表里。
 */

export const LABEL_FONT = 20; // 材料标签字号
export const PCT_FONT = 21; // 余量百分比字号
export const EMPTY_LABEL = "空"; // 空盘位标签文字（仅在 show_empty_label 开启时绘制）

export const FONT_STACK =
  'var(--ha-font-family-body, "Segoe UI", Roboto, "Helvetica Neue", "Microsoft YaHei", sans-serif)';

export interface Slot {
  empty: boolean;
  color: string;
  remain: number;
  type: string;
  name: string;
  active: boolean;
  missing?: boolean;
}

export interface LcdField {
  key: "hum" | "temp" | string;
  label: string;
  x: number;
  lx: number;
}

export interface VariantGeo {
  name: string;
  base: string; // BASE_IMAGES 的键
  brand?: string; // BRAND_IMAGES 的键；有值才叠加丝印层
  mech?: boolean; // 是否叠加机构层
  centers: number[]; // 料盘中心 x（相对 viewBox 左边缘）
  spW: number; // 料盘宽
  spH: number; // 料盘高
  spY: number; // 料盘顶
  flangeFrac: number; // 轮缘宽 / 料盘宽
  bandCY: number; // 材料带中心 y
  matCap: number; // 材料带最大占比
  labelY: number; // 材料标签行 y
  fade: "a2p" | "none"; // 料盘下半段渐隐（AMS / AMS 2 PRO），或不做渐隐
  vb: [number, number, number, number];
  lcd?: boolean; // 是否有可实时绘制的面板
  clipY?: number; // 料盘在此 y 以下被完全遮挡
  chipMaxY?: number; // 余量标签的 y 上限（避免落进遮挡区）
  bandTop?: number; // 「底图置顶」条带的上下沿（例如银色卡扣/罩子交界处）
  bandBot?: number;
  lcdFields?: LcdField[];
  lcdLabelY?: number;
  lcdValueY?: number;
  lcdLabelFont?: number;
  lcdValueFont?: number;
  unsupported?: boolean;
}

const VB_DEFAULT: [number, number, number, number] = [0, 0, 700, 360];

/* AMS / AMS 2 PRO 共用同一套几何（料盘位置一致），差别只在底图 / 丝印层 */
const AMS_LIKE: Pick<
  VariantGeo,
  "centers" | "spW" | "spH" | "spY" | "flangeFrac" | "bandCY" | "matCap" | "labelY" | "fade" | "vb" | "mech"
> = {
  centers: [155.75, 284.5, 414.25, 542.75],
  spW: 101,
  spH: 265,
  spY: 19,
  flangeFrac: 0.075,
  bandCY: 150,
  matCap: 0.9,
  labelY: 268,
  fade: "a2p",
  vb: VB_DEFAULT,
  mech: true,
};

export const VARIANTS: { [key: string]: VariantGeo } = {
  ams2pro: {
    name: "AMS 2 PRO",
    base: "ams2",
    brand: "ams2pro",
    ...AMS_LIKE,
  },
  ams: {
    /* 官方 ams.png 是 AMS v1 机身；本卡按要求使用「AMS 2 机身 + AMS 标签」的底图 */
    name: "AMS",
    base: "amsAlt",
    brand: "ams",
    ...AMS_LIKE,
  },
  ht: {
    name: "AMS HT",
    base: "amshtClean",
    centers: [114.04],
    spW: 111,
    spH: 292,
    spY: 24,
    flangeFrac: 0.075,
    bandCY: 168,
    matCap: 0.9,
    labelY: 265,
    fade: "none",
    /* 视窗比画布大：整体等比放大后，料盘绘制高与 AMS / AMS 2 PRO 一致
       （面板较窄，两侧留白是几何必然，不是裁切） */
    vb: [237.96, -30.1, 223.1, 419.7],
    lcd: true,
    /* 料盘下半段过了罩子/银色卡扣 → 完全遮挡 */
    clipY: 168,
    chipMaxY: 152,
    /* 把底图的这一条带重新画到料盘之上，恢复被料盘挡住的卡扣 */
    bandTop: 163,
    bandBot: 184,
    lcdFields: [
      { key: "hum", label: "湿度", x: 85.04, lx: 85.04 },
      { key: "temp", label: "温度", x: 141.04, lx: 141.04 },
    ],
    lcdLabelY: 205,
    lcdValueY: 224,
    lcdLabelFont: 8,
    lcdValueFont: 14,
  },
  lite: {
    name: "AMS Lite",
    base: "ams2",
    centers: [],
    spW: 0,
    spH: 0,
    spY: 0,
    flangeFrac: 0,
    bandCY: 0,
    matCap: 0,
    labelY: 0,
    fade: "none",
    vb: VB_DEFAULT,
    unsupported: true,
  },
};

/* 料盘竖直方向透明度：上半段全显，下半段渐隐进底图的暗腔 */
export const FADE_STOPS: [number, number][] = [
  [0.0, 1.0],
  [140 / 360, 1.0],
  [160 / 360, 0.627],
  [180 / 360, 0.251],
  [190 / 360, 0.251],
  [260 / 360, 0.125],
  [330 / 360, 0.0],
  [1.0, 0.0],
];

/* 由设备型号字符串判定使用哪套几何 */
export function variantFromModel(model: string): string {
  const m = String(model || "").toLowerCase();
  if (m.includes("lite")) return "lite";
  if (m.includes("ht")) return "ht";
  if (m.includes("2")) return "ams2pro";
  if (m.includes("ams")) return "ams";
  return "ams2pro";
}

export function isBlankColor(c: any): boolean {
  if (!c) return true;
  const s = String(c).toLowerCase().replace("#", "").trim();
  return s === "" || s === "00000000" || s === "000000" || s === "none" || s === "nil";
}

/* 材料带高度百分比：空盘位给一个很小的值，满料/未知给 95% */
export function remainPct(slot: Slot): number {
  if (slot.empty) return 20;
  const r = slot.remain;
  if (r == null || r < 0 || Number.isNaN(r)) return 95;
  return 20 + (r / 100) * 75;
}

export function esc(s: any): string {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const _mcv = document.createElement("canvas");
const _mctx = _mcv.getContext("2d") as CanvasRenderingContext2D;
let _fontFam = "";

/* 量文字宽度时必须用 HA 实际渲染的字体（SVG 里 text 用的是 --ha-font-family-body），
   否则量出的宽度偏窄，"100%" 会顶出黑框 */
export function fontFamily(): string {
  if (_fontFam) return _fontFam;
  let f = "";
  try {
    f = getComputedStyle(document.documentElement).getPropertyValue("--ha-font-family-body").trim();
  } catch (e) {
    /* ignore */
  }
  _fontFam = f || '"Segoe UI", Roboto, "Microsoft YaHei", sans-serif';
  return _fontFam;
}

export function measureText(text: any, size: number, weight?: number): number {
  const t = String(text);
  if (!_mctx) return t.length * size * 0.62;
  _mctx.font = `${weight || 400} ${size}px ${fontFamily()}`;
  const w = _mctx.measureText(t).width;
  return w > 0 ? w : t.length * size * 0.62;
}

/* 标签底框宽度：量出的宽度 + 余量，并保证不小于「按字符数估算」的下限 */
export function chipWidth(text: any, size: number, extra?: number, perChar?: number): number {
  const t = String(text);
  const w = measureText(t, size);
  return Math.max(
    w + (extra == null ? 18 : extra),
    t.length * size * (perChar == null ? 0.72 : perChar)
  );
}
