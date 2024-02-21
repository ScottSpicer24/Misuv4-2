import { getLogs } from '../../services/hubServices'

/* logsData */

const INITIAL_STATE = {
	logs: [],
}
export const getLogsReducer = (state = INITIAL_STATE, { payload, type }) => {
	switch (type) {
		case 'SET_LOGS':
			return { ...state, logs: payload };
		default:
			return state;

	}
}

const setLogs = (type, data) => ({
	type,
	payload: data
})

export const getLogsAction = (idToken) => {
	return async (dispatch) => {
		getLogs(idToken).then((data) => {
			dispatch(setLogs('SET_LOGS', data));
		}).catch((err) => console.log("getLogs error: " + err));
	}
}