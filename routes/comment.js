const rounter = require('koa-router')();
const moment = require('moment');
const queryDB = require('../config/promiseDb');

rounter.prefix('/comment');

/**
 * 发表评论
 * /comment/create
 */
rounter.post('/create', async ctx => {
    const sql = 'INSERT INTO comment (name,content,moment,postid,avator) VALUES (?,?,?,?,?)';
    const name = ctx.session.userInfo.name;
    const avator = ctx.session.userInfo.avator;
    const time = moment().format('YYYY-MM-DD HH:mm:ss');
    const content = ctx.request.body.comment;
    const postId = ctx.request.body.postId;

    const params = [name,content,time,postId,avator];

    await queryDB(sql,params);
    ctx.body = {code:1,msg:'发表评论成功!'}
});

/**
 * 根据文章查询评论
 */
rounter.get('/list', async ctx => {
    const id = ctx.query.id; //文章id
    console.log(`id = ${id}`);
    const sqlComment = 'SELECT * FROM comment WHERE postid = ?'
    const params = [id];
    const commentResult = await queryDB(sqlComment,params); 
    console.log(commentResult);
    ctx.body = {code:1,comments: commentResult};

});

module.exports = rounter;