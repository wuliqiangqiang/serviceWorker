window.onmessage = function(e) {
    // console.log(e);
    console.log('worker接收到的内容是：', e.data);
    window.postMessage('worker接受到了，且返回了这句话');
}