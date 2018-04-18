//self来获取worker自带的方法.
importScripts('./import-test.js', 'ajax-util.js');
self.onmessage = function(e) {
    // console.log(e);
    console.log('worker接收到的内容是：', e.data);
    self.postMessage('worker接受到了，且返回了这句话');
    self.close(); //关闭
}
test();

// saw.json("ajax.json")
//     .success(function(data) {
//         postMessage(data);
//     })
//     .failure(function(data) {
//         postMessage(data);
//     })
//     .send();


// saw.jsonp("http://api.flickr.com/services/feeds/photos_public.gne?tags=cat&tagmode=any&format=json&jsoncallback=sawp")
//     .success(function(data) {
//         postMessage(data);
//     })
//     .failure(function(data) {
//         postMessage(data);
//     })
//     .send();