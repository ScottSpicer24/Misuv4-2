import { getHubInfoService } from '../../services/hubServices'

/* hubInfoData */

const INITIAL_STATE = {
    hub_url: null,
    hub_registered: null,
    package_installed: null,
}

export const getHubInfoReducer = (state = INITIAL_STATE, action) => {

    switch (action.type) {
        case 'SET_HUB_INFO':

            return { ...state, ...action.payload };
        default:
            return state
    }
}

const setHub = (type, data, success) => ({
    type,
    payload: { ...data, success }
})


export const getHubInfoAction = (idToken) => {
    return async (dispatch) => {
        try {
            getHubInfoService(idToken).then((data) => {
                console.log("getHubInfo: " + JSON.stringify(data));
                dispatch(setHub('SET_HUB_INFO', data, true));
            })
            .catch((err) => console.log(err));
        } catch (error) {
            dispatch(setHub('UNSET_HUB_INFO', null, false))
        }
    }
}