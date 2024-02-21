import React, { useState } from "react";
import { connect } from "react-redux";
import { Icon } from "react-native-elements";
import { registerHubAction } from "../../redux/Actions/registerHubAction";
import { getHubInfoAction } from "../../redux/Actions/getHubInfoAction";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  Dimensions,
  Linking,
  ActivityIndicator,
  Alert,
} from "react-native";

var { height, width } = Dimensions.get("window"); //screen height width

function HubScreen(props) {
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [token, setToken] = useState(null);

  // ========================================================
  // To access status codes:
  // props.registerData.data.statusCode;
  // 405: invalid URL
  // 401: Invalid authentications
  // 400: Server Error
  // 502: Something Crashed
  // 200: No error
  // ========================================================
  const handleHubRegister = async () => {
    if (token == "" || token == null) {
      setError("Some fields have not been completed.");
      return;
    } else {
      setLoading(true);
      setError("");
      await props
        .register({ hub_token: token.trim(), }, props.sessionData.idToken)
        .then(async (res) => {
          if (res.statusCode === 200) {
            props.getHub(props.sessionData.idToken)
            setLoading(false);
            Alert.alert(
              "Almost There...",
              "For the final steps to fully set up your hub, please visit:\n\nwww.misu.com",
              [
                { text: "OK", onPress: () => handleNavigation() }
              ]
            );
          }
          else if (res.statusCode === 401)
            setError(res.message);
          else if (res.statusCode === 400 || res.statusCode === 502)
            setError("Server Error Occured, try again later.");
          else
            setError(
              "Unidentified Error: Please try again or contact our Support Team"
            );

          setLoading(false);
        })
        .catch((err) => setError(err));
    }
  };

  const handleNavigation = async () => {
    const hasLoggedIn = await AsyncStorage.getItem(
      props.sessionData.id + "_homeowner"
    );
    if (hasLoggedIn == null) {
      await AsyncStorage.setItem(props.sessionData.id + "_homeowner", "true");
      props.navigation.navigate("App");
    } else {
      props.navigation.pop();
    }
  };

  const openTab = (url) => {
    Linking.openURL(url)
      .then(props.navigation.pop())
      .catch((err) => console.log(err));
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={style.container}>
        <View style={[style.header]}>
          <Text style={{ marginTop: 10, fontWeight: "bold", fontSize: 30 }}>
            Register Your Hub
          </Text>

          <View style={style.cardContainer}>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              Smart Hub Provider
            </Text>
            <View style={style.card}>
              <Image
                style={{ width: 50, height: 50 }}
                source={require("../../assets/icons/ha_icon.png")}
              />
              <Text style={{ textAlign: "center" }}>Home Assistant</Text>
            </View>
          </View>
        </View>

        <View style={style.form}>
          <View style={style.formRow}>
            <TouchableOpacity
              onPress={() =>
                Linking.openURL(
                  "https://www.atomicha.com/home-assistant-how-to-generate-long-lived-access-token-part-1/"
                )
              }
            >
              <Icon
                name="question-circle"
                type="font-awesome-5"
                size={20}
                style={{ alignSelf: "center", marginRight: 10 }}
              />
            </TouchableOpacity>

            <View style={style.input}>
              <TextInput
                style={{ height: "100%", width: "90%", marginLeft: 15 }}
                multiline
                autoCapitalize="none"
                onChangeText={(e) => setToken(e)}
                value={token}
                placeholder="Hub Token"
                placeholderTextColor="#808080"
              />
            </View>
          </View>

          <Text style={style.error}>{error}</Text>
        </View>

        <View
          style={style.buttonArea}
        >
          <TouchableOpacity style={style.button} onPress={() => handleHubRegister()}>
            {isLoading ? (
              <ActivityIndicator size="small" color="#5BD3FF" />
            ) : (
              <View style={{ flexDirection: "row", alignItems: "center", }}>
                <Icon
                  name="home"
                  type="font-awesome-5"
                  color="white"
                  size={20}
                  style={{ marginRight: 10 }}
                />
                <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
                  Register Hub
                </Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[style.button, { backgroundColor: "#C8CDEC" }]}
            onPress={() => handleNavigation()}
          >
            <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
              Not Now
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
    alignItems: "center",
    alignSelf: "stretch",
    backgroundColor: "#EDF7FE",
  },
  header: {
    flex: 1,
    width: "100%",
    alignItems: "center",
  },
  button: {
    marginVertical: 10,
    backgroundColor: "#008CFF",
    flexDirection: "row",
    width: "90%",
    height: "30%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  cardContainer: {
    marginTop: 70,
  },
  card: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    width: 100,
    height: 100,
    borderRadius: 4,
    flexDirection: "column",
    alignSelf: "center",
    marginTop: 10,
  },
  buttonArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  error: {
    textAlign: "center",
    color: "red",
  },
  form: {
    flex: 1,
    marginTop: "20%",
    justifyContent: "center",
    height: height * 0.25,
    width: "100%",
    paddingHorizontal: 25,
    // backgroundColor: 'blue'
  },
  formRow: {
    flexDirection: "row",
    alignSelf: "stretch",
    alignContent: "center",
    alignItems: "center",
  },
  input: {
    flexDirection: "row",
    borderRadius: 10,
    borderWidth: 1,
    height: height * 0.15,
    backgroundColor: "#FFFFFF",
    borderColor: "#D6D6D6",
    alignItems: "center",
    width: "90%",
  },
  modalContainer: {
    padding: 12,
    flex: 0.45,
    backgroundColor: "#F1F1F1",
    borderRadius: 15,
    justifyContent: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
});

const mapStateToProps = (state) => {
  const { sessionData } = state;
  return { sessionData };
};

const mapDispatchToProps = (dispatch) => {
  return {
    register: (data, idToken) => dispatch(registerHubAction(data, idToken)),
    getHub: (idToken) => dispatch(getHubInfoAction(idToken)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HubScreen);
