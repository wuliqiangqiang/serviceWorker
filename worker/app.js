const Koa = require('koa');
const router = require('koa-router')();
const app = new Koa();
const views = require('koa-views');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');


//路由
// const index = require('./routes/index');
// error handler
onerror(app);

// middlewares
app.use(bodyparser({
    enableTypes: ['json', 'form', 'text']
}));
app.use(json());
app.use(logger());
app.use(require('koa-static')(__dirname + '/public'));

app.use(views(__dirname, {}));


// routes
// app.use(index.routes(), index.allowedMethods());
router.get('/', async(ctx, next) => {
    await ctx.render('index');
    next();
});
// error-handling
app.on('error', (err, ctx) => {
    console.error('server error', err, ctx)
});

app.use(router.routes()).use(router.allowedMethods());

app.listen('3030', () => {
    console.log('begin~');
});

module.exports = app