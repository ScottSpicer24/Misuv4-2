// Returns the device state and color for status
export const getStatus = (state, type) => {
	let deviceState, stateColor, dotStatusColor;
	if (state == 'off') {
		if (type.includes('Doorbell') || type.includes('doorbell')) {
			deviceState = 'Clear';
			stateColor = '#2DC62A';
			dotStatusColor = 'green';
		}
		else {
			deviceState = 'Off';
			stateColor = '#fb0407';
			dotStatusColor = 'red';
		}
	}
	else if (state == 'on') {
		if (type.includes('Doorbell') || type.includes('doorbell')) {
			deviceState = 'Ringing';
			stateColor = '#44ABFF';
			dotStatusColor = 'blue';
		}
		else {
			deviceState = 'On';
			stateColor = '#2DC62A';
			dotStatusColor = 'green';
		}
	}
	else if (state == 'disarmed') {
		deviceState = 'Disarmed';
		stateColor = '#2DC62A';
		dotStatusColor = 'green';
	}
	else if (state.includes("armed")) {
		deviceState = 'Armed';
		stateColor = '#fb0407';
		dotStatusColor = '#d30013';
	}
	else if (state == 'arming') {
		deviceState = 'Arming';
		stateColor = '#ffbf00';
		dotStatusColor = '#ffbf00';
	}
	else if (state == 'locked') {
		deviceState = 'Locked';
		stateColor = '#fb0407';
		dotStatusColor = '#d30013';
	}
	else if (state == 'unlocked') {
		deviceState = 'Unlocked';
		stateColor = '#2DC62A';
		dotStatusColor = 'green';
	}
	else {
		deviceState = 'Unavailable';
		stateColor = 'grey';
		dotStatusColor = 'grey';
	}

	return { deviceState, stateColor, dotStatusColor };
};