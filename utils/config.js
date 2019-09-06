import { fetch } from './wxRequest'; //接口请求
import { getUUID } from './util'
const API = require('./api');
const API_PATH = API.API_PATH;

//接口调用
// wxRequest(url, token, data, type) 

/**
 * 前端行为埋点
 */
const put_buried_point = (page, action, param) => {
  let url = `${API_PATH}/log/event/`
  let union_id = wx.getStorageSync('union_id')
  let user_info = wx.getStorageSync('user_info')
  let params = {
    "id": union_id ? union_id : null,
    "cookie": {
      "id": getUUID(),
      "nickname": user_info ? user_info.nickName : null
    },
    "event": {
      "page": page,
      "action": action,
      "param": param
    }
  }
  return fetch(url, null, params, 'PUT', true);
}

/**
 * 获取unionid 非鉴权
 * @param params
 */
const get_unionId = (params) => {
  let url = `${API_PATH}/users`
  return fetch(url, null, params, 'PUT');
}
/**
 * 获取猫咪列表
 * @param params
 */
const get_cat_list = (params, unionId) => {
  let url = `${API_PATH}/users/${unionId}/cats/?current_page=${params.current_page}&page_size=${params.page_size}`
  return fetch(url, null, null, 'GET', true)
}
/**
 * 上传猫咪图片
 */

const upload_photos_url = (unionId) => {
  return `${API_PATH}/users/${unionId}/cats/images`
}
/**
 * 添加猫咪信息
 * @param params
 */
const add_cat_info = (params, unionId) => {
  let url = `${API_PATH}/users/${unionId}/cats/`
  return fetch(url, null, params, 'POST')
}

/**
 * 修改猫咪信息
 * @param params
 */
const update_cat_info = (params, id, unionId) => {
  let url = `${API_PATH}/users/${unionId}/cats/${id}/`
  return fetch(url, null, params, 'PUT')
}

/**
 * 获取猫咪详情
 * @param params
 */
const get_cat_details = (id, unionId) => {
  const url = `${API_PATH}/users/${unionId}/cats/${id}/`
  return fetch(url, null, null, 'GET');
}

/**
 * 获取提醒项目列表
 */
const get_projects_list = () => {
  const url = `${API_PATH}/projects/`
  return fetch(url, null, null, 'GET', true);
}
/**
 * 获取提醒项目初始化详情
 */
const get_init_projects_details = (schedulesId) => {
  const url = `${API_PATH}/projects/${schedulesId}/`
  return fetch(url, null, null, 'GET');
}
/**
 * 创建 POST 编辑 PUT 提醒事件
 */
const add_projects = (params, catId, unionId) => {
  const url = `${API_PATH}/users/${unionId}/cats/${catId}/schedules/`
  return fetch(url, null, params, 'POST');
}
/**
 * 编辑 PUT 提醒事件
 */
const update_projects = (params, catId, schedulesId, unionId) => {
  const url = `${API_PATH}/users/${unionId}/cats/${catId}/schedules/${schedulesId}/`
  return fetch(url, null, params, 'PUT');
}
/**
 * 编辑提醒项目详情
 */
const get_edit_projects_details = (catId, schedulesId, unionId) => {
  const url = `${API_PATH}/users/${unionId}/cats/${catId}/schedules/${schedulesId}/`
  return fetch(url, null, null, 'GET');
}
/**删除提醒事件 */
const delete_projects = (catId, schedulesId, unionId) => {
  const url = `${API_PATH}/users/${unionId}/cats/${catId}/schedules/${schedulesId}/`
  return fetch(url, null, null, 'DELETE');
}
/** * 
 * 获取提醒事件执行计划 
 * */
const get_remind_list = (parmas, unionId) => {
  let url = `${API_PATH}/users/${unionId}/cats/schedules/executions/?&current_page=${parmas.current_page}&page_size=${parmas.page_size}`
  return fetch(url, null, null, 'GET')
}

/**
 * 以往提醒列表
 * 以往提醒记录
 */

const get_remind_list_detail = (id, catId, unionId) => {
  const url = `${API_PATH}/users/${unionId}/cats/${catId}/schedules/${id}/events/`
  return fetch(url, null, null, 'GET');
}
/**
 * 提醒转记录详情
 */
const set_remind_to_record = (projectId, scheduleId,catId, unionId) => {
  const url = `${API_PATH}/users/${unionId}/cats/${catId}/schedules/${scheduleId}/events/${projectId}/desc/`
  return fetch(url, null, null, 'GET');
}
/**
 * 创建记录
 */
const add_record = (params, catId, unionId) => {
  const url = `${API_PATH}/users/${unionId}/cats/${catId}/records/`
  return fetch(url, null, params, 'POST');
}

/**
 * 更新记录
 */
const update_record = (unionId, catId, id, params) => {
  const url = `${API_PATH}/users/${unionId}/cats/${catId}/records/${id}/`
  return fetch(url, null, params, 'PUT');
}
/**
 * 获取记录列表
 */
