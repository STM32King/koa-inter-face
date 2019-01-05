const KoaRouter = require('koa-router');
const router = new KoaRouter();
const tools = require('../../config/tools');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // 引入token
const keys = require('../../config/keys');
const passport = require('koa-passport')

// 引入User
const User = require("../../models/User");

// 引入input验证
const validateRegisterInput = require('../../validation/register'); // 注册验证
const validateLoginInput = require('../../validation/login'); // 登录验证

/**
 *@route     GET api/users/test
 *@desc      测试接口地址
 *@access    接口是公开的
 */
// localhost:3000/api/users/test  得到 msg: "get test"
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

    const {
        errors,
        isValid
    } = validateRegisterInput(ctx.request.body);
    // 判断是否验证通过
    if (!isValid) {
        ctx.status = 400;
        ctx.body = errors;
        return;
    }

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
            password: tools.enbcrypt(ctx.request.body.password) // 密码加密
        });

        console.log("const newUser = ", newUser);
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
        // ctx.body = newUser;
    }
});


/**
 * @route POST api/users/login
 * @desc  登录接口地址 返回token
 * @access 接口是公开的
 */
router.post('/login', async ctx => {
    // 验证
    const { errors, isValid } = validateLoginInput(ctx.request.body);
    // 判断是否验证通过
    if (!isValid) {
      ctx.status = 400;
      ctx.body = errors;
      return;
    }

    // 查询,通过邮箱查询数据库
    const findResult = await User.find({
        email: ctx.request.body.email
    });
    // ctx.body = findResult;
    const user = findResult[0]; //返回的结果是一个数组
    const password = ctx.request.body.password;

    // 判断查没查到
    if (findResult.length == 0) {
        ctx.status = 404;
        ctx.body = {
            email: '用户不存在!'
        };
    } else {
        // 查到后 验证密码
        var result = await bcrypt.compareSync(password, user.password);
        if (result) { // 密码验证通过
            // 返回token
            const payload = {
                id: user.id,
                name: user.name
            };
            //payload表示传给passport的值
            //secret是key
            // 3600秒 过期
            const token = jwt.sign(payload, keys.secretOrKey, {
                expiresIn: 3600
            });
            ctx.status = 200;
            ctx.body = {
                success: "true"
            };
            ctx.body = {
                success: true,
                token: 'Bearer ' + token
            };
        } else { // 密码验证 ! 没有通过
            ctx.status = 400;
            ctx.body = {
                password: '密码错误!'
            };
        }
    }
});


/**
 * @route GET api/users/current
 * @desc  用户信息接口地址 返回用户信息
 * @access 接口是私密的
 */
router.get(
    '/current',
    passport.authenticate('jwt', { // 在app.js中,有跳转到config/passport.js中,鉴权解析
        session: false
    }),
    async ctx => {
        ctx.body = {
            id: ctx.state.user.id,
            name: ctx.state.user.name,
            email: ctx.state.user.email,
            // avatar: ctx.state.user.avatar
        };
    }
);


module.exports = router.routes();