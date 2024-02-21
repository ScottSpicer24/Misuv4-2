import { Auth } from "aws-amplify";
import React, { useState, useEffect } from "react";
import { useStateWithCallbackLazy } from "use-state-with-callback";
import { useIsFocused } from "@react-navigation/native";
import { connect } from "react-redux";
import { getCurrentSessionAction } from "../../redux/Actions/getCurrentSessionAction";
import appStyle from "../../styles/AppStyle";
import authStyle from "../../styles/AuthStyle";
import ForgotPasswordPopup from "../../components/popup/ForgotPasswordPopup";
import * as SecureStore from "expo-secure-store";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  ActivityIndicator,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
  StyleSheet,
  Keyboard,
  Dimensions,
} from "react-native";

var { height, width } = Dimensions.get("window"); //screen height and width

function LoginScreen(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useStateWithCallbackLazy("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoginLoading, setLoginLoading] = useState(false);
  const [forgotPasswordState, setForgotPasswordState] = useState(false);
  const [forgotPasswordConfirmState, setForgotPasswordConfirmState] = useState(false);
  const [confirmCode, setConfirmCode] = useState("");
  const [confirmingCode, setConfirmingCode] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    setLoginLoading(false)
    if (props.route.params != null) {
      if (
        props.route.params?.username != null &&
        props.route.params.password != null
      ) {
        setUsername(props.route.params.username);
        setPassword(props.route.params.password, () => {
          handleLogin();
        });
      }
    }
    else
      checkStorage();
  }, []);

  handleLogin = () => {
    setErrorMessage("");
    setLoginLoading(true)
    let str = username.split(" ").join("").toLowerCase();;
    if (str === "") {
      setErrorMessage("Missing email address");
      setLoginLoading(false)
    }
    else if (password === "") {
      setErrorMessage("Missing password");
      setLoginLoading(false)
    }
    else {
      try {
        Auth.signIn(str, password)
          .then(async () => {
            console.log("===== Login successful! =====");
            saveLogin(username, password);
            setErrorMessage("");
            // setIsLoading(false);
            // setLoginLoading(false);

            await props.getSession();

            setUsername("");
            setPassword("", () => { props.navigation.navigate("Loading") });
          })
          .catch((err) => {
            if (!err.message.includes("pending")) {
              setErrorMessage(err.message);
            }
            setMessage("");
            setLoginLoading(false)
            setIsLoading(false);
          });
      } catch (err) {
        if (!err.message.includes("pending")) {
          setErrorMessage(err.message);
        }
        setMessage("");
        setLoginLoading(false);
        setIsLoading(false);
      }
      setTimeout(() => setLoginLoading(false), 3000);
      setIsLoading(false);
    }
  };

  async function saveLogin(saveUsername, savePassword) {
    await SecureStore.setItemAsync("username", saveUsername);
    await SecureStore.setItemAsync("password", savePassword);
  }

  async function checkStorage() {
    let user = await SecureStore.getItemAsync("username");
    let pass = await SecureStore.getItemAsync("password");
    if (user != null && pass != null) {
      setUsername(user);
      setPassword(pass, () => {
        handleLogin();
      });
    }
  }

  // Verify sign up code
  confirmSignUp = () => {
    console.log("Attempting to confirm sign up: " + confirmCode)
    setErrorMessage("");
    setMessage("");

    let str = username.split(" ").join("").toLowerCase();
    console.log(str);

    // Form validation
    if (str == "") {
      setMessage("Please enter the email you're verifying");
      setErrorMessage("");
    } else if (confirmCode == "") {
      setMessage("Please enter the code sent to your email");
      setErrorMessage("");
    } else {
      setIsLoading(true);
      Auth.confirmSignUp(str, confirmCode)
        .then(() => {
          console.log("confirmed sign up successful!");
          setErrorMessage("");
          setMessage("Confirm successful, please sign in.");
          setIsLoading(false);
          setConfirmingCode(false);
        })
        .catch((err) => {
          setErrorMessage(err.Message || "Confirmation Error: Please try again.");
          setMessage("");
          setIsLoading(false);
          console.log("error: " + err.Message);
        });
    }
  };

  // Complete the forgot password auth
  forgotPassword = (username) => {
    setErrorMessage("");
    setMessage("");
    setForgotPasswordState(false);

    let str = username.split(" ").join("").toLowerCase();
    // Form validation
    if (str == "") {
      setMessage("Please enter the email address of your account");
      setErrorMessage("");
    } else {
      setIsLoading(true);
      Auth.forgotPassword(str)
        .then(() => {
          setErrorMessage("");
          setMessage("Request successful, check your email for further instructions.");
          setIsLoading(false);
        })
        .catch((err) => {
          setErrorMessage(err.message);
          setMessage("");
          setIsLoading(false);
        });
      setIsLoading(false);
    }
  };

  // Complete the forgot password auth
  forgotPasswordConfirm = () => {
    setErrorMessage("");
    setMessage("");

    console.log("attempting to confirm password " + username + ", " + confirmCode + ", " + password);

    // Form validation
    let str = username.split(" ").join("");

    if (str == "") {
      setMessage("Please enter the email address of your account");
      setErrorMessage("");
    } else {
      setIsLoading(true);
      Auth.forgotPasswordSubmit(str, confirmCode, password)
        .then(() => {
          console.log("forgot password successful!");

          setErrorMessage("");
          setMessage("Reset successful, login with your new credentials.");
          setIsLoading(false);
        })
        .catch((err) => {
          setErrorMessage(err.message);
          setMessage("");
          setIsLoading(false);
        });
      setIsLoading(false);
    }
    setForgotPasswordConfirmState(false);
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

  // Forgot Pasword Modal Popup
  let forgotPasswordPopupElement = null;
  if (forgotPasswordState) {
    forgotPasswordPopupElement = (
      <ForgotPasswordPopup
        onCancel={() => setForgotPasswordState(false)}
        onSubmit={forgotPassword}
        username={username}
      />
    );
  }

  // The message element will be set if there is actually an error
  let messageElement = null;
  if (message) {
    messageElement = (
      <View style={authStyle.message}>
        {message && <Text style={authStyle.message}>{message}</Text>}
      </View>
    );
  }

  // The error element will be set if there is actually an error
  let errorElement = null;
  if (errorMessage) {
    errorElement = (
      <View style={authStyle.errorMessage}>
        {errorMessage && (
          <Text style={authStyle.errorMessage}>{errorMessage}</Text>
        )}
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[styles.container, {}]}>
        {/* Render the header (logo and welcome text) */}
        <View style={{ flex: 1 }}>
          <View style={[styles.iconHolder]}>
            <Image
              style={styles.icon}
              source={require("../../assets/MISUv2.png")}
            />

            <Text style={styles.greeting}>
              Welcome to
              <Text style={styles.appName}> MiSu</Text>
            </Text>
          </View>
        </View>

        {/* Render the login form */}
        <View style={[styles.authForm, {}]}>

          <View>
            <View style={styles.iconAndInput}>
              <View style={styles.iconInput}>
                <MaterialCommunityIcons name="email" size={26} />
              </View>

              <TextInput
                style={styles.formInput}
                keyboardType={'email-address'}
                returnKeyType={'next'}
                autoCapitalize="none"
                onChangeText={(username) => setUsername(username)}
                value={username}
                onSubmitEditing={() => secondTextInput.focus()}
                placeholder="Email Address"
                placeholderTextColor="#808080"
              ></TextInput>
            </View>

            {!confirmingCode && (
              <View style={styles.iconAndInput}>
                <View style={styles.iconInput}>
                  <MaterialCommunityIcons name="lock" size={26} />
                </View>

                <TextInput
                  style={styles.formInput}
                  ref={(input) => { secondTextInput = input }}
                  onSubmitEditing={() => handleLogin()}
                  secureTextEntry
                  autoCapitalize="none"
                  onChangeText={(password) => setPassword(password)}
                  value={password}
                  placeholder={
                    forgotPasswordConfirmState ? "New Password" : "Password"
                  }
                  placeholderTextColor="#808080"
                ></TextInput>
              </View>
            )}

            {(confirmingCode || forgotPasswordConfirmState) && (
              <View style={styles.iconAndInput}>
                <View style={styles.iconInput}>
                  <Image source={require("../../assets/icons/lock.png")} />
                </View>
                <TextInput
                  style={styles.formInput}
                  keyboardType="numeric"
                  autoCapitalize="none"
                  onChangeText={(code) => setConfirmCode(code)}
                  value={confirmCode}
                  placeholder="Confirm Code"
                  placeholderTextColor="#808080"
                ></TextInput>
              </View>
            )}
          </View>

          {/* Render the forgot password btn */}

          {!forgotPasswordConfirmState && (
            <View>
              <TouchableOpacity style={{
                padding: 10,
                alignSelf: 'flex-end',
              }}
                onPress={() => {
                  setErrorMessage("");
                  setMessage("");
                  setForgotPasswordState(true);
                }}>
                <Text style={{ color: "#008CFF", fontWeight: 'bold' }} Password>
                  Forgot Password?
                </Text>
              </TouchableOpacity>
            </View>
          )}

        </View>


        <View style={{ flex: 1, }}>
          {/* Render the submit button */}
          <View style={{ flex: 2, marginVertical: 20 }}>
            <View style={styles.authFormButtonHolder}>
              <TouchableOpacity style={styles.loginButton}
                onPress={() => {
                  setErrorMessage("");
                  setMessage("");
                  (confirmingCode) ? confirmSignUp() : (forgotPasswordConfirmState) ? forgotPasswordConfirm() : handleLogin();
                }}
              >

                {isLoginLoading ?
                  <ActivityIndicator size="small" color="#7DEA7B" />
                  :
                  <Text style={{ color: "#FFF", fontSize: 25 }}>
                    {confirmingCode ? "Confirm" : forgotPasswordConfirmState ? "Reset" : "Login"}
                  </Text>
                }
              </TouchableOpacity>
            </View>


            {!forgotPasswordConfirmState && (
              <View style={{ flex: 2 }}>

                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ marginLeft: 20, flex: 1, height: 1, backgroundColor: '#B2B2B2' }} />
                  <View>
                    <Text style={{ width: 50, textAlign: 'center', color: "#B2B2B2" }}>or</Text>
                  </View>
                  <View style={{ marginRight: 20, flex: 1, height: 1, backgroundColor: '#B2B2B2' }} />
                </View>


                {/* Render the Sign Up Button */}
                <View style={styles.authFormButtonHolder}>
                  <TouchableOpacity
                    style={[styles.loginButton, { backgroundColor: '#353535' }]}
                    onPress={() => {
                      setErrorMessage("");
                      setMessage("");
                      props.navigation.navigate("Register")
                    }}
                  >
                    <Text style={{ color: "#FFF", fontSize: 25 }}>
                      Sign up
                    </Text>
                  </TouchableOpacity>
                </View>

              </View>
            )}
          </View>
          {/* Render the error message */}
          {errorElement}

          {/* Render the message */}
          {messageElement}

          {/* Render the forgot popup */}
          {forgotPasswordPopupElement}

          {/* Render the forgot confirm popup */}
          {/* {forgotPasswordConfirmPopupElement} */}

          {/* Render the register toggle */}


          {/* Render the confirm forgot password btn */}
          <View style={{ flex: 1, marginTop: 10 }}>
            <TouchableOpacity style={{ alignSelf: "center", marginVertical: 7 }}
              onPress={() => {
                setErrorMessage("");
                setMessage("");
                confirmingCode ? setConfirmingCode(false) : setConfirmingCode(true); setForgotPasswordConfirmState(false);
              }}
            >
              <Text style={{ color: "#414959", fontSize: 13 }} Password>
                {confirmingCode ? "Already Confirmed? " : "Have an Account Verification code? "}
                <Text style={{ color: "#71ccf0", fontWeight: "500" }}>
                  Click Here
                </Text>
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ alignSelf: "center" }}
              onPress={() => {
                setErrorMessage("");
                setMessage("");

                forgotPasswordConfirmState
                  ? setForgotPasswordConfirmState(false)
                  : setForgotPasswordConfirmState(true);
                setConfirmingCode(false);
              }}
            >
              <Text style={{ color: "#414959", fontSize: 13 }} Password>
                {forgotPasswordConfirmState
                  ? "Go back to Login "
                  : "Have a Password reset code? "}
                <Text style={{ color: "#71ccf0", fontWeight: "500" }}>
                  Click Here
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Render the loading element */}
        {loadingElement}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  appName: {
    fontWeight: "bold",
  },
  authForm: {
    flex: 0.6,
    justifyContent: "center",
    marginHorizontal: 20,
  },
  authFormButtonHolder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  formInput: {
    fontSize: 15,
    marginLeft: 20,
    height: 50,
    width: 280,
  },
  icon: {
    height: height / 3,
    width: height / 3,
    alignSelf: 'center',
    alignContent: 'center',
    alignItems: 'center',
    marginBottom: -30,
  },
  iconInput: {
    marginLeft: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  iconHolder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: 'center',
  },
  iconAndInput: {
    flexDirection: "row",
    borderRadius: 10,
    backgroundColor: "#F3F3F3",
    borderColor: "#D6D6D6",
    borderWidth: 1,
    height: height * 0.065,
    marginVertical: 7,
    alignItems: "center",
  },
  loginButton: {
    backgroundColor: "#00B3FF",
    borderRadius: 10,
    height: height / 15,
    width: "89%",
    alignItems: "center",
    justifyContent: "center",
  },
  greeting: {
    fontSize: 20,
    textAlign: 'center',
    fontWeight: '300',
  },
});

const mapDispatchToProps = (dispatch) => {
  return {
    getSession: () => dispatch(getCurrentSessionAction()),
  };
};

export default connect(undefined, mapDispatchToProps)(LoginScreen);
