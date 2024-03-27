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

// 添加SPU
export const addSpu = (data) =>
  request({
    url: "/admin/product/saveSpuInfo",
    data,
    method: "post",
  });

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
