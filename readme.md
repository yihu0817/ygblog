## 博客案例
### 2020.3.6
1. 页头显示- 根据登录状态显示发布文章或登录、注册
   - session应用

2. 文章详情
   - 根据文章ID查询文章详情和文章对应评论


3. 分页
   - 界面引入jquery分页插件
   ```html
   <link href="http://cdn.bootcss.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet">
   <!-- 分页显示位置 -->
   <div id="pagination2" class="pagination">  </div>
   <script src="../js/jquery.min.js"></script>
   <script src="../js/jqPaginator.js"></script>
   <script>
        let totalPages = <%=page.totalPages%>;
        let currentPage = <%=page.currentPage%>;

        $.jqPaginator('#pagination2', {
	        totalPages: totalPages, //总页数
	        visiblePages: 3,  //显示页数
	        currentPage: currentPage,  //当前页号
	        first: '<li class="first"><a href="javascript:void(0);">首页</a></li>',
	        prev: '<li class="prev"><a href="javascript:;">前一页</a></li>',
	        next: '<li class="next"><a href="javascript:void(0);">下一页</a></li>',
    		last: '<li class="last"><a href="javascript:void(0);">尾页</a></li>',
	        page: '<li class="page"><a href="javascript:;">{{page}}</a></li>',
	        onPageChange: function (num, type) {
                if(type == 'change') // 改变页号时执行
	                 window.location.href = '/post/list?pageno='+num;
	        }
	    });
   </script>
   ```
   - 服务端路由实现
   ```js
    router.get('/list', async ctx => {
         let pageNo = ctx.query.pageno || 1; //当前页号
         let pageSize = 5, //每页记录条数

         const sqlTotal = 'SELECT COUNT(*) AS count FROM posts';
         let resultTotal = await queryDB(sqlTotal);
         let total = resultTotal[0].count; //总记录条数
         let totalNumber =  Math.ceil(total/pageSize) //总页数 , 有小数,整数部份加一 
    
         //分页返回记录
         const sql = 'SELECT * FROM posts LIMIT ?,?';
         const startIndex = (pageNo-1) * pageSize; //起始序号
         const params = [startIndex,pageSize]
         const result = await queryDB(sql,params);

         const userInfo = ctx.session.userInfo; // 用户状态
         await ctx.render('posts',{list:result,userInfo:userInfo, page: {totalPages:totalNumber, currentPage:pageNo}});
    });
   ```