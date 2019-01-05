const KoaRouter = require('koa-router');
const router = new KoaRouter();
const passport = require('koa-passport')
// 引入Profile
const Profile = require("../../models/Profile");

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
        msg: "GET /api/profile/test"
    };
});


/**
 * @route GET api/profile
 * @desc  个人自然信息接口地址 返回个人自然信息
 * @access 接口是私密的
 */
router.get(
    '/',
    passport.authenticate('jwt', { // 在app.js中,有跳转到config/passport.js中,鉴权解析
        session: false
    }),
    async ctx => {
        console.log(ctx.state);
        // const pri
    }
);


/**
 * @route POST api/profile
 * @desc  添加和编辑个人信息接口地址
 * @access 接口是私有的
 */
router.post(
    '/',
    passport.authenticate('jwt', { // 在app.js中,有跳转到config/passport.js中,鉴权解析
        session: false
    }),
    async ctx => {
        console.log(ctx.state); // 通过token能够,在通过passport.js得到用户登录信息表,打印,user.id等
        const profileFiedls = {};
        // console.log(ctx.state.user._id);
        
        profileFiedls.user = ctx.state.user._id;
        profileFiedls.company = ctx.request.body.company;
        console.log(profileFiedls);
        // 保存到数据库中
        const profileSave = new Profile(profileFiedls);
        await profileSave
            .save()
            .then(profileInDB => {
                ctx.body = profileInDB;
            })
            .catch(err => {
                console.log(err);
            });
    }
);


module.exports = router.routes();