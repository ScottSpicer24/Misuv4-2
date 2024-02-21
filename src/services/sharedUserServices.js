export const createSharedUser = async (idToken, email) => new Promise((resolve, reject) => {
	fetch(
		"https://c8zta83ta5.execute-api.us-east-1.amazonaws.com/test/createshareduser",
		{
			method: "POST",
			headers: {
				Authorization: "Bearer " + idToken,
				"Content-type": "application/json",
				Accept: "*/*",
			},
			// TODO: Change this to user input
			body: JSON.stringify({
				email: email,
			}),
		}
	)
		.then((response) => response.json())
		.then((data) => resolve(data))
		.catch((err) => reject(err));
});

export const deleteASharedUser = async (id, idToken) => new Promise((resolve, reject) => {
	fetch(
		"https://c8zta83ta5.execute-api.us-east-1.amazonaws.com/test/createshareduser",
		{
			method: "DELETE",
			headers: {
				Authorization: "Bearer " + idToken,
				"Content-type": "application/json",
				Accept: "*/*",
			},
			body: JSON.stringify({
				id: id,
			}),
		}
	)
		.then((response) => response.json())
		.then((data) => resolve(data))
		.catch((err) => reject(err));
});

// gets a massive object containing all the info of all the guests u are sharing ur hub with
export const getSharedUsersList = async (hasNextToken = null, idToken) => new Promise((resolve, reject) => {
	fetch('https://c8zta83ta5.execute-api.us-east-1.amazonaws.com/test/getdevicesyouresharing', {
		method: 'GET',
		headers: {
			Authorization: 'Bearer ' + idToken
		}
	})
	.then((response) => response.json())
	.then((data) => {
		//console.log("getSharedUsersList: " + JSON.stringify(data));
		resolve(data);
	})
	.catch((err) => reject(err));
});

// gets the same stuff as getSharedDevicesList() but then trims it to only hold an array of all the devices/hubs you have not accepted yet.
// Only used for hub invite notifications
export const getInvitations = (idToken) => new Promise((resolve, reject) => {
	try {
		fetch("https://c8zta83ta5.execute-api.us-east-1.amazonaws.com/test/getshareddevices", {
			method: "GET",
			headers: {
				Authorization: 'Bearer ' + idToken
			},
		})
			.then(res => res.json())
			.then(data => {
				(data && data.message) ? resolve(data.message.filter((tmp) => tmp.accepted == 0)) : reject("Failed to get invitations");
			})
	}
	catch (e) {
		console.error("ERROR: ", e);
	}
})

export const handleInviteResponse = (answer, id, bearer) => new Promise((resolve, reject) => {
	try {
		fetch("https://c8zta83ta5.execute-api.us-east-1.amazonaws.com/test/invitation", {
			method: "POST",
			headers: {
				Authorization: "Bearer " + bearer,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				account: id,
				accepted: answer,
			}),
		})
			.then(res => res.json())
			.then(data => {
				data.statusCode == 200 ? resolve('success') : reject('fail');
			})
	}
	catch (e) {
		console.error("ERROR: ", e);
	}
})
