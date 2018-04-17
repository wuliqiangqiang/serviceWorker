importScripts('./import-test.js');
onmessage = function(e) {
    // console.log(e);
    console.log('worker接收到的内容是：', e.data);
    postMessage('worker接受到了，且返回了这句话');
}
test();