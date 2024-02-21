import { StyleSheet } from "react-native";

const LogStyle = StyleSheet.create({
  avLeft: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    marginLeft: 5,
  },
  container: {
    backgroundColor: "#EAE9E9",
    flex: 1,
    padding: 12.5,
    alignItems: "center",
    alignSelf: "stretch",
  },
  mainLog: {
    alignItems: "stretch",
    marginHorizontal: -5,
  },
  card: {
    justifyContent: "flex-start",
    alignSelf: "stretch",
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 10,
    shadowRadius: 20.41,
    // borderBottomWidth: 3,
    // borderBottomColor: "#a8a8a8",
    elevation: 4,
    paddingTop: 10,
    paddingBottom: 10,
    marginBottom: 5,
  },
  Lcard: {
    flex: 1,
    alignSelf: 'center',
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    // borderBottomWidth: 3,
    // borderBottomColor: "#a8a8a8",
    paddingTop: 3,
    paddingLeft: 5,
    // paddingRight: 5,
    marginBottom: 10,
  },
  dispcard: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "red",
  },
  img: {
    width: 30,
    height: 30,
    marginRight: 20,
    borderRadius: 150,
  },
  rowLeft: {
    flexDirection: "row",
    alignSelf: "flex-start",
    fontWeight: "bold",
    fontSize: 20,
    paddingBottom: 14,
  },
  textLog: {
    flex: 1,
    marginLeft: 50,
    marginTop: -40,
    flexWrap: "wrap",
    paddingRight: 50,
  },
});

export default LogStyle;
