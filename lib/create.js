const path = require('path')
const fs = require('fs-extra')
const inquirer = require('inquirer');

const Generator = require('./generator');

module.exports = async function(name, options){
  console.log('>>> create.js', name, options)

  // 当前命令行选择的目录
  const cwd  = process.cwd();
  // 需要创建的目录地址
  const targetAir  = path.join(cwd, name);
  console.log(cwd)
  console.log(targetAir)
  console.log(fs.existsSync(targetAir))
  // 目录是否已经存在
  if(fs.existsSync(targetAir)){
    // 是否为强制创建
    if (options.force){
      // 移除原文件，覆盖
      await fs.removeSync(targetAir);
    } else {
      // 询问是否要覆盖
      let { action } = await inquirer.prompt([
        {
          name: 'action',
          type: 'list',
          message: 'Target directory already exists Pick an action:',
          choices: [
            {
              name: 'overwrite',
              value: 'overwrite'
            },
            {
              name: 'cancel',
              value: false
            }
          ]
        }
      ])
      console.log(action)
      if (!action) {
        return
      } else if (action == 'overwrite') {
        console.log(`\r\nRemoving...`)
        await fs.remove(targetAir)
      }
    }
  }

  // 创建项目
  const generator = new Generator(name, targetAir);

  // 开始创建项目
  generator.create();
}