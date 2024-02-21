import queryString from "query-string";
import config from "C:/Users/Jack/Desktop/misu4/aws-exports";

/* To send a message to the server, use websocketClient.send({message}) on the screen you are sending a message from */

const websocketClient = async (options = {}, onConnect = null, onDisconnect = null) => {
  let url = config?.websockets?.url;
  let token = config?.websockets?.token;

  options.queryParams.authorization = token

  if (options.queryParams) {
    url = `${url}?${queryString.stringify(options.queryParams)}`;
  }

  let client = new WebSocket(url);

  let timerID = 0;

  function keepAlive() {
    // AWS idle connection timeout is approx. 10 mins
    let timeout = 420000; // 7 mins
    if (client.readyState == client.OPEN) {
      //console.log("Keeping socket connection alive")
      client.send('');
    }
    timerID = setTimeout(keepAlive, timeout);
  }

  function cancelKeepAlive() {
    if (timerID) {
      clearTimeout(timerID);
    }
  }
    //////
     /* Listens for the server to open a new connection */
     client.addEventListener("open", (client) => {
       console.log(`[websockets] Connected to ${url}`);
       keepAlive();
    });

    // /* Listens for the server to close the connection */
     client.addEventListener("close", (msg) => {
       // console.log(msg);
       cancelKeepAlive();
       console.log(`[websockets] Disconnected from ${url}`);
       client = null;
     });

    // /* Recieves any messages from the server */
    client.addEventListener("message", (event) => {
      if (event?.data && options.onMessage) {
        options.onMessage(JSON.parse(event.data));
      }
    });

    /* Websocket Client constructor */
     const connection = {
       client,
       send: (message = {}) => {
         if (options.queryParams) {
           message = { ...message, ...options.queryParams }; 
         }
         console.log("Sending message: " + JSON.stringify(message));
         return client.send(JSON.stringify(message));
       },
    };

    // /* Calls the onConnect callback function if it exists */
    if (onConnect) onConnect(connection);

    // /* Calls the onDisconnect callback function if it exists */
    if (onDisconnect) onDisconnect();

    return connection;
  };

  export default websocketClient;