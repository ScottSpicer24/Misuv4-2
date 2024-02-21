import { Auth } from "aws-amplify";
import React, { useEffect } from "react";
import { useIsFocused } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { connect } from "react-redux";
import ProfileCard from "../../components/cards/ProfileCard";
import SettingsCard from "../../components/cards/SettingsCard";
import YourHubCard from "../../components/cards/YourHubCard";
import { getHubInfoAction } from "../../redux/Actions/getHubInfoAction";
import { registerHubAction } from "../../redux/Actions/registerHubAction";
import { getSharedDevicesListAction } from "../../redux/Actions/getSharedDevicesListAction";
import * as SecureStore from "expo-secure-store";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Dimensions,
} from "react-native";
import { showToast } from "../../utils/toast";
import { ScrollView } from "react-native-gesture-handler";

var width = Dimensions.get("window").width; //full width
var height = Dimensions.get("window").height; //full height

function AccountScreen(props) {
  const isFocused = useIsFocused();

  useEffect(() => {
    props.getHub(props.sessionData.idToken);
    props.getList(props.sessionData.idToken);
  }, [isFocused]);

  async function deleteStorage() {
    await SecureStore.deleteItemAsync("username");
    await SecureStore.deleteItemAsync("password");
    return;
  }

  // Signs the user out and sends them back to the login screen
  const signOut = async () => {
    showToast("Signing out!");
    Auth.signOut()
      .then(() => {
        props.websocket.connection.client.close();
      })
      .then(() => {
        deleteStorage();
        props.navigation.navigate("Login", { username: null, password: null });
      });
  };

  return (

    <View style={styles.container}>
      <View style={{flex: 9, }}>
      <ScrollView style={{flex: 1 }}>

      <View style={{flex:1.8, height: height/5,padding: 10,}}>
        <ProfileCard/>
      </View>
      
      {props.sharedDevicesData.sharedDevices && (
        <YourHubCard navigation={props.navigation}/>
      )}
        <SettingsCard navigation={props.navigation}/>
          </ScrollView>
          </View>

        <View style={styles.logoutArea}>
          <TouchableOpacity
            style={styles.logout}
            onPress={signOut}
          >
            <Icon name="logout" size={32} style={{ color: "white" }} />
            <Text style={{fontSize: 17.5, color: "white"}}>Log out</Text>
          </TouchableOpacity>
        </View>
      {/* </View> */}
    </View>
  );
}

const mapStateToProps = (state) => {
  const { sessionData, sharedDevicesData, websocket } = state;

  return { sessionData, sharedDevicesData, websocket };
};

const mapDispatchToProps = (dispatch) => {
  return {
    register: (data, idToken) => dispatch(registerHubAction(data, idToken)),
    getHub: (idToken) => dispatch(getHubInfoAction(idToken)),
    getList: (idToken) => dispatch(getSharedDevicesListAction(idToken)),
  };
};

const styles = StyleSheet.create({ 
  container:{
    flex: 1,
    backgroundColor: "#E7E7E7",
    alignItems: "center",
    alignSelf: "stretch",
  },
  logoutArea:{
    flex: 1,
    alignItems: "flex-end",
    flexDirection: "row",
    alignSelf: 'center',
    width: "90%",
    marginBottom: 10,
  },
  logout: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: "#ea5f5f",
    borderRadius: 10,
    height: height / 15,
    width: "89%",
    alignItems: "center",
    justifyContent: "center",
  },

})

export default connect(mapStateToProps, mapDispatchToProps)(AccountScreen);
