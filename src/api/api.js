import axios from 'axios'

let host = 'http://127.0.0.1:8084';

// 验证码
export const getVerifyCode = params => { return axios.post(`${host}/code/`, params) };

// 注册
export const registUser = params => { return axios.post(`${host}/register/`, params) };

// 登录
export const loginUser = params => { return axios.post(`${host}/login/`, params) };

// 获取小组
export const getCommunityGroups = params => { return axios.get(`${host}/groups/`, params) };

// 创建小组
export const createCommunityGroup = params => {
    return axios.post(`${host}/groups/`, params, { headers: { 'Content-Type': 'multipart/form-data' } })
};

// 获取项目列表
export const getProjectList = params => {return axios.get(`${host}/projects/`, params)};

// 创建项目
export const createProject = params => {return axios.post(`${host}/projects/`, params)};

// 删除项目
export const deleteProject = params => { return axios.delete(`${host}/projects/${params.project_id}/`)};

// 更改项目
export const updateProject = params => { return axios.patch(`${host}/projects/${params.project_id}/`, params)};

// 获取测试环境列表
export const getTestEnvironmentList = params => {return axios.get(`${host}/test_envs/`, params)};

// 删除环境
export const deleteTestEnvironment = params => { return axios.delete(`${host}/test_envs/${params.environment_id}/`)};

// 添加环境
export const createTestEnvironment = params => {return axios.post(`${host}/test_envs/`, params)};

//编辑环境
export const updateTestEnvironment = params => {return axios.patch(`${host}/test_envs/${params.environment_id}/`, params)};

// 获取数据库配置列表
export const getDbSettingList = params => {return axios.get(`${host}/db_settings/`, params)};

// 删除数据库配置
export const deleteDbSetting = params => { return axios.delete(`${host}/db_settings/${params.db_id}/`)};

// 添加数据库配置
export const createDbSetting = params => {return axios.post(`${host}/db_settings/`, params)};

// 编辑数据库配置
export const updateDbSetting = params => {return axios.patch(`${host}/db_settings/${params.db_id}/`, params)};

// 开启调试模式
export const functionDebug = params => {return axios.post(`${host}/debug/`, params)};

// 获取内置函数列表
export const getFunctionList = params => {return axios.get(`${host}/functions/`, params)};

// 删除内置函数
export const deleteFunction = params => { return axios.delete(`${host}/functions/${params.function_id}/`)};

// 添加内置函数
export const createFunction = params => {return axios.post(`${host}/functions/`, params)};

// 编辑内置函数
export const updateFunction = params => {return axios.patch(`${host}/functions/${params.function_id}/`, params)};

// 接口调试
export const apiDebug = params => {return axios.post(`${host}/interfaces_debug/`, params)};

// 添加接口
export const createApi = params => {return axios.post(`${host}/interfaces/`, params)};

// 获取接口列表
export const getApiList = params => {return axios.get(`${host}/interfaces/`, params)};

// 编辑接口
export const updateApi = params => {return axios.patch(`${host}/interfaces/${params.interface_id}/`, params)};

// 删除接口
export const deleteApi = params => { return axios.delete(`${host}/interfaces/${params.interface_id}/`)};
