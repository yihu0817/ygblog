const Koa = require('koa')
const path = require('path');
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
// const bodyparser = require('koa-bodyparser')
// koa-body中间件 可以接收post请求和multipart/form-data类型参数
const koaBody = require('koa-body'); 
const logger = require('koa-logger')
const Session = require('koa-session');
const index = require('./routes/index')
const users = require('./routes/users')
const post = require('./routes/post');
const comment = require('./routes/comment');

// error handler
onerror(app)

// middlewares
// app.use(bodyparser({
//   enableTypes:['json', 'form', 'text']
// }))

//配置koaBody
app.use(koaBody({
  multipart:true, // 支持文件上传 **********
  // encoding:'gzip', //压缩传输内容 
  formidable:{
    uploadDir:path.join(__dirname,'public/upload/'), // 设置文件上传目录
    keepExtensions: true,    // 保持文件的后缀
    maxFieldsSize:2 * 1024 * 1024, // 文件上传大小
    onFileBegin:(name,file) => { // 文件上传前的设置
      // console.log(`name: ${name}`);
      // console.log(file);
    },
  }
}));


//配置session的中间件
app.keys = ['secret-web-yuguo'];   /**cookie的签名 默认*/
const CONFIG = {
    key: 'koa:sess', /** 默认 */
    maxAge: 1000*60*60*24,  /**  cookie的过期时间 */
    overwrite: true, /** 默认 可以重写过期时间 */
    httpOnly: true, /**  true表示只有服务器端可以获取 cookie */
    signed: true, /** 默认 签名 */
    rolling: true, /** 在每次请求时强行设置 cookie，这将重置 cookie 过期时间（默认：false） */
    renew: false, /** 当用户进行浏览器操作时刷新 cookie 过期时间 */
};
app.use(Session(CONFIG, app));

app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'ejs'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())
app.use(post.routes(), post.allowedMethods());
app.use(comment.routes(), comment.allowedMethods());

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app