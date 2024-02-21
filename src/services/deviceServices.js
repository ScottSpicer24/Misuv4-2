export const createADevice = async (account, idToken, { title, entity_id, type }) => {
	return await fetch(
		"https://c8zta83ta5.execute-api.us-east-1.amazonaws.com/test/shareddevice",
		{
			method: "POST",
			headers: {
				Authorization: "Bearer " + idToken,
				"Content-type": "application/json",
				Accept: "*/*",
			},
			body: JSON.stringify({
				account: account,
				name: title,
				entity_id: entity_id,
				type: type
			}),
		}
	)
		.then((response) => response.json())
		.then((data) => {
			console.log("Calling setProperties: " + JSON.stringify(data));
			setProperties(account, idToken, data.message);
			return data;
		})
		.catch((err) => console.log(err));
};

export const setProperties = async (account, idToken, sharedPropertyID) => {
	const response = await fetch(
		"https://c8zta83ta5.execute-api.us-east-1.amazonaws.com/test/property",
		{
			method: "POST",
			headers: {
				Authorization: "Bearer " + idToken,
				"Content-type": "application/json",
				Accept: "*/*",
			},
			body: JSON.stringify({
				account: account,
				device: sharedPropertyID,
				geofencing: 0,
				access_type: 0,
				all_day: 0,
				time_start: null,
				time_end: null,
				date_start: null,
				date_end: null,
				reoccuring: null,
				reoccuring_type: 0,
			}),
		}
	)
		.then((response) => response.json())
		.then((data) => {
			return data;
		})
		.catch((err) => console.log(err));
};

export const updateProperties = async (properties, idToken) => new Promise((resolve, reject) => {
	fetch(
		"https://c8zta83ta5.execute-api.us-east-1.amazonaws.com/test/property",
		{
			method: "PUT",
			headers: {
				Authorization: "Bearer " + idToken,
				"Content-type": "application/json",
				Accept: "*/*",
			},
			body: JSON.stringify(properties),
		}
	)
		.then((response) => response.json())
		.then((data) => { resolve(data) })
		.catch((err) => console.log("updateProperties ERROR", err));
});

// gets the properties/rules of a specific device
export const getDeviceProperties = async (accountID, deviceID, idToken) => new Promise((resolve, reject) => {
	fetch(
		"https://c8zta83ta5.execute-api.us-east-1.amazonaws.com/test/getproperty",
		{
			method: "POST",
			headers: {
				Authorization: "Bearer " + idToken,
				"Content-Type": "application/json",
				Accept: "*/*",
			},
			body: JSON.stringify({
				account: accountID,
				device_id: deviceID,
			}),
		}
	)
		.then((resp) => resp.json())
		.then((data) => { resolve(data) })
		.catch((err) => reject(err));
});

export const getActionAccess = async (idToken, shared_device_properties_id) => new Promise((resolve, reject) => {
	fetch(
		"https://c8zta83ta5.execute-api.us-east-1.amazonaws.com/test/action",
		{
			method: "POST",
			headers: {
				Authorization: "Bearer " + idToken,
				"Content-type": "application/json",
				Accept: "*/*",
			},
			body: JSON.stringify({ shared_device_properties_id }),
		}
	)
		.then((response) => response.json())
		.then((data) => { resolve(data) })
		.catch((err) => { reject(err) });
});

export const updateActionAccess = async (
	idToken,
	account,
	shared_device_properties_id,
	name,
	access,
	type
) => new Promise((resolve, reject) => {
	fetch(
		"https://c8zta83ta5.execute-api.us-east-1.amazonaws.com/test/action",
		{
			method: "PUT",
			headers: {
				Authorization: "Bearer " + idToken,
				"Content-type": "application/json",
				Accept: "*/*",
			},
			body: JSON.stringify({ account, shared_device_properties_id, name, access, type }),
		}
	)
		.then((response) => response.json())
		.then((data) => { resolve(data) })
		.catch((err) => { reject(err) });
});

