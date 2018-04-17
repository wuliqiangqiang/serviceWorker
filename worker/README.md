
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
    console.log("error at "+e.filename ":" + e.lineno + e.message)
}
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
worker.terminate();
```
