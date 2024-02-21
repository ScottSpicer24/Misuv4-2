import React, { useState, useRef } from "react";
import AppIntroSlider from "react-native-app-intro-slider";
import { View, SafeAreaView, Text, Image, StatusBar, TouchableOpacity, Dimensions, Platform, Alert } from "react-native";
import { Icon } from "react-native-elements";
import { useSelector } from "react-redux";
import { registerPushNotifications} from "../../services/appServices";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {requestLocationPermissions, startLocationUpdates} from "../../services/locationServices";



const { height, width } = Dimensions.get("screen");


const OnboardingScreen = ({ navigation }) => {
  const [slider, setSlider] = useState(null);
  const { hubInfoData, sessionData } = useSelector(state => state);
  //console.log(hubInfoData)

  const data = [
    {
      title: hubInfoData.user_type == 0 ? "Welcome Guest!" : "Welcome Homeowner!",
      text: hubInfoData.user_type == 0 ? "MiSu allows guests of smart home owners to accept permissions to control their smart devices" : "MiSu allows smart home appliance owners more control over who has access to their devices",
      image: require("../../assets/Onboarding/onboarding1_owner.png"),
      altStyle: true
    },
    {
      title: hubInfoData.user_type == 0 ? "Smart & Simple Access" : "Smart & Simple Sharing",
      text: hubInfoData.user_type == 0 ? "Don't stress over the details. Simply use devices when, where, and how the homeowner wants you to. We can take care of the rest." : "Easily share permissions to devices or certain actions of appliances to your family, friends, and guests",
      image: hubInfoData.user_type == 0 ? require("../../assets/Onboarding/onboarding2_guest.png") : require("../../assets/Onboarding/onboarding1.2_owner.png")
    },
    {
      title: hubInfoData.user_type == 0 ? "Connect to Multiple Hubs" : "Always Have Control",
      text: hubInfoData.user_type == 0 ? "Upon invitation, connect to and manage varying smart devices for as many households as you need" : "Manage when, where, and how your guests are allowed to use your smart appliances",
      image: hubInfoData.user_type == 0 ? require("../../assets/Onboarding/onboarding1.2_owner.png") : require("../../assets/Onboarding/onboarding1.3_owner.png")
    },
    {
      title: "Turn on Notifications",
      text: hubInfoData.user_type == 0 ? "Know instantly when a homeowner has invited you to their hub or given you access to a device" : "Know instantly when a guest connects to your devices and when they use them",
      image: require("../../assets/Onboarding/onboarding2_owner.png"),
      buttons: [
        {
          style: { ...styles.button, backgroundColor: "#C8CDEC" },
          onPress: () => slider.goToSlide(4),
          text: "Not now",
        },
        {
          style: { ...styles.button, backgroundColor: "#289EFF" },
          onPress: () => registerPushNotifications(),
          text: "Turn on",

        }
      ]
    },
    {
      title: "Turn on Location",
      text: hubInfoData.user_type == 0 ? "Through our geofencing feature, you can feel secure to use a homeowner's devices only where you need to" : "Through our geofencing feature, you can feel secure that guests will only use your devices where necessary",
      image: require("../../assets/Onboarding/onboarding3_owner.png"),
      altStyle: true,
      buttons: [
        {
          style: { ...styles.button, backgroundColor: "#C8CDEC" },
          onPress: () => slider.goToSlide(5),
          text: "Not now",

        },
        {
          style: { ...styles.button, backgroundColor: "#289EFF" },
          onPress: async () => {
            const res = await requestLocationPermissions()
            //console.log(res)
            if (res) {
              Alert.alert("Access Granted", "You are now sharing your location with MiSu")
              startLocationUpdates();
            }
          },
          text: "Turn on",

        }
      ]
    },
    {
      title: "How to Ensure a Successful Experience",
      text: hubInfoData.user_type == 0 ? "\n1. Verify that you are connected to stable WIFI or mobile network\n\n"
        + "2. Prior to connecting to smart devices, ask a homeowner to send you an invitation to connect to their hub\n\n"
        + "3. Make sure to accept a homeowner's invitation so they can start sharing devices and permissions with you" : "\n1. Make sure that your Smart Home Hub is connected to your router\n\n 2. Have an active Home Assistant account\n\n 3. Verify all smart devices are connected to the same secure network",
      image: require("../../assets/Onboarding/onboarding4_owner.png"),
      altStyle: true,
      altText: true
    },
    {
      title: (hubInfoData.user_type == 0 || (hubInfoData.user_type == 1 && hubInfoData.hub_registered == null))
        ? "Getting Started" : "You're All Set Up!",
      buttons: [
        {
          style: { ...styles.button, backgroundColor: "#289EFF" },
          onPress: () => onPressDone(),
          text: (hubInfoData.user_type == 0 || (hubInfoData.user_type == 1 && hubInfoData.hub_registered == null))
            ? "Continue" : "Go to Dashboard",

        },
      ],
      text: hubInfoData.user_type == 0 ? "Alright, let's show you around and teach you how to connect to a homeowner's hub!"
        : hubInfoData.hub_registered == null ? "Alright, its time to show you around and get you sharing! \n\n Let's start by setting up your hub..."
          : "Looks like you've already registered your hub. \n\n Let's get you back to your dashboard!",
      image: require("../../assets/Onboarding/onboarding5_owner.png"),
    }
  ];

  

  const onPressDone = async () => {
    // if guest...
    if (hubInfoData.user_type == 0) {
      await AsyncStorage.setItem(sessionData.id + "_guest", "true");
      navigation.navigate("GuestApp");
    }
    // if homeowner with hub registered...
    else if (hubInfoData.user_type == 1 && hubInfoData.hub_registered == 1) {
      await AsyncStorage.setItem(sessionData.id + "_homeowner", "true");
      navigation.navigate("App");
    }else{  // homeowner, no hub

      navigation.navigate("Hub");
    }

  }

  const renderItem = ({ item }) => {

    const { title, image, text, buttons, altStyle, altText } = item;

    // console.log(item)
    return (
      <View style={styles.slide}>

        <View style={buttons ? styles.imageContainer2 : styles.imageContainer}>
          <Image style={altStyle ? styles.image2 : styles.image} resizeMode={'contain'} source={image} />
        </View>

        <View style={buttons ? styles.textContainer2 : styles.textContainer}>
          <Text style={altText ? styles.title2 : styles.title}>{title}</Text>
          <Text style={styles.text}>{text}</Text>
        </View>

        <View style={buttons ? styles.buttonContainer : {}}>
          {buttons && buttons.map((btn, index) => (
            <TouchableOpacity key={index} style={btn.style} onPress={btn.onPress}>
              <Text style={styles.buttonText}>{btn.text}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const _renderSkipButton = () => {
    return (
      <View style={styles.skipButton}>
        <Text style={styles.skipText}>Skip</Text>
      </View>
    );
  };

  const _renderPrevButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Icon
          name="chevron-left"
          type="feather"
          color="white"
          size={25}
        />
      </View>
    );
  };

  const _renderNextButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Icon
          name="chevron-right"
          type="feather"
          color="white"
          size={25}
        />
      </View>
    );
  };
  const _renderDoneButton = () => {
    return (
      <View style={styles.doneButton}>
        <Icon
          name="checkmark"
          color="rgb(255, 255, 255)"
          size={24}
          type="ionicon"
        />
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar translucent backgroundColor="transparent" />
      <AppIntroSlider
        keyExtractor={(item) => item.title}
        renderItem={renderItem}
        renderSkipButton={_renderSkipButton}
        renderDoneButton={_renderDoneButton}
        renderNextButton={_renderNextButton}
        renderPrevButton={_renderPrevButton}
        onDone={() => onPressDone()}
        showSkipButton={true}
        showPrevButton={true}
        data={data}
        ref={(ref) => (setSlider(ref))}
        dotStyle={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
        activeDotStyle={{ backgroundColor: "#00B3FF" }}
      />
    </View>
  );
}

export default OnboardingScreen;

const styles = {
  slide: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#EDF7FE",
    paddingBottom: 69,
  },
  imageContainer: {
    flex: Platform.OS === 'ios' ? 1 : 1.5,
    top: Platform.OS === 'ios' ? '10%' : 1.5,
    justifyContent: 'center',
  },
  imageContainer2: {
    flex: Platform.OS === 'ios' ? 1 : 1.5,
    top: Platform.OS === 'ios' ? 50 : 0,
    justifyContent: 'center',
    // backgroundColor: 'green',
  },
  image: {
    flex: .8,
    margin: 50,
    marginBottom: 50,
  },
  image2: {
    flex: 0.7,
    margin: 50,
    marginBottom: 40,
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
    maxWidth: width * 0.9,
    fontWeight: "bold",
    color: "#000000",
    textAlign: "center",
  },
  title2: {
    fontSize: 22,
    marginBottom: -5,
    maxWidth: width * 0.9,
    fontWeight: "bold",
    color: "#000000",
    textAlign: "center",
  },
  text: {
    color: "#000000",
    textAlign: "center",
    maxWidth: width * .9,
    fontSize: height > 900 ? 21 : 17,
  },
  paginationContainer: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16
  },
  paginationDots: {
    height: 50,
    margin: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 4
  },
  buttonContainer: {
    flex: Platform.OS === 'ios' ? .17 : .25,
    bottom: '5%',
    justifyContent: 'center',
    // backgroundColor: 'green',
    flexDirection: "row",
  },
  button: {
    flex: 1,
    margin: 10,
    borderRadius: 10,
    justifyContent: 'center',
  },
  buttonCircle: {
    width: 50,
    height: 50,
    backgroundColor: 'rgba(0, 0, 0, .2)',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  doneButton: {
    width: 50,
    height: 50,
    backgroundColor: '#289EFF',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: "#ffffff",
    fontSize: height > 900 ? 21 : 18,
    textAlign: "center"
  },
  skipButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skipText: {
    color: "#00B3FF",
    fontSize: 18,
    textAlign: "center"
  },
  textContainer: {
    flex: height < 700 ? 1.7 : 1,
    top: Platform.OS === 'ios' ? '10%' : 1.5,
    justifyContent: 'flex-start',
    // backgroundColor: 'green',
  },
  textContainer2: {
    flex: 0.7,
    justifyContent: 'center',
    // backgroundColor: 'green',
  },


};