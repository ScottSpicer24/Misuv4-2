import { getCurrentSession } from '../../services/appServices'

import * as SecureStore from "expo-secure-store";

/* sessionData */

const INITIAL_STATE = {
    id: null,
    idToken: null,
    accessToken: null,
    email: null,
    name: null
}


export const getCurrentSessionReducer = (state = INITIAL_STATE, action) => {

    switch (action.type) {
        case 'SET_SESSION':

            return { ...state, ...action.payload };

        default:
            return state
    }
}

const setCurrentSession = (type, data, success) => ({
    type,
    payload: { ...data, success }
})


export const getCurrentSessionAction = () => {

    return async (dispatch) => {
        try {
            const data = await getCurrentSession()
            await SecureStore.setItemAsync("idToken", data.idToken);
            dispatch(setCurrentSession('SET_SESSION', data, true))
        } catch (error) {
            dispatch(setCurrentSession('UNSET_SESSION', null, false))
        }
    }
}
