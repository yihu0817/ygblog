const router = require('koa-router')()
const moment = require('moment');
const queryDB = require('../config/promiseDb');

router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: '雨果博客'
  })
})

/**
 * 注册
 */
router.get('/register' ,async ctx => {
    await ctx.render('register',{});
});

/**
 * 注册提交
 */
router.post('/register', async ctx => {
   let body = ctx.request.body,
       name = body.name,
       password = body.password,
       repeatpass = body.repeatpass;
    let picpath = ctx.request.files.avator.path;
    let index = picpath.lastIndexOf('\\');
    let strpath = picpath.substring(index+1);

    //插入数据库
    let time = moment().format('YYYY-MM-DD HH:mm:ss');
    console.log('time ',time);
    const sql = 'INSERT INTO users (name,pass,avator,moment) VALUES (?,?,?,?)';
    const params = [name,password,strpath,time];
    await queryDB(sql,params);
    ctx.body = '注册成功';
});

module.exports = router
