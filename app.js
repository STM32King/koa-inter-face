const Koa = require('koa');
const json = require('koa-json');
const KoaRouter = require('koa-router');
const bodyParser = require('koa-bodyparser');
const mongoose = require('mongoose');
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

// 配置路由地址 localhost:3000/api/users  找routes/api/users.js文件
router.use('/api/users', users);

app.use(router.routes()).use(router.allowedMethods());

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`SerVer Start On ${port}`);
});