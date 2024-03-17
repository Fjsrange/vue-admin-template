// 将四个模块请求的接口函数统一暴露
import * as tradeMark from "./product/tradeMark";
import * as attr from "./product/tradeMark";
import * as sku from "./product/tradeMark";
import * as spu from "./product/tradeMark";

// 对外暴露
export default {
  tradeMark,
  attr,
  sku,
  spu,
};
