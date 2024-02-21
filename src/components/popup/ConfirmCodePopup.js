import React, { Component } from 'react';
import { View, TextInput, Modal, TouchableOpacity, Text } from 'react-native';
import appStyle from '../../styles/AppStyle';

class ConfirmCodePopup extends Component {
    constructor(props) {
        super(props);
    }
    // Holds all of our global variables
    state =
        {
            username: "",
            authCode: "",
        }

    // Called when when the screen is about to load, use the username from the props for the username
    componentDidMount() {
        this.setState({ username: this.props.username });
    }

    render() {

        return (
            <Modal
                backdropOpacity={1}
                onBackdropPress={() => this.props.onCancel(false)}
                backdropColor={"#00000080"}
                animationType={'slide'}
                swipeDirection='down'
                transparent={true}
            >
                <TouchableOpacity onPress={() => this.props.onCancel()}>
                    <View style={appStyle.modalOverlay} />
                </TouchableOpacity>

                <View style={appStyle.popup}>
                    <View style={appStyle.container}>
                        {/* Title */}
                        <Text style={{ fontSize: 24.5 }}> Enter Confirm Code </Text>

                        {/* Render the login form */}
                        <View style={appStyle.container}>
                            <TextInput
                                style={appStyle.formInput}
                                autoCapitalize="none"
                                onChangeText={username => this.setState({ username })}
                                value={this.state.username}
                                placeholderTextColor="#808080"
                                placeholder="Email"/>

                            <TextInput
                                style={appStyle.formInput}
                                autoCapitalize="none"
                                keyboardType='numeric'
                                onChangeText={authCode => this.setState({ authCode })}
                                value={this.state.authCode}
                                placeholder="Confirm Code"/>
                        </View>

                        {/* Render the submit button */}
                        <TouchableOpacity style={appStyle.regularButton} onPress={() => this.props.onSubmit(this.state.username, this.state.authCode)} >
                            <Text style={{color: 'white', fontSize: 17.5}}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        );
    }
}

export default ConfirmCodePopup;