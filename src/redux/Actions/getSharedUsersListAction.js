import { getSharedUsersList } from '../../services/sharedUserServices'

/* sharedUsersData */

const INITIAL_STATE = {
    sharedUsers: [],
}

export const getSharedUsersListReducer = (state = INITIAL_STATE, action) => {

    switch (action.type) {
        case 'SET_SHARED_ACCOUNTS':
            return { ...state, ...action.payload };
        default:
            return state
    }
}


const setSharedUsers = (type, data, success) => ({
    type,
    payload: { ...data, success }
})

export const getSharedUsersListAction = (idToken) => {

    return async (dispatch) => {
        try {
            const data = await getSharedUsersList(null, idToken)
            //console.log("getSharedUsersList: " + JSON.stringify(data));
            dispatch(setSharedUsers('SET_SHARED_ACCOUNTS', { sharedUsers: data.message, error: null, loading: false }, true,))
        } catch (error) {
            dispatch(setSharedUsers('SET_SHARED_ACCOUNTS', { sharedUsers: [], error: error.message, loading: false }, false))
        }
    }

}

export const updateSharedUsersAction = (updatedDevice) => {
    return async (dispatch, useState) => {
        const { sharedUsers } = useState().sharedUsersData;

        let sharedUsersList = [...sharedUsers]; //making a new array

        sharedUsersList.forEach(sharedUser =>
            sharedUser.devices.forEach((device) => {
                if (device.name === updatedDevice.name && device.entity_id === updatedDevice.entity_id) {
                    device.state = updatedDevice.state;
                }
            })
        );

        dispatch(setSharedUsers('SET_SHARED_ACCOUNTS', { sharedUsers: sharedUsersList }));
    }
}