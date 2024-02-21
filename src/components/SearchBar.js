import React from "react";
import {
  StyleSheet,
  View,
  TextInput,
} from "react-native";

import { Icon } from "react-native-elements";

function SearchBar(props) {
  const barWidth = props.screen == "Guests" ? "65%" : "100%";

  const styles = StyleSheet.create({
    container: {
      height: 45,
      width: barWidth,
      justifyContent: "center",
      paddingLeft: 20,
      borderRadius: 10,
      backgroundColor: "white",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
    },
    icon: {
      marginLeft: 0,
    },
    formInput: {
      color: 'grey',
      marginLeft: 10,
      fontSize: 18,
      width: "80%",
    },
  });

  return (
    <View style={styles.container}>
      <Icon name="search" style={styles.icon} size={28} color='grey'/>
      <TextInput
        style={styles.formInput}
        autoCapitalize="none"
        onChangeText={(searchParam) => props.setSearchParam(searchParam)}
        placeholder={
          "Search " + (props.screen == "Guests" ? "Guests" : (props.screen == "Devices" ? "Devices" : "Hubs")) + "..."
        }
        placeholderTextColor="#808080"
      ></TextInput>
    </View>
  );
}

export default SearchBar;
