import React from "react";
import { View, TouchableOpacity, Text, StyleSheet, Image, Platform } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { LogCard } from "./cards/LogCard";

const Logo = () =>  {

  return (
    <View style={styles.image}>
      <Image
        style={styles.tinyLogo}
        source={require("../assets/MISUv2.png")}
      />
    </View>
  );
};

const Filter = () =>  {

  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity onPress={() => openModal()}>
        <View style={styles.button}>
          <Icon name="sliders" type="feather" color="#008CFF" />
          <Text style={{ marginLeft: 8 }}>Filter</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const Header = (props) => {

  return (
      <View style={styles.header}>
        <Text style={styles.headerText}>{props.title}</Text>
      </View>
  )    
};

const ViewToggle = (props) => {

  if(props.guestView){
    return (
      <View>
        <TouchableOpacity onPress={() => props.navigation.navigate("Device")} style={styles.toggle} >
          <View>
            <Icon name="grid" size={32} color="#1a1a1a" />
          </View>
        </TouchableOpacity>
      </View>
    );
  }
  return (
    <View>
      <TouchableOpacity onPress={() => props.navigation.goBack()} style={styles.toggle} >
        <View>
          <Icon name="users" size={32} color="#1a1a1a" />
        </View>
      </TouchableOpacity>
    </View>
  );

};

const styles = StyleSheet.create({
  contianer:{
    flex: 1,
  },
  title: {
    flex: 1,
    backgroundColor: "transparent",
  },
  button: {
    backgroundColor: "pink",
    height: 40,
    width: 100,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    flexDirection: "row",
  },
  header: {
    alignSelf: 'center',
  },
  headerText: {
    fontSize: 25,
    fontWeight: "normal",
    color: "#242424",
  },
  tinyLogo: {
    width: 70,
    height: 70,
  },
  image: {
    marginBottom: Platform.OS === 'ios' ? 10 : null,
  },
  toggle: {
    marginRight: 15,
  },
});


export default Header;
export {Header, Logo, ViewToggle, Filter};
