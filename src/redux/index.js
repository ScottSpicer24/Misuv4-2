import { combineReducers } from 'redux';
import { getCurrentSessionReducer } from './Actions/getCurrentSessionAction';
import { getHubInfoReducer } from './Actions/getHubInfoAction';
import { getSharedUsersListReducer } from './Actions/getSharedUsersListAction';
import { getSharedDevicesListReducer } from './Actions/getSharedDevicesListAction';
import { getDevicesReducer } from './Actions/getDevicesAction';
import { getLogsReducer } from './Actions/getLogsAction';
import { websocketReducer } from './Actions/websocketActions';

export default combineReducers({
  devicesData: getDevicesReducer,
  hubInfoData: getHubInfoReducer,
  sessionData: getCurrentSessionReducer,
  sharedUsersData: getSharedUsersListReducer,
  sharedDevicesData: getSharedDevicesListReducer,
  logsData: getLogsReducer,
  websocket: websocketReducer,
});