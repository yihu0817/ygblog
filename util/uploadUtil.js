const Multer = require('koa-multer'); //引入文件上传中间件
//配置上传文件
var uploadFolder = './public/upload/';
const storage = Multer.diskStorage({
    //文件存储目录
    destination: function(request, file, cb){
        cb(null, uploadFolder);
    },
    //文件名
    filename: function(request, file, cb){
        cb(null, file.fieldname+'-'+ Date.now()+'.jpg' );
    }
});
//实例化文件上传对象
const uploadObj = Multer({ storage});

module.exports = uploadObj;