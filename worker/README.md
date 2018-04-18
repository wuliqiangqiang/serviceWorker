
## 基本原理

基本原理就是在当前的主线程中加载一个只读文件来创建一个新的线程，两个线程同时存在，且互不阻塞，并且在子线程与主线程之间提供了数据交换的接口postMessage和onmessage。来进行发送数据和接收数据。其数据格式可以为结构化数据（JSON等）

- worker子线程，不会影响主线程，不会阻塞主线程
- worker子线程，不能操作DOM

### 传递传参 && 接受消息
----

index.html
```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>webWorker</title>
</head>

<body>
    <script>
        var worker = new Worker("worker.js");
        worker.postMessage("给worker.js本身传递了，这句话");
        worker.onmessage = function(e) {
            console.log('worker返回的', e.data)
        };
    </script>
</body>

</html>
```

public/worker.js
```js
onmessage = function(e) {
    // console.log(e);
    console.log('worker接收到的内容是：', e.data);
    postMessage('worker接受到了，且返回了这句话');
}
```

> window.postMessage(msg,targetOrigin) 发送
- msg : 一切javascript参数
- targetOrigin : 这个参数称作“目标域”，注意啦，是目标域不是本域！比如，你想在2.com的网页上往1.com网页上传消息，那么这个参数就是“http://1.com/”，而不是2.com.


> window.onmessage((e)=>{e.data}) 接受
- e.data 接受到的内容

### 异常处理
-----
```js
worker.onerror = function(e){
    console.log("error at " + e.filename + ":" + e.lineno + e.message)
}
// event.filename: 导致错误的 Worker 脚本的名称；
// event.message: 错误的信息；
// event.lineno: 出现错误的行号
```


### 载入工具类函数
-----
```js
importScripts('import-test.js');
```

### 结束worker进程
-----
如果不结束，那么这个子线程就会一直占用浏览器内存空间
```js
worker.terminate(); //在外部终结该worker
self.close();       //在worker内部自动终结.(官方推荐,防止外部意外关闭正在运行的worker)
```

### shared worker
-----
在一个worker里面可以再spawn出其他的worker. 使用方法和在main.js中一样除了大家所熟知的web worker, 或者更确切的来说–Dedicated workers. 总的来说web worker分为两种:

- Dedicated worker (DW): 即使用 new Worker()来创建的. 该worker一般只能和creator进行通信. 即, 在创建worker的js script中才能使用.
- Shared Wrokers (SW): 使用new SharedWorker() 进行创建. 他能在不同的js script中使用.

```js
// main.js

var myWorker = new SharedWorker("worker.js");

myWorker.port.start();

myWorker.port.postMessage("hello, I'm main");

myWorker.port.onmessage = function(e) {
  console.log('Message received from worker');
}
```


不过, SW的兼容性比较差, 能真正在实践场景使用的地方还是少的. 所以,这里也只是当做了解. SW 和 DW 一样, 也有一些features:

- 映入外部文件: importScripts()
- 错误监听: error事件监听
- 关闭通信: port.close()
- ajax交互: 有权访问xmlHttpRequest对象
- 能访问navigator object
- 访问 location object
- setTimeout等时间函数

### inline worker
-----
有时候在写 worker 的时候，会限制于需要额外创建一个文件不好打包。这时候，可以直接使用 inline worker 的这个特性。简单来说，就是通过 URL 对象，来讲 worker 和实际代码联系在一起。

```js
var blob = new Blob([ "onmessage = function(e) { postMessage('msg from worker'); }"]);

// 建立联系
var blobURL = window.URL.createObjectURL(blob);

// 创建内联 worker
var worker = new Worker(blobURL);
worker.onmessage = function(e) {
  // e.data == 'msg from worker'
};
worker.postMessage(); 
```
通过 Blob，将文本转化为二进制，利用 URL 对象生成一个本地链接，这样就可以通过 




###  XMLHttpRequest
----
```js
onmessage = function(evt){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "serviceUrl"); //serviceUrl为后端j返回son数据的接口
    xhr.onload = function(){
    postMessage(xhr.responseText);
    };
    xhr.send();
}
```
jsonp
```js
// 设置jsonp
function MakeServerRequest() 
{
    importScripts("http://SomeServer.com?jsonp=HandleRequest");
} 

// jsonp回调
function HandleRequest(objJSON) 
{
    postMessage("Data returned from the server...FirstName: " 
                  + objJSON.FirstName + " LastName: " + objJSON.LastName);
} 

// Trigger the server request for the JSONP data 
MakeServerRequest();
```


### 部分典型的应用场景如下
----

1） 使用专用线程进行数学运算
Web Worker最简单的应用就是用来做后台计算，而这种计算并不会中断前台用户的操作
2） 图像处理
通过使用从<canvas>或者<video>元素中获取的数据，可以把图像分割成几个不同的区域并且把它们推送给并行的不同Workers来做计算
3） 大量数据的检索
当需要在调用 ajax后处理大量的数据，如果处理这些数据所需的时间长短非常重要，可以在Web Worker中来做这些，避免冻结UI线程。
4） 背景数据分析
由于在使用Web Worker的时候，我们有更多潜在的CPU可用时间，我们现在可以考虑一下JavaScript中的新应用场景。例如，我们可以想像在不影响UI体验的情况下实时处理用户输入。利用这样一种可能，我们可以想像一个像Word（Office Web Apps 套装）一样的应用：当用户打字时后台在词典中进行查找，帮助用户自动纠错等等。

### 限制
----

1、不能访问DOM和BOM对象的，Location和navigator的只读访问，并且navigator封装成了WorkerNavigator对象，更改部分属性。无法读取本地文件系统
2、子线程和父级线程的通讯是通过值拷贝，子线程对通信内容的修改，不会影响到主线程。在通讯过程中值过大也会影响到性能（解决这个问题可以用transferable objects）
3、并非真的多线程，多线程是因为浏览器的功能
4、兼容性
5 因为线程是通过importScripts引入外部的js，并且直接执行，其实是不安全的，很容易被外部注入一些恶意代码
6、条数限制，大多浏览器能创建webworker线程的条数是有限制的，虽然可以手动去拓展，但是如果不设置的话，基本上都在20条以内，每条线程大概5M左右，需要手动关掉一些不用的线程才能够创建新的线程（相关解决方案）
7、js存在真的线程的东西，比如SharedArrayBuffer