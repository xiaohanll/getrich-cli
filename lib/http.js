// 通过 axios 处理请求
const axios = require('axios');

// 请求拦截器（在请求之前进行一些配置）
// axios.interceptors.request.use(function(config){
// 	//比如是否需要设置 token
// 	config.headers.token='getrich'
// 	return config
// })

// 响应了拦截器（在响应之后对数据进行一些处理）
axios.interceptors.response.use(res => {
  return res.data;
})

/**
 * 获取模板列表
 * @returns Promise
 */
async function getRepoList() {
  return axios.get('https://api.github.com/orgs/zhurong-cli/repos')
}
/**
 * 获取版本信息
 * @param {string} repo 模板名称
 * @returns Promise
 */
async function  getTagList(repo) {
  return axios.get(`https://api.github.com/repos/zhurong-cli/${repo}/tags`)
}

module.exports = {
  getRepoList,
  getTagList
}



