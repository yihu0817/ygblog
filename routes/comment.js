const rounter = require('koa-router')();
const moment = require('moment');
const queryDB = require('../config/promiseDb');

rounter.prefix('/comment');

/**
 * 发表评论
 * /comment/create
 */
rounter.post('/create', async ctx => {
    const sql = 'INSERT INTO comment (content,moment,postid,uid) VALUES (?,?,?,?)';
    const time = moment().format('YYYY-MM-DD HH:mm:ss');
    const content = ctx.request.body.comment;
    const postId = ctx.request.body.postId;
    const uid = ctx.session.userInfo.id
    const params = [content,time,postId,uid];
    await queryDB(sql,params);
    ctx.body = {code:1,msg:'发表评论成功!'}
});

/**
 * 根据文章查询评论
 */
rounter.get('/list', async ctx => {
    const id = ctx.query.id; //文章id
    //const sqlComment = 'SELECT id,name,content,moment,postid,avator FROM comment WHERE postid = ?'
    const sqlComment = 'SELECT comment.id,comment.content,comment.moment,users.avator,users.name FROM comment,users WHERE users.id = comment.uid AND postid = ?'
    const params = [id];
    const commentResult = await queryDB(sqlComment,params); 
    console.log(commentResult);
    ctx.body = {code:1,comments: commentResult};

});

module.exports = rounter;