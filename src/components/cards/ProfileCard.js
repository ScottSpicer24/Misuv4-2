import React from "react";
import { StyleSheet, View, Text } from "react-native";
import UserAvatar from "react-native-user-avatar";
import { useSelector } from "react-redux";

function ProfileCard() {
  const { hubInfoData } = useSelector(state => state)
  return (
    <View style={style.container}>
      <View style={style.rowInformation}>
        <View style={style.profileIcon}>
          <UserAvatar size={70} borderRadius={41} name={hubInfoData.name} />
        </View>
        <View style={style.infoLine}>
          <Text style={style.name}>
            {hubInfoData.name} {hubInfoData.lastName}{" "}
          </Text>
          <Text style={style.info}>{hubInfoData.email}</Text>
        </View>
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    // paddingLeft: 10,
    justifyContent: 'center',
    borderBottomColor: "#828282",
    borderBottomWidth: 0.9,
  },
  editBox: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    right: 15,
    justifyContent: "flex-end",
    width: 50,
    height: 25,
  },
  gear: {
    height: 16,
    width: 16,
    marginRight: 5,
  },
  profileIcon: {

    marginTop: 1,
  },
  name: {
    fontSize: 26,
    fontWeight: "bold",
    marginLeft: 8,
  },
  header: {
    color: "gray",
    fontSize: 22,
    paddingLeft: 12,
    fontWeight: "bold",
  },
  headerLine: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    width: "100%",
  },
  subHeader: {
    fontWeight: "bold",
    fontSize: 15,
    width: 100,
    paddingLeft: 15,
  },
  rowInformation: {
    flexDirection: "row",
    marginLeft: 15,
    // marginTop: 30,
  },
  info: {
    marginLeft: 10,
    fontSize: 15.5,
  },
  infoLine: {
    width: "75%",
    flexDirection: "column",
    marginLeft: 15,
    marginVertical: 7,
    marginBottom: 5,
  },
});

export default ProfileCard;