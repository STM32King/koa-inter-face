const Koa = require('koa');
const json = require('koa-json');
const KoaRouter = require('koa-router');
const bodyParser = require('koa-bodyparser');
const mongoose = require('mongoose');
const passport = require('koa-passport')

const app = new Koa();
const router = new KoaRouter();
app.use(bodyParser());
app.use(json());

// app.use(async ctx => {
//   ctx.body = {msg: "Hello Koa"};
// });

// 引入数据库参数
const dbMongoURI = require('./config/keys').mongoURI;

// 连接数据库
mongoose.connect(dbMongoURI, {
        useNewUrlParser: true
    })
    .then(() => {
        console.log("MongoDB Connectd is SUCCEED !!!");
    }).catch((error) => {
        console.log(error);
    })

// 引入routes/api/users.js
const users = require('./routes/api/users');

//localhost:3000/about   得到 get about
router.get('/about', (ctx, next) => {
    // ctx.router available
    ctx.body = 'get about';

});

router.get('/bp', funBodyParser);
async function funBodyParser(ctx) {
    ctx.body = 'get bp';
    const body = ctx.request.query.id;
    // console.log(ctx.request);

    console.log(body);
}

// passport 使用必须加上的初始化代码
app.use(passport.initialize())
app.use(passport.session())
// 回调到config文件中 passport.js
require('./config/passport')(passport);

// 配置路由地址 localhost:3000/api/users  找routes/api/users.js文件
router.use('/api/users', users);

app.use(router.routes()).use(router.allowedMethods());

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`SerVer Start On ${port}`);
});