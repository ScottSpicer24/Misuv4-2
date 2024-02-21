import React from "react";
import UserAvatar from 'react-native-user-avatar';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from "react-native";

function GuestElement(props) {
  return (
    <View>
      <TouchableOpacity
        onPress={() =>
          props.navigation.navigate("Properties", {
            prevScreen: props.screen,
            deviceIndex: props.cardIndex,
            guestIndex: props.guestIndex,
            navigation: props.navigation,
          })
        }
      >
        <View style={styles.iconHolder}>
          <UserAvatar size={70} borderRadius={41} name={props.currGuest.name} />
        </View>
      </TouchableOpacity>
      <Text style={styles.text}>{props.currGuest.name} </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  iconHolder: {
    justifyContent: "center",
    alignSelf: "center",
    borderColor: "#60b8ff",
    borderWidth: 0,
    borderRadius: 41,
    width: 70,
    height: 70,
  },
  text: {
    fontSize: 13,
    width: 70,
    color: "black",
    textAlign: "center",
  },
});

export default GuestElement;