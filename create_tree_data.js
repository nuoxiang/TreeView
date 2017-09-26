/**
 * Created by think on 17/7/15.
 */
var fs = require('fs')

var root_path = "/root/android/apk"
var url_path = "http://192.168.0.171:9080/apk/download"

//遍历文件夹，获取所有文件夹里面的文件信息
/* * @param path 路径 * */

function geFileList(path) {
    var filesList = [];
    var targetObj = {};
    readFile(path, filesList, targetObj);
    return filesList;
}

//替换文件路径为url路径
function replacePath(path) {
    return path.replace(root_path, url_path)
}

//遍历读取文件
function readFile(path, filesList, targetObj) {
    files = fs.readdirSync(path);//需要用到同步读取
    files.forEach(walk);

    function walk(file) {
        let paths = path + '/' + file;
        states = fs.statSync(paths);
        if (states.isDirectory()) {
            var item;
            if (targetObj["children"]) {
                item = {name: file, children: [], value: replacePath(paths)};
                targetObj["children"].push(item);
            }
            else {
                item = {name: file, children: [], value: replacePath(paths)};
                filesList.push(item);
            }

            readFile(paths, filesList, item);
        }
        else {
            //创建一个对象保存信息
            var obj = {};
            // obj.size = states.size;//文件大小，以字节为单位
            obj.name = file;//文件名
            obj.path = replacePath(paths); //文件绝对路径

            if (targetObj["children"]) {
                var item = {name: file, value: obj.path}
                targetObj["children"].push(item);
            }
            else {
                var item = {name: file, value: obj.path};
                filesList.push(item);
            }
        }
    }
}

//写入文件utf-8格式
function writeFile(fileName, data) {
    fs.writeFile(fileName, data, 'utf-8', complete);

    function complete() {
        console.log("文件生成成功");
    }
}

var filesList = geFileList(root_path);
var str = JSON.stringify(filesList);
str = "var data={name: 'root',children:#1}".replace("#1", str);
writeFile("tree.js", str);