export const deleteADevice = async (login_id, device, idToken) => {
	const response = await fetch(
		"https://c8zta83ta5.execute-api.us-east-1.amazonaws.com/test/device",
		{
			method: "DELETE",
			headers: {
				Authorization: "Bearer " + idToken,
				"Content-type": "application/json",
				Accept: "*/*",
			},
			body: JSON.stringify({
				account: login_id,
				device: device,
			}),
		}
	).then((response) => response.json())
		.then((data) => {
			console.log("Device Deleted: ", data);
			return data;
		})
		.catch((err) => console.log(err));;
};

// gets all devices a homeowner has connected to their hub, and the guests/actions attached to those devices
export const getDevices = async (idToken) => new Promise((resolve, reject) => {
	fetch('https://c8zta83ta5.execute-api.us-east-1.amazonaws.com/test/getalldevices', {
		method: 'GET',
		headers: {
			Authorization: 'Bearer ' + idToken
		}
	})
		.then((response) => response.json())
		.then((data) => {
			//console.log("getAllDevices: " + JSON.stringify(data))
			resolve(data.devices);
		})
		.catch((err) => reject(err));
});

// gets any devices that have been shared with you (as a guest), who shared it with you, and if you accepted their hub invite.
export const getSharedDevicesList = async (hasNextToken = null, idToken) => new Promise((resolve, reject) => {
	fetch('https://c8zta83ta5.execute-api.us-east-1.amazonaws.com/test/getshareddevices', {
		method: 'GET',
		headers: {
			Authorization: 'Bearer ' + idToken
		}
	})
		.then((response) => response.json())
		.then((data) => {
			//console.log("getSharedDevicesList: " + JSON.stringify(data))
			resolve(data.message);
		})
		.catch((err) => reject(err));
});

export const useDevice = async (action, idToken, device, isHomeowner = false) => new Promise((resolve, reject) => {
	const bodyData = (isHomeowner) ? 
		{
			entity_id: device.entity_id,
			device_id: device.shared_device_properties_id,
			action
		} :
		{
			account: device.login_credentials_id,
			device_id: device.shared_device_properties_id,
			action
		};
	
	try {
		fetch(
			"https://c8zta83ta5.execute-api.us-east-1.amazonaws.com/test/usedevice",
			{
				method: "POST",
				headers: {
					Authorization: "Bearer " + idToken,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(bodyData),
			}
		)
			.then((response) => response.json())
			.then((data) => {
				console.log("USE DEVICE RETURN:", data);
				if (data.statusCode == 200)
					resolve();
				else if (data.statusCode == 407 || data.statusCode == 408)
					reject(data.message);
			})
			.catch((err) => console.log("ERROR", err));
	}
	catch (e) {
		console.error("ERROR: ", e);
	}
})

// gets the status values of the device (on/off, etc.) (can be possibly replaced by getAllDevices)
export const getDeviceValues = async (idToken, device) => new Promise((resolve, reject) => {
	try {
		fetch(
			"https://c8zta83ta5.execute-api.us-east-1.amazonaws.com/test/getvalues",
			{
				method: "POST",
				headers: {
					Authorization: "Bearer " + idToken,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					account: device.login_credentials_id,
					device: device.shared_device_properties_id,
				}),
			}
		)
			.then((response) => response.json())
			.then((data) => { resolve(data) })
			.catch((err) => { reject(data) });
	}
	catch (e) {
		console.error("ERROR: ", e);
	}
})

export const toggleRingStream = async (idToken, device, action) => new Promise((resolve, reject) => {
	try {
		fetch(
			"https://c8zta83ta5.execute-api.us-east-1.amazonaws.com/test/toggleRingStream",
			{
				method: "POST",
				headers: {
					Authorization: "Bearer " + idToken,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					account: device.login_credentials_id,
					action: action,
				}),
			}
		)
			.then((response) => response.json())
			.then((data) => {
				console.log("Livestream: " + JSON.stringify(data));
				if (data.statusCode == 200)
					resolve(data);
				else if (data.statusCode == 407)
					reject("No access at this time");

				else 
					reject("Unable to turn on stream. Please try again.")
			})
			.catch(() => reject("Unable to turn on stream. Please try again."));
	}
	catch (e) {
		console.error("ERROR: ", e);
	}
})