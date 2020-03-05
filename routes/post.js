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
    await ctx.render('posts',{list:result});
});

module.exports = router;