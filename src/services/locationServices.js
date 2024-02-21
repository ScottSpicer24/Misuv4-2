import * as Location from 'expo-location';

export const requestLocationPermissions = async() => {
	try{
		let { status } = await Location.requestForegroundPermissionsAsync();
		if (status !== 'granted') {
			return false;
		}

		let { backPerm } = await Location.requestBackgroundPermissionsAsync();
		return true;

	}catch(e){
		 console.log(e);
	}
};

export const getCurrentPosition = async() => {
    const location = await Location.getCurrentPositionAsync({});
    return location;
};
export const startLocationUpdates = async() => {
    await Location.startLocationUpdatesAsync('background-location-task', {
        accuracy: Location.Accuracy.Balanced,
        deferredUpdatesDistance:  250, // (meters) distance must be moved before sending update
        deferredUpdatesInterval: 60*1000,     // (milliseconds) time must pass before sending update
      }
    );
}

export const checkLocationPermissions = async () => {
	var permForeground =  await Location.getForegroundPermissionsAsync();
	//console.log(permForeground);

	permBackground = await Location.getBackgroundPermissionsAsync();
	//console.log(permBackground);

	if(permForeground.granted === true && permBackground.granted === true){
		return true;
	}else{
		return false;
	}
}

export const stopLocationUpdates = async() => {
	return await Location.stopLocationUpdatesAsync('background-location-task');
}



export const sendUserLocation = async (idToken,coords) => new Promise((resolve, reject) => {

	try {
		fetch(
			"https://c8zta83ta5.execute-api.us-east-1.amazonaws.com/test/usergeolocation",
			{
				method: "POST",
				headers: {
					Authorization: "Bearer " + idToken,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					coords: coords,
				}),
			}
		)
			.then((response) => response.json())
			.then((data) => {
				//console.log("User location set: " + JSON.stringify(data));
				if (data.statusCode == 200)
					resolve(data);
				else 
					reject("Unable to send user location. Please try again.")
			})
			.catch((e) => reject("Unable to send user location. Please try again."));
	}
	catch (e) {
		console.error("ERROR: ", e);
	}
})

export const setHubLocation = async (idToken, coords) => new Promise((resolve, reject) => {
	try {
		fetch(
			"https://c8zta83ta5.execute-api.us-east-1.amazonaws.com/test/hubgeolocation",
			{
				method: "POST",
				headers: {
					Authorization: "Bearer " + idToken,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					coords: coords,
				}),
			}
		)
			.then((response) => response.json())
			.then((data) => {
				console.log("Hub location: " + JSON.stringify(data));
				if (data.statusCode == 200)
					resolve(data);
				else 
					reject("Unable to send hub location. Please try again.")
			})
			.catch((e) => reject("Unable to send hub location. Please try again."));
	}
	catch (e) {
		console.error("ERROR: ", e);
	}
})
