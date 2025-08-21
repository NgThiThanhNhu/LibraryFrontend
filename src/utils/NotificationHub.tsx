import * as signalR from "@microsoft/signalr";
const connection = new signalR.HubConnectionBuilder().withUrl("https://localhost:7260/notificationhub", {
    withCredentials: true
}).withAutomaticReconnect().configureLogging(signalR.LogLevel.Debug).build();
export default connection;