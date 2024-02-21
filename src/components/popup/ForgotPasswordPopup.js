import React, { useState, useEffect } from "react";
import { Text, View, Dimensions, TextInput, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import appStyle from '../../styles/AppStyle';
import GuestElement from "../GuestElement";

var width = Dimensions.get("window").width; //full width
var height = Dimensions.get("window").height; //full height

// class ForgotPasswordPopup extends Component {
function ForgotPasswordPopup(props) {
    
    const [email, setEmail] = useState('');
    const [authCode, setAuthCode] = useState('');
    const [errorMsg, setErrorMsg] = useState("");
    const emailRegEx =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    // Called when when the screen is about to load, use the username from the props for the username

    return (
        <Modal
            transparent={true}
            backdropOpacity={1}
            onSwipeComplete={() => props.onCancel(false)}
            onBackdropPress={() => props.onCancel(false)}
            backdropColor={"#00000080"}
            animationType={'slide'}
            swipeDirection='down'
        >
            <TouchableOpacity onPress={() => props.onCancel()}>
                <View style={appStyle.modalOverlay} />
            </TouchableOpacity>

            <View style={appStyle.popup}>
                <View style={styles.container}>
                    {/* Title */}
                    <Text style={{ fontSize: 24.5 }}>Enter your Email Address</Text>

                    {/* Render the form */}
                    <View style={styles.input}>
                        <TextInput
                            style={styles.formInput}
                            autoCapitalize="none"
                            onChangeText={email => setEmail(email)}
                            value={email}
                            placeholder="Email">
                        </TextInput>
                    </View>

                    <Text style={{color: 'red'}}>{errorMsg}</Text>

                    {/* Render the submit button */}
                    <TouchableOpacity style={styles.regularButton} 
                        onPress={() => {
                            emailRegEx.test(email)
                            ? props.onSubmit(email)
                            : setErrorMsg("Not a Valid Email Address")
                        }}
                        >
                        <Text style={{fontSize: 20,color: '#FFF'}}>Confirm</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 5,
        alignItems: 'center'
    },
    regularButton: {
        backgroundColor: "#008CFF",
        marginTop: 10,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
        width: width * 0.78,
        height: 50,
      },
      formInput: {
        fontSize: 15,
        marginLeft: 20,
        height: 50,
        width: 280,
      },
      input: {
        flexDirection: "row",
        borderRadius: 10,
        backgroundColor: "#F3F3F3",
        borderColor: "#D6D6D6",
        borderWidth: 1,
        height: height * 0.05,
        marginVertical: 7,
        alignItems: "center",
      },
})

export default ForgotPasswordPopup;