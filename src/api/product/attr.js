// 平台属性管理模块请求文件
import request from "@/utils/request";

// 获取一级分类
export const category1List = () =>
  request({
    url: "/admin/product/getCategory1",
    method: "get",
  });

// 获取二级分类
export const category2List = (category1id) =>
  request({
    url: `/admin/product/getCategory2/${category1id}`,
    method: "get",
  });

// 获取三级分类
export const category3List = (category2id) =>
  request({
    url: `/admin/product/getCategory3/${category2id}`,
    method: "get",
  });

// 获取平台属性
export const attrInfoList = (category1id, category2id, category3id) =>
  request({
    url: `/admin/product/attrInfoList/${category1id}/${category2id}/${category3id}`,
  });

// 添加属性与属性值
export const saveAttrInfo = (data) =>
  request({
    url: "/admin/product/saveAttrInfo",
    data,
    method: "post",
  });

// 删除属性
export const deleteAttr = (attrId) =>
  request({
    url: `/admin/product/deleteAttr/${attrId}`,
    method: "delete",
  });
