import Amplify from "aws-amplify";
import Expo from 'expo'
import React, { useState } from "react";
import { Text, View, StatusBar, Dimensions, Platform } from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import { RootSiblingParent } from 'react-native-root-siblings';

/* Authentication */
import LoginScreen from "./screens/Authentication/LoginScreen";
import RegisterScreen from "./screens/Authentication/RegisterScreen";
import OnboardingScreen from "./screens/Authentication/OnboardingScreen";

/* Application */
import LoadingScreen from "./screens";
import AccountScreen from "./screens/Application/AccountScreen";
import LogScreen from "./screens/Application/LogScreen";
import HubScreen from "./screens/Application/HubScreen";
import DashboardScreen from "./screens/Application/DashboardScreen";
import YourHubsScreen from "./screens/Application/YourHubsScreen";
import DeviceControlScreen from "./screens/Application/DeviceControlScreen";
import HomeownerControlScreen from "./screens/Application/HomeownerControlScreen";
import GuestRemoveScreen from "./screens/Application/GuestRemoveScreen";
import SetScheduleScreen from "./screens/Application/SetScheduleScreen";
import DevicePropertiesScreen from "./screens/Application/DevicePropertiesScreen";

/* Redux */
import { Provider } from "react-redux";
import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";
import config from "../aws-exports";
import rootReducer from "./redux";

/* Navigation */
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {Icon} from 'react-native-elements'

import { TourGuideProvider } from 'rn-tourguide';

/* Custom Header Component */
import { Header, Logo } from "./components/Header.js";
import Notifications from "./components/GuestNotifications.js";


var width = Dimensions.get("window").width; //full width
var height = Dimensions.get("window").height; //full height

Amplify.configure(config);

const store = createStore(rootReducer, applyMiddleware(thunk));

const HomeNav = createStackNavigator();
function HomeStack() {
  return (
    <HomeNav.Navigator>
      <HomeNav.Screen
        name="Home"
        component={DashboardScreen}
        options={{
          headerShown: true,
          headerLeft: () => <Logo />,
          headerTitle: () => <Header title="Dashboard" />,
          headerRight: () => <View />,
        }}
      />
      <HomeNav.Screen
        name="GuestRemove"
        component={GuestRemoveScreen}
        options={{
          headerShown: true,
          headerTitle: () => <Header title="Guest" guest={false} />,
          headerRight: () => <View />,
        }}
      />
      <HomeGuestNav.Screen
        name="HomeownerControl"
        component={HomeownerControlScreen}
        options={{
          headerShown: true,
          headerTitle: () => <Header title="Device Control" guest={false} />,
          headerRight: () => <View />,
        }}
      />
      <HomeNav.Screen
        name="Properties"
        component={DevicePropertiesScreen}
        options={{
          headerShown: true,
          headerTitle: () => <Header title="Device Permissions" guest={false} />,
          headerRight: () => <View />,
        }}
      />
      <HomeNav.Screen
        name="SetScheduleScreen"
        component={SetScheduleScreen}
        options={{
          headerShown: true,
          headerTitle: () => <Header title="Set Schedule" guest={false} />,
          headerRight: () => <View />,
        }}
      />
    </HomeNav.Navigator>
  );
}

const HomeGuestNav = createStackNavigator();
function HomeGuestStack() {
  const navigation = useNavigation();
  return (
    <HomeGuestNav.Navigator>
      <HomeGuestNav.Screen
        name="Hubs"
        component={YourHubsScreen}
        options={{
          headerLeft: () => <Logo />,
          headerShown: true,
          headerTitle: () => <Header title="Hubs" guest={true} />,
          headerRight: () => <Notifications guest={true} navigate={navigation.navigate} />,
        }}
      />
      <HomeGuestNav.Screen
        name="DeviceControl"
        component={DeviceControlScreen}
        options={{
          headerShown: true,
          headerTitle: () => <Header title="Device Control" guest={true} />,
          headerRight: () => <View />,
        }}
      />
    </HomeGuestNav.Navigator>
  );
}

const ProfileNav = createStackNavigator();
function ProfileStack() {
  return (
    <ProfileNav.Navigator>
      <ProfileNav.Screen
        name="Account"
        component={AccountScreen}
        options={{
          headerShown: true,
          headerLeft: () => null,
          headerTitle: () => <Header title="Profile" />,

        }}
      />
      <ProfileNav.Screen
        name="Hub"
        component={HubScreen}
        options={{
          headerShown: false,
        }}
      />
    </ProfileNav.Navigator>
  );
}

const LogNav = createStackNavigator();
function LogStack({ route: { params } }) {
  return (
    <LogNav.Navigator>
      <LogNav.Screen
        name="Logs"
        component={LogScreen}
        initialParams={params}
        options={{
          headerLeft: () => <View />,
          headerRight: () => <View />,
          headerShown: true,
          headerTitle: () => <Header title="Logs" />,
        }}
      ></LogNav.Screen>
    </LogNav.Navigator>
  );
}

