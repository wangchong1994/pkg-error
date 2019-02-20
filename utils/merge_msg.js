const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '../..');
const outputDir = path.join(__dirname, 'output');
const transDir = path.join(__dirname, 'translations/new_translations.json');
const now = new Date();

const outputObject = {};
let i = 0;

//readdirSync遍历获取后缀名为json的文件
function getFolders(dir) {
  const files = fs.readdirSync(dir);
  const ctx = {};
  files.forEach((file, index) => {
    if (/.json$/.test(file)) {
      // console.log('file===>', file);
      ctx[file] = readFile(path.join(dir, file));
      console.log(`ctx----${index}-->`,ctx[file])
    }
  });
  // console.log(`ctx------>`,ctx)
  return ctx;
}
//对文件处理，readFileSync 获取的text文件想json。stringfy一样的，而且格式还有要求。JSON.parse(text);
function readFile(dir) {
  // console.log("dir========》", dir);
  let textJSON = {};
  try {
    const text = fs.readFileSync(dir, 'utf8');
    console.log('text======>',text);
    textJSON = JSON.parse(text);
    console.log("textJSON=========textJSON", textJSON)
  } catch (err) {
    console.log('读文件失败');
  }

  return textJSON;
}

// fs.writeFile 写入文件
function writeFile(dir, ctx) {
  return new Promise(resolve => {
    try {
      ctx
      fs.writeFile(dir, JSON.stringify(ctx), 'utf8', (err) => {
        if (err) {
          console.log(err);
          console.log('操作失败');
          return;
        }
        resolve(true);
      });
    } catch (err) {
      console.log('写文件失败');
    }
  })
}

function clearFolder(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    fs.unlinkSync(path.join(dir, file));
  });
  writeFile(transDir, {});
}

const output = getFolders(outputDir);


const translations = readFile(transDir);

// 将新的translation加入到旧的文件中
Object.keys(output).map(key => {
  let ctx = output[key];
  console.log('translations', translations);
  Object.assign(ctx.RESPONSE_MSG, translations);

  Promise.all([
      writeFile(path.join(__dirname, 'archives', key.replace('.json', `_${now.getFullYear()}${('00'+((new Date()).getMonth()+1)).slice(-2)}${('00'+((new Date()).getDate())).slice(-2)}.json`)), ctx),
      writeFile(path.join(__dirname, 'output', key), ctx),
      writeFile(path.join(__dirname, '../i18n', key), ctx)
    ])
    .then(() => {
      console.log('操作成功');
      clearFolder(path.join(__dirname, 'translations'));
    })
    .catch(() => {
      console.log('操作失败');
    })
});