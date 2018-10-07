var sinchAuth = require('sinch-auth');
var sinchSms = require('sinch-messaging');
const signalR = require('@aspnet/signalr');

XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
WebSocket = require('websocket').w3cwebsocket;



var chatHubUrl = "http://13.233.42.222/chat-api/chat";
//var chatHubUrl = "http://172.23.238.206:7001/chat-api/chat";
var chatApiUrl = "http://13.233.42.222/chat-api/api/chat/workspaces/workspacename/"
//var chatApiUrl = "http://172.23.238.206:7001/chat-api/api/chat/workspaces/workspacename/"

const connection = new signalR.HubConnectionBuilder()
    .withUrl(chatHubUrl)
    .configureLogging(signalR.LogLevel.Information)
    .build();

connection.start()
    .then(() => {
        console.log("Connection to hub started");
        connection.invoke("sendToAllconnid", "tldm.sms.bot@gmail.com")
            .then(console.log("BOT IS NOW ONLINE!"))
            .catch(err => console.error(err.toString()))
        connection.invoke("sendAllUserChannel", "tldm.sms.bot@gmail.com")
            .then(console.log("Requested for the list of channels where bot is installed"))
            .catch(err => console.error(err.toString()));
    })
    .catch(err => console.error(err.toString()));

connection.onclose(function () {
    console.log("DISCONNECTED!!");
    process.exit();
})

connection.on("SendToAllconnid", (activeusers) => {
});

connection.on("ReceiveUserChannels", (listofUserChannels, emailId) => {
    console.log("Receiving...")

    if (emailId == "tldm.sms.bot@gmail.com") {
        console.log("Received list of user channels")
        console.log(listofUserChannels);
        listofUserChannels.forEach(channelId => {
            connection.invoke('joinChannel', channelId)
                .catch(err => console.log(err));
        });
    }


});


connection.on("SendMessageInChannel", (user, message) => {

    if (message.messageBody.startsWith('/sms')) {
        console.log("SENDING SMS!!!")
        var auth = sinchAuth("2c7726a3-a0b7-4f86-84a1-7a50094f10f2", "NcZTgeR3FUGv7TiyUtH4sQ==");
        sinchSms.sendMessage("+918681902904", "URGENT!!! Register ID - 5893 tomorrow. - Hrishikesh");
    }


});