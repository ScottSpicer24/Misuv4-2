// Returns the device state and color for status
export const getLogDetails = (log) => {
	let name, color, type, initialState, endState;
	let msg = log.content.toLowerCase();

	if (msg.includes('on to off')) {
		if (msg.includes('doorbell')) {
			name = 'bell-off-outline';
			color = 'grey'
			type = 'material-community';
			initialState = 'ringing'
			endState = 'clear'
		}
		else {
			name = "lightbulb-off-outline";
			type = "material-community";
			color = 'grey';
		}
	}
	else if (msg.includes('off to on')) {
		if (msg.includes('doorbell')) {
			name = 'bell-ring-outline';
			color = '#44ABFF'
			type = 'material-community';
			initialState = 'clear'
			endState = 'ringing'
		}
		else {
			name = "lightbulb-on-outline";
			color = '#ffbf00'
			type = "material-community";
		}
	}
	else if (msg.includes('away')) {
		name = 'run-fast';
		color = '#44ABFF'
		type = 'material-community';
	}
	else if (msg.includes('to arm') || msg.includes('performed arm')) {
		name = 'shield-home-outline';
		color = '#FF5722'
		type = 'material-community';
	}
	else if (msg.includes('to arming')) {
		name = 'shield-refresh-outline';
		color = '#ffbf00'
		type = 'material-community';
	}
	else if (msg.includes('to disarmed') || msg.includes('performed alarm_disarm')) {
		name = 'shield-off-outline';
		color = '#7DEA7B'
		type = 'material-community';
	}
	else if (msg.includes('alarm')) {
		name = 'alarm-light-outline';
		color = '#44ABFF'
		type = 'material-community';
	}
	else if (msg.includes('to unlocked') || msg.includes('performed unlock')) {
		name = 'lock-open-outline';
		color = '#FF5722'
		type = 'material-community';
	}
	else if (msg.includes('to locked') || msg.includes('performed lock')) {
		name = 'lock-outline';
		color = '#57E455'
		type = 'material-community';
	}
	else if (msg.includes('started')) {
		name = 'video-wireless-outline';
		color = '#7DEA7B'
		type = 'material-community';
	}
	else if (msg.includes('stopped')) {
		name = 'video-off-outline';
		color = '#FF5722'
		type = 'material-community';
	}
	else {
		name = 'bell-ring-outline';
		color = '#44ABFF'
		type = 'material-community';
	}
	return { name, color, type, initialState, endState };
};