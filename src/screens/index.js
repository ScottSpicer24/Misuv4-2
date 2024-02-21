// Redux imports
import { connect } from 'react-redux';
import { getHubInfoAction } from '../redux/Actions/getHubInfoAction';
import { getSharedUsersListAction, updateSharedUsersAction } from '../redux/Actions/getSharedUsersListAction';
import { getSharedDevicesListAction, updateSharedDevicesAction } from '../redux/Actions/getSharedDevicesListAction';
import { getDevicesAction, updateDevicesAction } from '../redux/Actions/getDevicesAction';
import { getLogsAction } from '../redux/Actions/getLogsAction';
import { connectWebsocket, disconnectWebsocket } from '../redux/Actions/websocketActions'

import LoadingScreen from './Application/LoadingScreen';

const mapStateToProps = (state) => {
	const { hubInfoData, sessionData, devicesData, sharedUsersData, sharedDevicesData } = state;
	return { hubInfoData, sessionData, devicesData, sharedUsersData, sharedDevicesData };
};

const mapDispatchToProps = (dispatch) => {
	return {
		getHub: (idToken) => dispatch(getHubInfoAction(idToken)),
		getDevices: (idToken) => dispatch(getDevicesAction(idToken)),
		updateDevices: (updatedDevice) => dispatch(updateDevicesAction(updatedDevice)),
		getSharedUsers: (idToken) => dispatch(getSharedUsersListAction(idToken)),
		updateSharedUsers: (updatedDevice) => dispatch(updateSharedUsersAction(updatedDevice)),
		getSharedDevices: (idToken) => dispatch(getSharedDevicesListAction(idToken)),
		updateSharedDevices: (updatedDevice) => dispatch(updateSharedDevicesAction(updatedDevice)),
		getLogs: (idToken) => dispatch(getLogsAction(idToken)),
		connectWebsocket: (options = {}, onConnect = null, onDisconnect = null) => dispatch(connectWebsocket(options, onConnect, onDisconnect)),
		disconnectWebsocket: () => dispatch(disconnectWebsocket()),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(LoadingScreen);
