import request from "@/utils/request";

// 获取spu列表
export const getSpuList = (page, limit, category3Id) =>
  request({
    url: `/admin/product/${page}/${limit}`,
    method: "get",
    params: {
      category3Id,
    },
  });

// 获取spu信息
export const getSpuById = (spuId) =>
  request({
    url: `/admin/product/getSpuById/${spuId}`,
    method: "get",
  });

// 获取品牌信息
export const getTradeMarkList = () =>
  request({
    url: `/admin/product/baseTrademark/getTrademarkList`,
    method: "get",
  });

// 获取spu图片
export const getSpuImageList = (spuId) =>
  request({
    url: `/admin/product/spuImageList/${spuId}`,
    method: "get",
  });

// 获取平台全部销售属性
export const getBaseSaleAttrList = () =>
  request({
    url: "/admin/product/baseSaleAttrList",
    method: "get",
  });

// 添加SPU
export const addSpuInfo = (data) =>
  request({
    url: "/admin/product/saveSpuInfo",
    data,
    method: "post",
  });

// -----------------------

// 删除spu
export const deleteSpu = (spuId) =>
  request({
    url: `/admin/product/deleteSpu/${spuId}`,
    method: "delete",
  });

// 修改SPU
export const updateSpu = (data) =>
  request({
    url: "/admin/product/updateSpuInfo",
    data,
    method: "post",
  });
