
import * as SignalR from "signalr";
import * as $ from "jQuery";


setTimeout(() => {
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
        setInterval(() => {
            contosoChatHubProxy.invoke('test').done((d) => console.log(d));
        }, 10000);
    })
    promise.fail(function () { console.log('Could not connect'); });

}, 1000);