//self来获取worker自带的方法.
importScripts('./import-test.js');
self.onmessage = function(e) {
    // console.log(e);
    console.log('worker接收到的内容是：', e.data);
    self.postMessage('worker接受到了，且返回了这句话');
    self.close(); //关闭
}
test();