const NavBar = createBottomTabNavigator();
function AppNavBar() {
  return (
    <View style={{ flex: 1, bottom: 0, backgroundColor: '#E7E7E7' }}>
      <NavBar.Navigator
        tabBarOptions={{
          showLabel: false,
          activeTintColor: "#008CFF",
          inactiveTintColor: "#4B4B4B",
          style: {
            borderTopLeftRadius: 21,
            borderTopRightRadius: 21,
            backgroundColor: "#fff",
            position: 'relative',
            paddingBottom: 5,
            padding: 3,
            width: width,
            height: Platform.OS === "ios" ? height / 10 : height / 12,
            zIndex: 8
          },
        }}
      >
        <NavBar.Screen
          name="HomeStack"
          component={HomeStack}
          options={{
            tabBarLabel: "Dashboard",
            tabBarIcon: ({ color }) => (
              <View style={{ marginBottom: height > 800 ? (Platform.OS === 'ios' ? 15 : 0) : 0, width: width / 3, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="home" type="feather" color={color} size={height > 1000 ? 45 : 31} />
                <Text style={{ fontSize: 13, color: color }}>Dashboard</Text>
              </View>
            ),
          }}
        />
        <NavBar.Screen
          name="Logs"
          component={LogStack}
          options={{
            headerShown: true,
            headerLeft: () => null,
            headerTitle: () => <Header title="Activity Logs" />,
            tabBarIcon: ({ color }) => (
              <View style={{ marginBottom: height > 800 ? (Platform.OS === 'ios' ? 15 : 0) : 0, width: width / 3, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="file-text" type="feather" color={color} size={height > 1000 ? 45 : 31} />
                <Text style={{ textAlign: 'center', fontSize: 13, color: color }}>Logs</Text>
              </View>
            ),
          }}
        />
        <NavBar.Screen
          name="Profile"
          component={ProfileStack}
          options={{
            tabBarIcon: ({ color }) => (
              <View style={{ marginBottom: height > 800 ? (Platform.OS === 'ios' ? 15 : 0) : 0, width: width / 3, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="user" type="feather" color={color} size={height > 1000 ? 45 : 31} />
                <Text style={{ fontSize: 13, color: color }}>Profile</Text>
              </View>
            ),
          }}
        />
      </NavBar.Navigator>
    </View>
  );
}

const GuestNavBar = createBottomTabNavigator();
function GuestAppNavBar() {
  return (
    <View style={{ flex: 1, bottom: 0, backgroundColor: '#E7E7E7' }}>
      <GuestNavBar.Navigator
        tabBarOptions={{
          showLabel: false,
          activeTintColor: "#7DEA7B",
          inactiveTintColor: "#353535",
          style: {
            borderTopLeftRadius: 21,
            borderTopRightRadius: 21,
            backgroundColor: "#ffff",
            position: 'relative',
            paddingBottom: 5,
            padding: 5,
            width: '100%',
            height: Platform.OS === "ios" ? height / 10 : height / 12,
            zIndex: 8
          },
        }}
      >
        <GuestNavBar.Screen
          name="HomeGuestStack"
          component={HomeGuestStack}
          options={{
            tabBarLabel: "Dashboard",
            headerShown: true,
            tabBarIcon: ({ color }) => (
              <View style={{ marginBottom: height > 800 ? (Platform.OS === 'ios' ? 15 : 0) : 0, width: width / 3, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="home" type="feather" color={color} size={height > 1000 ? 45 : 31} />
                <Text style={{ fontSize: 13, color: color }}>Dashboard</Text>
              </View>
            ),
          }}
        />
        <GuestNavBar.Screen
          name="Logs"
          component={LogStack}
          options={{
            headerLeft: () => null,
            headerShown: true,
            headerTitle: () => <Header title="Activity Logs" />,

            tabBarIcon: ({ color }) => (
              <View style={{ marginBottom: height > 800 ? (Platform.OS === 'ios' ? 15 : 0) : 0, width: width / 3, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="file-text" type="feather" color={color} size={height > 1000 ? 45 : 31} />
                <Text style={{ fontSize: 13, color: color }}>Logs</Text>
              </View>
            ),
          }}
        />
        <GuestNavBar.Screen
          name="Profile"
          component={ProfileStack}
          options={{
            tabBarIcon: ({ color }) => (
              <View style={{ marginBottom: height > 800 ? (Platform.OS === 'ios' ? 15 : 0) : 0, width: width / 3, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="user" type="feather" color={color} size={height > 1000 ? 45 : 31} />
                <Text style={{ fontSize: 13, color: color }}>Profile</Text>
              </View>
            ),
          }}
        />
      </GuestNavBar.Navigator>
    </View>
  );
}

const Auth = createStackNavigator();
const AuthStack = (props) => (
  <Auth.Navigator
    initialRouteName="Login"
    headerMode="none"
    screenOptions={{
      animationEnabled: false,
    }}
  >
    <Auth.Screen
      name="Login"
      component={LoginScreen}
    />
    <Auth.Screen name="Loading" component={LoadingScreen} />
    <Auth.Screen name="Register" component={RegisterScreen} />
    <Auth.Screen name="Onboarding" component={OnboardingScreen} />
    <Auth.Screen
      name="App"
      component={AppNavBar}
    />
    <Auth.Screen
      name="GuestApp"
      component={GuestAppNavBar}
    />
    <Auth.Screen
      name="Hub"
      component={HubScreen}
      options={{
        headerShown: false,
        headerLeft: () => null,
      }}
    />
  </Auth.Navigator>
);




export default function App() {

  return (
    <Provider store={store}>
      <RootSiblingParent>
        <TourGuideProvider
          androidStatusBarVisible={Platform.OS == 'ios' ? false : true}
          dismissOnPress={true}
        >
          <View style={{ flex: 1 }}>
            <StatusBar translucent transparent={false} />
            <NavigationContainer>
              <AuthStack />
            </NavigationContainer>
          </View>
        </TourGuideProvider>
      </RootSiblingParent>
    </Provider>
  );
}