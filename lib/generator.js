const ora = require('ora');
const inquirer = require('inquirer')
const { getRepoList, getTagList } = require('./http');

const util = require('util')
const downloadGitRepo = require('download-git-repo')

const path = require('path')
const chalk = require('chalk');

// 添加加载动画
async function wrapLoading (fn, message, ...args) {
  // 使用ora初始化，传入message
  const spinner = ora(message);
  // 开始加载动画
  spinner.start();

  try {
    const res = await fn(...args);
    // 状态改为成功
    spinner.succeed();
    return res;
  } catch (err) {
    // 状态改为失败
    spinner.fail('Request failed, refetch ...');
  }
}

class Generator {
  constructor (name, targetDir){
    // 目录名称
    this.name = name;
    // 创建位置
    this.targetDir = targetDir;
    // 对 download-git-repo 进行 promise 化改造
    this.downloadGitRepo = util.promisify(downloadGitRepo);
  }

  // 获取用户选择的模板
  // 1.从远程拉取模板数据 2.用户选择自己新下载的模板名称 3.返回用户选择的名称
  async getRepo () {
    // 1.从远程拉取模板数
    const repolist = await wrapLoading(getRepoList, 'waiting fetch template');
    if (!repolist) return;

    // 过滤-获取模板名称
    const repos = repolist.map(item => item.name);

    // 用户选择自己新下载的模板名称
    const { repo } = await inquirer.prompt([
      {
        type: 'list',
        name: 'repo',
        choices: repos,
        message: 'Please choose a template to create project'
      }
    ]);

    return repo
  }

  // 获取用户选择的版本
  async getTag (repo) {
    // 基于当前选择的模板，获取版本列表

    const tags = await wrapLoading(getTagList, 'waiting fetch tag', repo);
    if (!tags) return;
    
    const tagsList = tags.map(item => item.name);
    // 选择模板repo的版本
    const { tag } = await inquirer.prompt([
      {
        name: 'tag',
        type: 'list',
        choices: tagsList,
        message: 'Please choose a tag to create project'
      }
    ]);
    return tag;
  }

  // 下载远程模板
  async downLoad (repo, tag) {
    // 拼接下载地址
    const requestUrl = `zhurong-cli/${repo}${tag?'#'+tag:''}`;

    // 下载
    await wrapLoading(
      this.downloadGitRepo, // 远程下载方法
      'waiting download template', // 加载提示信息
      requestUrl, // 参数：下载地址
      path.resolve(process.cwd(), this.targetDir)// 参数2: 创建位置
    )
  }

  // 核心创建逻辑
  async create(){
    const repo = await this.getRepo();
    const tag = await this.getTag(repo);
    console.log('用户选择了：', repo, tag);

     // 3）下载模板到模板目录
     await this.downLoad(repo, tag)

       // 4）模板使用提示
    console.log(`\r\nSuccessfully created project ${chalk.cyan(this.name)}`)
    console.log(`\r\n  cd ${chalk.cyan(this.name)}`)
    console.log('  npm run dev\r\n')
  }
}

module.exports = Generator;
