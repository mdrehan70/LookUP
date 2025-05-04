// socket.js
import { io } from "socket.io-client";

const socket = io("https://lookup-g4bt.onrender.com", {
  transports: ["websocket"], // ensures a clean websocket connection
  autoConnect: false,
});

export default socket;
