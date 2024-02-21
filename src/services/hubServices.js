export const createHub = async ({ hub_token }, idToken) => new Promise((resolve, reject) => {
	fetch(
		"https://c8zta83ta5.execute-api.us-east-1.amazonaws.com/test/hub",
		{
			method: "POST",
			headers: {
				Authorization: "Bearer " + idToken,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				hub_token: hub_token,
			}),
		}
	)
		.then((response) => response.json())
		.then((data) => {
			//console.log(data)
			resolve(data);
		})
		.catch((err) => reject(err));
});

export const deleteHub = async (idToken) => new Promise((resolve, reject) => {
	fetch(
		"https://c8zta83ta5.execute-api.us-east-1.amazonaws.com/test/hub",
		{
			method: "DELETE",
			headers: {
				Authorization: "Bearer " + idToken,
				"Content-type": "application/json",
				Accept: "*/*",
			},
		}
	)
		.then((response) => response.json())
		.then((data) => {
			//console.log(data);
			resolve(data);
		})
		.catch((err) => reject(err));
});

export const getHubInfoService = async (idToken) => new Promise((resolve, reject) => {
	fetch('https://c8zta83ta5.execute-api.us-east-1.amazonaws.com/test/getUserInfo', {
		method: 'GET',
		headers:
		{
			Authorization: 'Bearer ' + idToken
		}
	})
		.then((response) => resolve(response.json()))
		.catch((err) => reject(err));
});

// Guest leaves a homeowner's hub
export const handleLeavingHub = async (account, value, idToken) => new Promise((resolve, reject) => {

	fetch('https://c8zta83ta5.execute-api.us-east-1.amazonaws.com/test/invitation', {
		method: 'POST',
		headers:
		{
			Authorization: 'Bearer ' + idToken,
			"Content-type": "application/json",
			Accept: "*/*"
		},
		body: JSON.stringify({
			account: account,
			accepted: value
		})
	})
		.then((response) => resolve(response.json()))
		.catch((err) => reject(err));
});

export const getLogs = async (idToken) => new Promise((resolve, reject) => {
	fetch(
		`https://c8zta83ta5.execute-api.us-east-1.amazonaws.com/test/getuserlogs`,
		{
			method: "GET",
			headers: {
				Authorization: "Bearer " + idToken,
			},
		}
	)
		.then((response) => response.json())
		.then((data) => {
			if (data.message == "Internal server error")
				reject(data.message);
			else if (data.message.length > 0) {
				resolve(data.message);
			}
		})
		.catch((error) => reject(error));
});