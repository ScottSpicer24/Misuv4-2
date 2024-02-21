import React, { useEffect, useRef } from "react";
import { AppState, View, Text, Image, StyleSheet, ActivityIndicator, LogBox, BackHandler } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from "react-redux";

// location imports
import * as TaskManager from 'expo-task-manager';
import * as SecureStore from "expo-secure-store";
import {
  checkLocationPermissions,
  sendUserLocation,
  startLocationUpdates,
  requestLocationPermissions
} from '../../services/locationServices'

LogBox.ignoreAllLogs(true);
LogBox.ignoreLogs(["Non-serializable", "Setting a timer"]);

const AWS = require("aws-sdk");
AWS.config.update({ region: "us-east-1" });



export default function LoadingScreen(props) {
  const { hubInfoData } = useSelector(state => state)
  const { logs } = useSelector(state => state.logsData)
  const hubInfoDataRef = useRef(null);
  const logsRef = useRef(null);
  hubInfoDataRef.current = hubInfoData;
  logsRef.current = logs;

  const appState = useRef(AppState.currentState);

  const dispatch = useDispatch();
  let hasLoggedIn_homeowner = null;
  let hasLoggedIn_guest = null;

  // Only called once to set up listeners
  useEffect(() => {
    // Connects the app to the websocket server
    handleSocketConnection();

    // Disables Back-button throughout the app when logged in
    const backHandlerSub = BackHandler.addEventListener('hardwareBackPress', () => true);

    // Handles websocket connection/disconnection when app is in foreground/background
    const appStateSub = AppState.addEventListener("change", nextAppState => {
      if (appState.current.match(/active/) && nextAppState.match(/inactive|background/)) {
        props.disconnectWebsocket();
      }
      else {
        handleSocketConnection();
      }

      appState.current = nextAppState;
      console.log("AppState", appState.current);
    });

    return () => {
      appStateSub?.remove();
      backHandlerSub?.remove();
    };

  }, []);


  // Called whenever user type is changed (guest or homeowner)
  useEffect(() => {
    const { idToken } = props.sessionData;
    checkOnboardingStatus()
      .then(() => fetchData(idToken))
      .then(() => {
        //console.log(props.hubInfoData)
        if (props.hubInfoData.user_type == 0) {
          // Using this for onboarding testing
          if (!hasLoggedIn_guest) {
            props.navigation.navigate("Onboarding");
          }
          else {
            props.navigation.navigate("GuestApp");
          }
        }
        else if (props.hubInfoData.user_type == 1) {
          // Using this for onboarding testing
          if (!hasLoggedIn_homeowner) {
            props.navigation.navigate("Onboarding");
          }
          else {
            props.navigation.navigate("App");
          }
        }
        else {
          props.getHub(idToken);
        }
      });
  }, [props.hubInfoData.user_type]);

  async function fetchData(idToken) {
    await props.getHub(idToken);
    await props.getDevices(idToken);
    await props.getSharedDevices(idToken);
    await props.getSharedUsers(idToken);
    await props.getLogs(idToken);
    await locationCheck();
  }

  async function locationCheck() {

    //console.log(JSON.stringify(hubInfoData));
    var perm = await checkLocationPermissions();
    //console.log(perm);
    if (perm === true) {
      startLocationUpdates();
    } else if (hubInfoData.hub_latitude !== undefined
      && hubInfoData.hub_longitude !== undefined) {
      perm = await requestLocationPermissions();
      if (perm === true) {
        startLocationUpdates();
      } else {
        // TODO: handle when user denies location tracking but have a hub setup
      }
    }

  }

  // Sets up websocket client connection for real-time logs/device status updates
  function handleSocketConnection() {
    props.connectWebsocket({
      queryParams: { user_id: props.sessionData.id },
      onMessage: (message) => {
        console.log("Message Recieved:");
        console.log(message);

        if (message.type) {
          if (message.type == "device") {
            hubInfoDataRef.current.user_type == 0 ? (
              props.updateSharedDevices(message.device_info)
            ) :
              (
                props.updateDevices(message.device_info) &&
                props.updateSharedUsers(message.device_info)
              )
          }
          else if (message.type == "log") {
            dispatch({ type: 'SET_LOGS', payload: [message.log_info, ...logsRef.current] })
          }
        }
      },
    });
  }

  // make this return a promise
  async function checkOnboardingStatus() {
    // ONLY USE TO DELETE ASYNCSTORAGE FOR TESTING
    if (false) {
      await AsyncStorage.removeItem(props.sessionData.id + "_homeowner", () => console.log("REMOVED ONBOARDING ID"));
      await AsyncStorage.removeItem(props.sessionData.id + "_guest", () => console.log("REMOVED ONBOARDING ID"));
    }
    else {
      // Check if first time logging in (enables onboarding process)
      hasLoggedIn_homeowner = await AsyncStorage.getItem(props.sessionData.id + "_homeowner");
      hasLoggedIn_guest = await AsyncStorage.getItem(props.sessionData.id + "_guest");
    }
  }







  // Shows a loading animation
  return (
    <View style={styles.container}>
      <View>
        <Image
          style={{
            width: 180,
            height: 180,
            marginBottom: 90,
          }}
          source={require("../../assets/MISUv2.png")}
        />
      </View>
      <Text
        style={{
          fontSize: 24,
          marginBottom: 16,
        }}
      >
        Loading...
      </Text>
      <ActivityIndicator color={'grey'} size="large" />
    </View>
  );
}

// create background task to send user's location
TaskManager.defineTask('background-location-task', async ({ data, error }) => {
  if (error) {
    console.log("ERROR " + error.message);
    return;
  }
  if (data) {
    const { locations } = data;
    // do something with the locations captured in the background    
    const coords = {
      latitude: locations[0].coords.latitude,
      longitude: locations[0].coords.longitude
    }
    const idToken = await SecureStore.getItemAsync("idToken");
    console.log("sending location " + JSON.stringify(coords));

    await sendUserLocation(idToken, coords);
  }
});


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
