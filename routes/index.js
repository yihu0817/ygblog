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
    ctx.redirect('/login');
});

/**
 * 登录
 */
router.get('/login', async ctx => {
  await ctx.render('login', {});
});

/**
 * 登录提交
 */
router.post('/login', async ctx => {
    let username = ctx.request.body.username,
        password = ctx.request.body.password;

    //{ "{\"username\":\"test1\",\"password\":\"123\"}":""}
    console.log('===========  username: '+username + " password : "+password + "  ctx.request.body  :"+ JSON.stringify(ctx.request.body));
    const sql = 'SELECT count(*) FROM users WHERE name=? AND pass = ?';
    const params = [username,password];
    const count = await queryDB(sql,params);
    if(count >=1) {
       ctx.body = {code:1,msg:'登录成功!'};
    }else {
      ctx.body = {code:-1, msg:'用户名不存在!'};
    }

});


module.exports = router
