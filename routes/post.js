const router = require('koa-router')();
const queryDB = require('../config/promiseDb');
const moment = require('moment');
router.prefix('/post'); //前缀
/**
 * 所有文章列表
 * /post/list
 */
// router.get('/list', async ctx => {
//     const sql = 'SELECT * FROM posts LIMIT 0,5';
//     const result = await queryDB(sql);
//     const userInfo = ctx.session.userInfo;
//     await ctx.render('posts',{list:result,userInfo:userInfo});
// });

/**
 * 所有文章分页实现
 */
router.get('/list', async ctx => {
    let pageNo = ctx.query.pageno || 1,
        pageSize = 5, //每页记录条数
        totalNumber = 0; //总页数

    const sqlTotal = 'SELECT COUNT(*) AS count FROM posts';
    let resultTotal = await queryDB(sqlTotal);
    let total = resultTotal[0].count; //总记录条数
    totalNumber =  Math.ceil(total/pageSize) //有小数,整数部份加一 
    console.log('totalNumber',totalNumber);

    const sql = 'SELECT * FROM posts LIMIT ?,?';
    const startIndex = (pageNo-1) * pageSize; //起始序号
    const params = [startIndex,pageSize]
    const result = await queryDB(sql,params);

    const userInfo = ctx.session.userInfo;
    await ctx.render('posts',{list:result,userInfo:userInfo, page: {totalPages:totalNumber, currentPage:pageNo}});
});


/**
 * 文章详情
 * /post/detail/1
 */
router.get('/detail/:id', async ctx => {
    const id = ctx.params.id; //文章id
    const sql = 'SELECT * FROM posts WHERE id = ?';
    const params = [id];
    const result = await queryDB(sql,params);
    //查询评论
    const sqlComment = 'SELECT * FROM comment WHERE postid = ?'
    const commentResult = await queryDB(sqlComment,params); 
    let resultJson = {post:result,comment: commentResult,userInfo: ctx.session.userInfo};

    await ctx.render('detail',resultJson);
});

/**
 * 文章发布
 * /post/create
 */
router.get('/create', async ctx => {
    await ctx.render('create', {userInfo: ctx.session.userInfo});
});

/**
 * 文章提交
 * /post/create   
 */
router.post('/create', async ctx => {
    // ctx.body = {code: 1, body:ctx.request.body};
    const sql = 'INSERT INTO posts (name,title,content,md,uid,moment,comments,pv,avator) VALUES (?,?,?,?,?,?,?,?,?)';
    console.log(sql);
    const time = moment().format('YYYY-MM-DD HH:mm:ss');
    const name = ctx.session.userInfo.name;
    const avator = ctx.session.userInfo.avator;
    const id = ctx.session.userInfo.id;
    const title = ctx.request.body.title;
    const content = ctx.request.body.content;
    const params = [name,title,content,content,id,time,0,0,avator];
    console.log(params);

    await queryDB(sql,params);
     
    //ajax请求返回json数据
    ctx.body = {code:1, msg:'成功'}
});

module.exports = router;