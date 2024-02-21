import React, { useState, useEffect } from "react";
import { Icon } from "react-native-elements";
import { getIcon } from "../utils/getIcon";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from "react-native";

import { useSelector } from "react-redux";

function DeviceElement(props) {
  const [iconName, setIconName] = useState("");
  const [iconType, setIconType] = useState("");

  // Get specific device object and owner name
  const { sharedUsersData } = useSelector(state => state);
  const { sharedUsers } = sharedUsersData;

  const guest = sharedUsers[props.cardIndex];
  const device = sharedUsers[props.cardIndex]?.devices[props.deviceIndex];

  useEffect(() => {
    const { iconName, iconType } = getIcon(props.currDevice.type);
    setIconName(iconName);
    setIconType(iconType);
    //console.log("CURR DEVICE: " + JSON.stringify(props.currDevice))
  }, [props]);

  function handleClick() {
    if (props.screen == "Guests") {   
      props.navigation.navigate("Properties", {
        prevScreen: props.screen,
        guestIndex: props.cardIndex,
        deviceIndex: props.deviceIndex,
        navigation: props.navigation,
      });
    } else {
      props.navigation.navigate("DeviceControl", {
        hubIndex: props.cardIndex,
        deviceIndex: props.deviceIndex,
      });
    }
  }
  return (
    <View>
      <TouchableOpacity style={{ marginHorizontal: 1 }} onPress={handleClick}>
        <View style={styles.iconHolder}>
          <Icon name={iconName} type={iconType} size={45} color="#60B8FF" />
        </View>
        <Text style={styles.text}>{props.currDevice.name}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  iconHolder: {
    borderWidth: 2,
    borderColor: "#60B8FF",
    justifyContent: "center",
    borderRadius: 6,
    width: 70,
    height: 70,
  },
  text: {
    marginTop: 6,
    fontSize: 10,
    width: 70,
    textAlign: "center",
  },
});

export default DeviceElement;