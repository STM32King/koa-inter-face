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
        const profileFields = {};
        // console.log(ctx.state.user._id);
        // 通过passport.js得到user._id,保存到profile表中
        profileFields.usersTabID = ctx.state.user._id;
        // 用户输入的company,保存到profile表中
        if (ctx.request.body.company) {
            profileFields.company = ctx.request.body.company;
        }
        // 用户输入的skills,保存到profile表中 数组
        if (typeof ctx.request.body.skills !== 'undefined') {
            profileFields.skills = ctx.request.body.skills.split(',');
          }
        console.log(profileFields);
        // 保存到数据库中
        const profileSave = new Profile(profileFields);
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


/**
 * @route DELETE api/profile/del
 * @desc  删除个人信息接口地址
 * @access 接口是共有的
 */
router.delete(
    '/del',
    passport.authenticate('jwt', { // 在app.js中,有跳转到config/passport.js中,鉴权解析
        session: false
    }),
    async ctx => {
        console.log(ctx.state); // 通过token能够,在通过passport.js得到用户登录信息表,打印,user.id等
        const usersTabID = ctx.state.user._id;
        await Profile.findOneAndRemove({usersTabID:usersTabID},(err, docs)=>{
          if (err) {
              return err;
          }  
          console.log(docs);
          ctx.body = docs;

        })
    }
);


module.exports = router.routes();