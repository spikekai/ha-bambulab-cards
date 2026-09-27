/*
 * AMS Graphic Card —— 素材
 *
 * rollup-plugin-img 会把这里的图片输出到 dist/images/，import 得到的是 URL 字符串。
 *
 * 复用官方已有素材（`src/images/` 里本来就有）：
 *   - ams.png / ams2.png / amsht.png 三种机型的空仓底图
 *
 * 本卡新增素材（官方没有，原因见 docs/cards/ams-graphic-card.md）：
 *   - ams-alt.png      AMS 底图：官方 ams.png 是 **AMS v1 机身**（轮廓比 AMS 2 宽），
 *                      而本卡需要一个「AMS 2 机身 + AMS 标签」的版本，因此单独提供
 *   - amsht-clean.png  AMS HT 底图：面板上原本烘焙着固定的温湿度/时间数字，
 *                      这里已擦除，改由卡片按实时传感器绘制（否则永远显示同一组假数据）
 *   - ams2pro-mech.png  机构层：把料盘压在玻璃/罩子之后的遮挡关系
 *   - *-brand.png       丝印层：单独置顶，避免被料盘盖住
 */
import AMSImage from "../../images/ams.png";
import AMS2Image from "../../images/ams2.png";
import AMSHTImage from "../../images/amsht.png";
import AMSAltImage from "../../images/ams-alt.png";
import AMSHTCleanImage from "../../images/amsht-clean.png";
import MechImage from "../../images/ams2pro-mech.png";
import BrandAMS2Image from "../../images/ams2pro-brand.png";
import BrandAMSImage from "../../images/ams-brand.png";

export const BASE_IMAGES: { [key: string]: string } = {
  ams: AMSImage,
  ams2: AMS2Image,
  amsht: AMSHTImage,
  amsAlt: AMSAltImage,
  amshtClean: AMSHTCleanImage,
};

export const MECH_IMAGE = MechImage;

export const BRAND_IMAGES: { [key: string]: string } = {
  ams2pro: BrandAMS2Image,
  ams: BrandAMSImage,
};
