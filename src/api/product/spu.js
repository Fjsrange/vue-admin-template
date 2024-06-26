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

// 添加 或 修改 SPU
export const addAndUpdateSpu = (data) => {
  if (!data.id) {
    // 添加
    return request({
      url: "/admin/product/saveSpuInfo",
      data,
      method: "post",
    });
  } else {
    // 修改
    return request({
      url: "/admin/product/updateSpuInfo",
      data,
      method: "post",
    });
  }
};

// 删除spu
export const deleteSpu = (spuId) =>
  request({
    url: `/admin/product/deleteSpu/${spuId}`,
    method: "delete",
  });

// 获取图片列表
export const spuImgList = (spuId) =>
  request({
    url: `/admin/product/spuImageList/${spuId}`,
    method: "get",
  });

// 获取销售属性
export const saleAttrList = (spuId) =>
  request({
    url: `/admin/product/spuSaleAttrList/${spuId}`,
    method: "get",
  });

// 获取平台属性接口
export const attrInfoList = (category1Id, category2Id, category3Id) =>
  request({
    url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
    method: "get",
  });

// 添加保存skuForm
export const saveSkuInfo = (data) =>
  request({
    url: "/admin/product/saveSkuInfo",
    data,
    method: "post",
  });

// skuForm表单详情
export const skuList = (spuId) =>
  request({
    url: `/admin/product/findBySpuId/${spuId}`,
    method: "get",
  });
