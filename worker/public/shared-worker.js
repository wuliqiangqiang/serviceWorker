// self.onconnect = function(e) {
//     console.log(e);
//     var post = e.posts[0];
//     port.onmessage = function(e) {
//         var workerResult = 'Result' + e.data[0];
//         port.postMessage('测试收到');
//     }
//     port.start();
// }

// worker.js
self.onconnect = function(e) {
    var port = e.ports[0];
    port.addEventListener('message', function(e) {
        console.log(e);
        var workerResult = 'Result: ' + (e.data);
        port.postMessage(workerResult);
    });
    port.start();
}