const get_record_list = (params, unionId) => {
  let url = `${API_PATH}/users/${unionId}/cats/${params.catId}/records/?current_page=${params.current_page}&page_size=${params.page_size}`
  return fetch(url, null, null, 'GET')
}
/**
 * 获取记录详情
 */
const get_record_detail = (id, catId, unionId) => {
  const url = `${API_PATH}/users/${unionId}/cats/${catId}/records/${id}/`
  return fetch(url, null, null, 'GET');
}
/**
 * 删除记录
 */
const delete_record = (id, catId, unionId) => {
  const url = `${API_PATH}/users/${unionId}/cats/${catId}/records/${id}/`
  return fetch(url, null, null, 'DELETE');
}

/**
 * 是否展示关注公众号引导
 */
const is_follow_public = ( unionId) => {
  const url = `${API_PATH}/users/${unionId}/follow/`
  return fetch(url, null, null, 'GET',true);
}
/**
 * 存储微信小程序fromId
 */
const save_fromId = (params,unionId) => {
  const url = `${API_PATH}/users/${unionId}/form/`
  return fetch(url, null, params, 'POST',true);
}
// 2.0版本新增接口
/**获取猫咪列表及家人 */
const get_cat_familys = (unionId) => {
  const url = `${API_PATH}/users/${unionId}/families/`
  return fetch(url, null, null, 'GET');
  
}

/**开启关闭提醒接口
 * { "switch" : true //true: 接收 false: 拒收 } */

const open_or_close_remind = (unionId, catId, params) => {
  const url = `${API_PATH}/users/${unionId}/cats/${catId}/families/schedules/switch/`
  return fetch(url, null, params, 'PUT');
}


/**获取家人列表详情 */
const get_family = (unionId,catId)=>{
  const url = `${API_PATH}/users/${unionId}/cats/${catId}/families/detail/`
  return fetch(url, null, null, 'GET');
}
/**接受邀请 邀请家人
 * { "cat_id" : "" } */
const add_family = (unionId, params) => {
  const url = `${API_PATH}/users/${unionId}/invitation/accept/`
  return fetch(url, null, params, 'POST'); 
}
/**邀请页面 详情 */
const invite_detail = (params)=>{
  const url = `${API_PATH}/users/invitation/detail/`
  return fetch(url, null, params, 'POST'); 
}

/**移出家人
 * { "family_user_id" : "" } */
const delete_family = (unionId, catId, params) => {
  const url = `${API_PATH}/users/${unionId}/cats/${catId}/families/remove/`
  return fetch(url, null, params,'PUT')
}

/**退出家庭*/
const drop_out_family = (unionId,catId) => {
  const url = `${API_PATH}/users/${unionId}/cats/${catId}/families/exit/`
  return fetch(url, null, { unionId: unionId },'PUT')
}

/**删除猫咪 */

const delete_cat = (unionId,catId ) => {
  const url = `${API_PATH}/users/${unionId}/cats/${catId}/`
  return fetch(url, null, null, 'DELETE');
}
/**更新家庭成员权限 设置家人或者亲人
 * { "status" : 1 // 1.更新为家人 2.更新为亲人 3.删除}
*/
const set_family_role = (unionId, catId, memId, params) => {
  const url = `${API_PATH}/users/${unionId}/cats/${catId}/family/member/${memId}/role/`
  return fetch(url, null, params, 'PUT')
}
/**Select选择框猫咪列表 */
const select_cat = (userId)=>{
  const url = `${API_PATH}/users/${userId}/role/`
  return fetch(url, null, null, 'GET')
}
/**家庭成员列表中猫咪详情 */
const get_family_cat_info = (userId, catId) => {
  const url = `${API_PATH}/users/${userId}/cats/${catId}/detail/`
  return fetch(url, null, null, 'GET')
}
/**家庭成员列表分页 */
const get_family_list = (userId, catId, params) => {
  const url = `${API_PATH}/users/${userId}/cats/${catId}/families/?current_page=${params.current_page}&page_size=${params.page_size}`
  return fetch(url, null, null, 'GET')
}

module.exports = {
  get_unionId,
  get_cat_list,
  add_cat_info,
  update_cat_info,
  get_cat_details,
  get_projects_list,
  add_projects,
  update_projects,
  get_init_projects_details,
  get_edit_projects_details,
  delete_projects,
  get_remind_list,
  get_remind_list_detail,
  upload_photos_url,
  add_record,
  update_record,
  get_record_list,
  get_record_detail,
  delete_record,
  set_remind_to_record,
  is_follow_public,
  save_fromId,
  get_cat_familys,
  add_family,
  delete_family,
  drop_out_family,
  open_or_close_remind,
  get_family,
  invite_detail,
  delete_cat, 
  set_family_role,
  select_cat,
  get_family_cat_info,
  get_family_list







}