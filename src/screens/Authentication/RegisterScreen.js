import React, { useState } from "react";
import { Auth } from "aws-amplify";
import appStyle from "../../styles/AppStyle";
import authStyle from "../../styles/AuthStyle";
import ConfirmCodePopup from "../../components/popup/ConfirmCodePopup";
import { Icon } from "react-native-elements";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ActivityIndicator,
  KeyboardAvoidingView,
  Keyboard,
  Dimensions,
  Platform,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";

var width = Dimensions.get("window").width; //full width
var height = Dimensions.get("window").height; //full height

function RegisterScreen(props) {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [confirmingCode, setConfirmCode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [accessLevel, setAccess] = useState("");

  const handleSignUp = async () => {
    const passwordRegex = new RegExp("^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$", "g");
    setErrorMessage("");
    setIsLoading(true);
    if (name === "") setErrorMessage("Missing name");
    else if (username === "") setErrorMessage("Missing email address");
    else if (password === "") setErrorMessage("Missing password");
    else if (passwordConfirm == "" || password != passwordConfirm) setErrorMessage("Re-check confirm password field");
    else if (accessLevel === "") setErrorMessage("Please choose a user type");
    else if (passwordRegex.test(password) == false)
      setErrorMessage(
        "Password must contain 8 characters, a number, a symbol, an upper case letter, and a lower case letter"
      );
    else {
      console.log("Attempting sign-up");
      console.log(name, username, password, passwordConfirm);
      Auth.signUp({
        username,
        password,
        attributes: {
          name,
          email: username,
          phone_number: "+11111111111",
          address: "null",
          "custom:user_type": accessLevel === "Owner" ? "1" : "0",
        },
      })
        .then((response) => {
          setErrorMessage(null);
          setMessage("A confirmation code was sent to your email!");
          setErrorMessage("");
          setConfirmCode(true);
          console.log("Successful signup!");
          console.log(response);
        })
        .catch((error) => {
          setErrorMessage(error.message);
          console.log("==ERROR DURING SIGNUP PROCESS==", error.message);
        });
    }
    setIsLoading(false);
  };

  // Verify sign up code
  const confirmSignUp = async (username, authCode) => {
    setErrorMessage("");
    setMessage("");

    // Form validation
    if (username == "") {
      setMessage("Please enter the email you're verifying");
      setErrorMessage("");
    } else if (authCode == "") {
      setMessage("Please enter the code sent to your email");
      setErrorMessage("");
    } else {
      setIsLoading(true);
      Auth.confirmSignUp(username, authCode)
        .then(() => {
          console.log("confirmed sign up successful!");
          setErrorMessage("");
          setConfirmCode(false);
          setMessage("Confirm successful, please sign in.");
          props.navigation.navigate("Login", {
            username: username,
            password: password,
          });
          setIsLoading(false);
        })
        .catch((err) => {
          setErrorMessage(err.message);
          setMessage("");
          setIsLoading(false);
          console.log("error: " + err.Message);
        });
    }
  };

  // The loading element will restrict input during networked operations
  let loadingElement = null;
  if (isLoading) {
    loadingElement = (
      <View style={[appStyle.loadingHolder]}>
        <ActivityIndicator size="large" style={[appStyle.loadingElement]} />
      </View>
    );
  }

  // The error element will be set if there is actually an error
  let errorElement = null;
  if (errorMessage) {
    errorElement = (
      <View style={{...authStyle.errorMessage, marginBottom: 10}}>
        {errorMessage && (
          <Text style={authStyle.errorMessage}>{errorMessage}</Text>
        )}
      </View>
    );
  }

  // The message element will be set if there is actually an error
  let messageElement = null;
  if (message) {
    messageElement = (
      <View style={{...authStyle.message, marginBottom: 20}}>
        {message && <Text style={authStyle.message}>{message}</Text>}
      </View>
    );
  }

  // The confirm code popup will appear if there is actually an error
  let confirmPopupElement = null;
  if (confirmingCode) {
    confirmPopupElement = (
      <ConfirmCodePopup
        onCancel={() => setConfirmCode(false)}
        onSubmit={confirmSignUp}
        username={username}
      />
    );
  }

  // checks the password complexity as it is being filled
  let passwordErrorElement = null;
  if (password) {
    // regex for all five complexity requirements
    let passwordPolicy = [
      RegExp(".{8,}$", "g"),
      RegExp("[A-Z]", "g"),
      RegExp("[a-z]", "g"),
      RegExp("[0-9]", "g"),
      RegExp("\\W", "g"),
    ];
    // matching error messages
    let passwordPolicyMessages = [
      "Password must contain atleast 8 characters",
      "Password must contain atleast 1 upper case character",
      "Password must contain atleast 1 lower case character",
      "Password must contain atleast 1 number",
      "Password contain atleast 1 symbol",
    ];
    // empty string to hold the error messages put to the screen
    var passwordPolicyErrorString = "";

    for (var i = 0; i < passwordPolicy.length; i++) {
      if (!passwordPolicy[i].test(password)) {
        passwordPolicyErrorString += passwordPolicyMessages[i] + "\n";
      }
    }

    if (passwordPolicyErrorString != "")
      passwordErrorElement = (
        <View style={{}}>
          <Text style={{ color: "red", justifyContent: "center", alignSelf: "center" }}>
            {passwordPolicyErrorString}
          </Text>
        </View>
      );
  }

  const userTypeSelection = () => {
    return (
      <View style={{ flex: 1, flexDirection: "row", justifyContent: "center", alignItems: 'center' }}>
        <View style={{ flex: 3, alignContent: 'center' }}>
          <TouchableOpacity
            style={{
              backgroundColor: "#7DEA7B",
              borderWidth: accessLevel == "Guest" ? 3 : 0,
              ...styles.userTypeButton
            }}
            onPress={() => setAccess("Guest")}>
            <Icon name="user" size={35} type="feather" color="white" />
            <Text style={{ color: "white", fontWeight: 'bold' }}>Guest</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, alignSelf: 'center' }}>
          <Text style={{ fontSize: 17, alignSelf: "center", color: "#B2B2B2", fontWeight: "bold" }}>
            OR
          </Text>
        </View>
        <View style={{ flex: 3, alignContent: 'center' }}>
          <TouchableOpacity
            style={{
              backgroundColor: "#5BD3FF",
              borderWidth: accessLevel == "Owner" ? 3 : 0,
              ...styles.userTypeButton
            }}
            onPress={() => setAccess("Owner")}>
            <Icon name="home" size={35} color="#FFF" />
            <Text style={{ color: "#FFF", fontWeight: 'bold' }}>Owner</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView enabled={false} style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : null}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        {/* <ScrollView style={{height}}> */}
          <View style={styles.container}>
            {/* Render the loading element */}
            {loadingElement}

            {/* Render the Confirm Popup */}
            {confirmPopupElement}

            <View style={{ flex: 1.8, justifyContent: 'center' }}>
              {/* Render the app icon */}
              <View style={authStyle.iconHolder}>
                <Image style={styles.icon} source={require("../../assets/MISUv2.png")} />
              </View>

              {/* Render the greeting */}
              <Text style={styles.greeting}>
                {`Create your`}
                <Text style={authStyle.appName}> {"MiSu"} </Text>
                account
              </Text>
            </View>

            {/* Render the Auth Form */}
            <View style={{ flex: 3.5 }}>
              <View style={styles.authForm}>
                <View style={styles.authInput}>
                  <TextInput
                    style={styles.authText}
                    returnKeyType={'next'}
                    onChangeText={(name) => setName(name)}
                    onSubmitEditing={() => emailInput.focus() }
                    autoCapitalize="words"
                    placeholderTextColor="#808080"
                    value={name}
                    placeholder={"Name"}
                  />
                </View>

                <View style={styles.authInput}>
                  <TextInput
                    style={styles.authText}
                    returnKeyType={'next'}
                    keyboardType={'email-address'}
                    ref={(input) => {emailInput = input}}
                    onSubmitEditing={() => passwordInput.focus() }
                    onChangeText={(text) => setUsername(text)}
                    autoCapitalize="none"
                    placeholderTextColor="#808080"
                    value={username}
                    placeholder={"Email Address"}
                  />
                </View>

                <View style={styles.authInput}>
                  <TextInput
                    style={styles.authText}
                    returnKeyType={'next'}
                    ref={(input) => {passwordInput = input}}
                    onSubmitEditing={() => retypeInput.focus() }
                    onChangeText={(text) => setPassword(text)}
                    secureTextEntry
                    autoCapitalize="none"
                    placeholderTextColor="#808080"
                    value={password}
                    placeholder={"Password"}
                  />
                </View>
                <View style={styles.authInput}>
                  <TextInput
                    style={styles.authText}
                    ref={(input) => {retypeInput = input}}
                    // onSubmitEditing={() => retypeInput.focus() }
                    onChangeText={(passwordConfirm) => setPasswordConfirm(passwordConfirm)}
                    secureTextEntry
                    autoCapitalize="none"
                    placeholderTextColor="#808080"
                    value={passwordConfirm}
                    placeholder={"Re-Type Password"}
                  />
                </View>

                <View style={authStyle.passwordError}>{passwordErrorElement}</View>
              </View>

              <View style={{ flex: 0.3, alignItems: 'center' }}>
                <Text style={{ fontSize: 17, fontWeight: 'bold', color: '#B2B2B2' }}>
                  Please Select What Type of User You Are
                </Text>
              </View>
              {userTypeSelection()}
            </View>

            {/* Render the submit button  */}
            <View style={{ flex: 0.7, marginTop: 10, alignSelf: 'center', justifyContent: 'center' }}>
              <View style={[styles.authFormButtonHolder, { marginVertical: 15, }]}>
                <TouchableOpacity style={styles.authFormButton} onPress={handleSignUp}>
                  <Text style={{ color: "#FFF", fontWeight: "600", fontSize: 22 }}>
                    Create Account
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={{ flex: 1, justifyContent: "center" }}>
              {/* Render the error message */}
              {errorElement}
              {/* Render the message */}
              {messageElement}
              {/* Render the register toggle */}
              <TouchableOpacity style={{ alignSelf: 'center' }}
                onPress={() => props.navigation.navigate("Login")}
              >
                <Text style={{ color: "#414959", fontSize: 13 }} Password>
                  Already have an account?{" "}
                  <Text style={{ color: "#71ccf0", fontWeight: "500" }}>
                    Sign In
                  </Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        {/* </ScrollView> */}
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFF'
  },
  authForm: {
    flex: 2.7,
    justifyContent: 'center',
    marginHorizontal: 20,
  },
  authText: {
    width: width * 0.8
  },
  authFormButtonHolder: {
    flex: 1,
    alignItems: 'center',
  },
  authInput: {
    paddingHorizontal: 20,
    flexDirection: "row",
    borderRadius: 10,
    backgroundColor: "#F3F3F3",
    borderColor: "#D6D6D6",
    borderWidth: 1,
    height: height * 0.05,
    marginVertical: 7,
    alignItems: "center",
  },
  icon: {
    height: 215,
    width: 225,
    marginBottom: -45,
  },
  greeting: {
    fontSize: 20,
    textAlign: 'center',
    fontWeight: '300',
  },
  authFormButton: {
    backgroundColor: '#008CFF',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: height / 13,
    width: width * 0.87
  },
  userTypeButton: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    width: height / 7,
    height: height / 10,
    borderRadius: 10,
    borderColor: "#00B3FF",
  },
});

export default RegisterScreen;
