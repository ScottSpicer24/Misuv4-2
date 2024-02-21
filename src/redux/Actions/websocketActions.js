import websocketClient from "../../services/websocketClient";

/* Websocket Server Connection */

const INITIAL_STATE = {
	connection: {},
	status: "disconnected",
}

export const websocketReducer = (state = INITIAL_STATE, { payload, type }) => {
	switch (type) {
		case 'SET_SERVER_CONNECTION':
			return { ...state, ...payload };
		case 'DELETE_SERVER_CONNECTION':
			return { ...state, status: payload };
		default:
			return state;

	}
}

const setWebsocket = (type, data) => ({
	type,
	payload: data
})

export const connectWebsocket = (options = {}, onConnect = null, onDisconnect = null) => {
	return async (dispatch) => {
		const connection = await websocketClient(options, onConnect, onDisconnect);
		dispatch(setWebsocket('SET_SERVER_CONNECTION', { connection, status: "connected" }));
	}
}

export const disconnectWebsocket = () => {
	return async (dispatch, useState) => {
		const { connection } = useState().websocket;
		connection.client.close();
		dispatch(setWebsocket('DELETE_SERVER_CONNECTION', "disconnected" ));
	}
}