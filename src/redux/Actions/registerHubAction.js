import { createHub } from '../../services/hubServices';

const registerHubStart = (payload) => ({
  type: 'REGISTER_HUB',
  payload,
});

const registerHubSuccess = (payload) => ({
  type: 'REGISTER_HUB',
  payload,
});

const registerHubFailed = (payload) => ({
  type: 'REGISTER_HUB',
  payload,
});

export const registerHubAction = (
  { hub_token },
  idToken
) => {
  return async (dispatch) => {
    try {

      dispatch(registerHubStart({ loading: true, success: null, error: null }));
      const hubDat = {
        hub_token,
      };
      const data = await createHub(hubDat, idToken).catch(err => console.log(err));
      dispatch(
        registerHubSuccess({ loading: false, success: true, error: null, data: data })
      )
      return data;
    } catch (error) {

      dispatch(
        registerHubFailed({
          loading: false,
          success: false,
          error: error,
        })
      );
    }
  };
};
