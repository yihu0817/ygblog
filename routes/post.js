const router = require('koa-router')();
const queryDB = require('../config/promiseDb');

router.prefix('/post'); //前缀
/**
 * 所有文章列表
 * /post/list
 */
router.get('/list', async ctx => {
    const sql = 'SELECT * FROM posts';
    const result = await queryDB(sql);
    const userInfo = ctx.session.userInfo;
    await ctx.render('posts',{list:result,userInfo:userInfo});
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

module.exports = router;