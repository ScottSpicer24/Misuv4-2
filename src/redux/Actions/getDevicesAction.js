
import { getDevices } from '../../services/deviceServices'

/* devicesData */

const INITIAL_STATE = {
    devices: [],
}
export const getDevicesReducer = (state = INITIAL_STATE, action) => {
    // const tempState = state;
    switch (action.type) {
        case 'SET_DEVICES':
            return { ...state, ...action.payload };
        default:
            return state;

    }
}

const setDevices = (type, data) => ({
    type,
    payload: { ...data }
})


export const getDevicesAction = (idToken) => {
    return async (dispatch) => {

        getDevices(idToken).then((data) => {
            console.log("getAllDevices: " + JSON.stringify(data));
            dispatch(setDevices('SET_DEVICES', { devices: data }));
        }).catch((err) => {
            dispatch(setDevices('SET_DEVICES', []));
        })
    }
}

export const updateDevicesAction = (updatedDevice) => {
	return async (dispatch, useState) => {
		const { devices } = useState().devicesData;

		const index = devices.findIndex(({ name, entity_id }) => name === updatedDevice.name && entity_id === updatedDevice.entity_id);
        
        const devicesList = [...devices]; //making a new array

        // console.log("BEFORE UPDATE: " + JSON.stringify(devicesList[index]));

        devicesList[index] = {...devicesList[index], ...updatedDevice}; // overwriting changed properties/attributes

        // console.log("AFTER UPDATE: " + JSON.stringify(devicesList[index]));
		
        dispatch(setDevices('SET_DEVICES', { devices: devicesList }));
	}
}