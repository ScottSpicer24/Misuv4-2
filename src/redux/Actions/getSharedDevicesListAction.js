import { getSharedDevicesList } from '../../services/deviceServices'

/* sharedDevicesData */

const INITIAL_STATE = {
    sharedDevices: [],
}

export const getSharedDevicesListReducer = (state = INITIAL_STATE, { payload, type }) => {

    switch (type) {
        case 'SET_SHARED_DEVICES':
            return { ...state, sharedDevices: payload };
        default:
            return state
    }
}

const setSharedDevices = (type, data) => ({
    type,
    payload: data
});

export const getSharedDevicesListAction = (idToken) => {
    return async (dispatch) => {
        try {
            getSharedDevicesList(null, idToken).then((devices) => {
                //console.log("getSharedDevices: " + JSON.stringify(devices));
                if (devices != "Internal server error")
                    dispatch(setSharedDevices("SET_SHARED_DEVICES", devices));
            })
        } catch (error) {
            //update prevent null fails : will show up as empty 
            dispatch(setSharedDevices("SET_SHARED_DEVICES", []));
        }
    }
}

export const updateSharedDevicesAction = (updatedDevice) => {
	return async (dispatch, useState) => {
		const { sharedDevices } = useState().sharedDevicesData;

		const hubIndex = sharedDevices.findIndex(({ login_credentials_id }) => login_credentials_id === updatedDevice.login_credentials_id);
        const deviceIndex = sharedDevices[hubIndex].devices.findIndex(({ entity_id }) => entity_id === updatedDevice.entity_id);
        
        const sharedDevicesList = [...sharedDevices]; //making a new array

        // console.log("BEFORE UPDATE: " + JSON.stringify(sharedDevicesList[hubIndex]));

        sharedDevicesList[hubIndex].devices[deviceIndex] = {...sharedDevicesList[hubIndex].devices[deviceIndex], ...updatedDevice}; // overwriting changed properties/attributes

        // console.log("AFTER UPDATE: " + JSON.stringify(sharedDevicesList[hubIndex]));
		
        dispatch(setSharedDevices('SET_SHARED_DEVICES', sharedDevicesList ));
	}
}