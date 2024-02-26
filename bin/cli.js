#! /usr/bin/env node

console.log("cli is working!")

const chalk = require('chalk');
const figlet = require('figlet');
const { Command } = require('commander')
const program = new Command();

// 配置create命令
program
  .command('create <app-name>')
  .description('create a new project')
  .option('-f, --force', 'overwrite target directory if it exist')
  .action((name, option) => {
    require('../lib/create')(name, option)
  })

// 配置config命令
program
  .command('config [value]')
  .description('inspect and modify the config')
  .option('-g, --get <path>', 'get value from config')
  .option('-s, --set <path> <value>', 'set value to config')
  .option('-d, --delete <path>', 'delete option from config')
  .action((value, options) => {
    console.log(value, options)
  })

// 配置ui命令(预览)
program
  .command('ui')
  .description('start add open roc-cli ui')
  .option('-p, --port <port>', 'Port used for the UI Server')
  .action(options => {
    console.log(options)
  })

program
  // 配置版本号信息
  .version(`v${require('../package.json').version}`)
  .usage('<command> [option]')

program
  .on('--help', () => {
    
    console.log(figlet.textSync("GET RICH", {
      // font: "Ghost",
      horizontalLayout: "default",
      verticalLayout: "default",
      width: 80,
      whitespaceBreak: true,
    }))

    console.log(`\r\nRun ${chalk.cyan(`getrich <command> --help`)} for detailed usage of given command\r\n`)
  })



// 解析用户执行命令传入参数
program.parse(process.argv);