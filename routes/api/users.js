const KoaRouter = require('koa-router');
const router = new KoaRouter();
const tools = require('../../config/tools');
const bcrypt = require('bcryptjs');

// 引入User
const User = require("../../models/User");

/**
 *@route     GET api/users/test
 *@desc      测试接口地址
 *@access    接口是公开的
 */
router.get('/test', (ctx, next) => {
    // ctx.router available
    ctx.status = 200;
    ctx.body = {
        msg: "get test"
    };
});

/**
 *@route     GET api/users/rigister
 *@desc      注册接口地址
 *@access    接口是公开的
 */
router.post('/register', async (ctx) => {
    // const body = ctx.request.body;   
    // console.log(body);
    const findResult = await User.find({
        email: ctx.request.body.email
    });
    // console.log(findResult);

    if (findResult.length > 0) { // 找到了,在数据库中
        ctx.status = 500;
        ctx.body = {
            email: "email 已经被注册"
        }
    } else { // !没有找到了,在数据库中 
        const newUser = new User({
            name: ctx.request.body.name,
            email: ctx.request.body.email,
            password: tools.enbcrypt(ctx.request.body.password)
        });

        console.log(newUser);
        // 存储到数据库
        await newUser
            .save()
            .then(user => {
                ctx.body = user;
            })
            .catch(err => {
                console.log(err);
            });

        // 返回json数据
        ctx.body = newUser;
    }
});



module.exports = router.routes();