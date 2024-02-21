import { deleteADevice } from "../../services/deviceServices";
import { deleteASharedUser } from "../../services/sharedUserServices";
import { getSharedUsersListAction } from "../Actions/getSharedUsersListAction";
import { getSharedDevicesListAction } from "../Actions/getSharedDevicesListAction";
import { getDevicesAction } from "../Actions/getDevicesAction";

const stopSharingStart = (payload) => ({
  type: "STOP_SHARING",
  payload,
});

export const stopSharingAction = (login_id, idToken, type, sharedDevicesId) => {
  return async (dispatch) => {
    try {
      dispatch(stopSharingStart({ loading: true }));

      if (type == 1) {
        await deleteADevice(login_id, sharedDevicesId, idToken);
      }
      else {
        await deleteASharedUser(login_id, idToken);
      }

      dispatch(stopSharingStart({ loading: false }));
      dispatch(getSharedUsersListAction(idToken));
      dispatch(getSharedDevicesListAction(idToken));
      dispatch(getDevicesAction(idToken));
    } catch (error) {
      dispatch(stopSharingStart({ loading: false }));
    }
  };
};
