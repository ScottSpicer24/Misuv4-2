import { Auth } from "aws-amplify";
import { Alert } from "react-native";
import * as Notifications from "expo-notifications";

export const registerPushNotifications = async () => {
  const permissions = await Notifications.getPermissionsAsync();
  let finalStatus = permissions.existingStatus;
  console.log(permissions)

  if (permissions.existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== "granted") {
    Alert.alert("Access Denied", "Failed to turn on push notifications. Please try again.");
    return;
  }
  const token = (await Notifications.getExpoPushTokenAsync()).data;

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  Alert.alert("Access Granted", "Push Notifications are now turned on");

  return token;
};

export const getCurrentSession = async () => {
  const data1 = await Auth.currentSession()

  const accDat = {
    id: data1.getIdToken().payload.sub,
    idToken: data1.getIdToken().getJwtToken(),
    accessToken: data1.getAccessToken().getJwtToken(),
    email: data1.getIdToken().payload.email,
    name: data1.getIdToken().payload.name
  };

  return accDat;
}

export const checkUserExists = async (idToken, email) => {
  const response = await fetch(
    "https://c8zta83ta5.execute-api.us-east-1.amazonaws.com/test/checkuserexists",
    {
      method: "POST",
      headers: {
        Authorization: "Bearer " + idToken,
        "Content-type": "application/json",
        Accept: "*/*",
      },
      body: JSON.stringify({
        // TODO: Have the email come from user input
        email: email,
      }),
    }
  );
  console.log(response);
  return response.json();
};


export const changeRole = async (user_type, idToken) => {

  return await fetch(
    "https://c8zta83ta5.execute-api.us-east-1.amazonaws.com/test/toggleusertype",
    {
      method: "POST",
      headers: {
        Authorization: "Bearer " + idToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_type: user_type,
      }),
    }
  )
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((err) => console.log(err));
};

export const changeRadius = async (idToken, radius) => {
  return await fetch(
    "https://c8zta83ta5.execute-api.us-east-1.amazonaws.com/test/gps",
    {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + idToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        geofencing_range: radius,
      }),
    }
  )
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((err) => console.log(err));
};
