/*eslint-disable*/
const fs = require('fs')
const path = require('path')
const { promisify } = require('util')
const exec = require('child_process').exec

const target = './sdk'

const readFileAsync = promisify(fs.readFile)
const readdirAsync = promisify(fs.readdir)
const execAsync = promisify(exec)

const check = async function (targetPath) { // 检验sdk/tim-js.js是否更新到最新版本
  try {
    let files = await readdirAsync(targetPath)
    files.forEach(async (filename) => {
      let filedir = path.join(targetPath, filename)
      if (filename === 'sdk') {
        check(filedir)
      }
      if (filename === 'tweblive.js') {
        let subFiles = await readFileAsync(filedir, { encoding: 'utf-8' })
        let execResult = await execAsync('npm show tweblive version')
        if (execResult.error) {
          console.log(execResult.error.stack);
          console.log('Error code: ' + execResult.error.code)
        }
        console.log('The latest version of [tweblive] is ' + execResult.stdout)
        if (subFiles.match(execResult.stdout.replace(/\n/g, ''))) { // 去掉换行符
          console.log('\033[32m successfully: [sdk/tweblive.js] is the latest! \033[0m')
        } else {
          console.log('\033[33m WARNING: Please update [sdk/tweblive.js] to the latest version! \033[0m')
        }
      }
    })
  } catch (e) {
    console.log(e)
  }
}
check(target)
