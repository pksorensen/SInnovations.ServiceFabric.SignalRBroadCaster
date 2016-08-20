define(["require", "exports", "signalr", "jQuery"], function (require, exports, SignalR, $) {
    "use strict";
    setTimeout(function () {
        console.log($);
        console.log(SignalR);
        console.log("A");
        var connection = $.hubConnection();
        connection.logging = true;
        var contosoChatHubProxy = connection.createHubProxy('myHubBroadcaster');
        contosoChatHubProxy.on('addContosoChatMessageToPage', function (userName, message) {
            console.log(userName + ' ' + message);
        });
        console.log(connection);
        var promise = connection.start();
        promise.done(function () {
            console.log('Now connected, connection ID=' + connection.id);
            setInterval(function () {
                contosoChatHubProxy.invoke('test').done(function (d) { return console.log(d); });
            }, 10000);
        });
        promise.fail(function () { console.log('Could not connect'); });
    }, 1000);
});
//# sourceMappingURL=app.js.map