import React, { useState, useEffect } from "react";
import { TouchableOpacity } from "react-native";
import { FlatList, View, StyleSheet, Text, Dimensions, Image } from "react-native";
import LogEntry from "./ListEntries/LogEntry";
import Modal from "react-native-modal";
import Collapsible from "react-native-collapsible";
import { Icon } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import { useIsFocused } from "@react-navigation/native"

var width = Dimensions.get("window").width; //full width
var height = Dimensions.get("window").height; //full height

function LogCard(props) {
  const [isVisible, setIsVisible] = useState(false);
  const [collapsed, setCollapsed] = useState(true);
  const [collapsedGuests, setCollapsedGuests] = useState(true);
  const [collapsedDevices, setCollapsedDevices] = useState(true);
  const [mainCollapsedGuests, setMainCollapsedGuests] = useState(true);
  const [mainCollapsedHubs, setMainCollapsedHubs] = useState(true);
  const [guestToMap, setGuestToMap] = useState(null);
  const [deviceToMap, setDeviceToMap] = useState(null);
  const [filterSel, setFilterSel] = useState("");
  const [truePersonFil, setTruePersonFil] = useState("");
  const [filterDevSel, setFilterDevSel] = useState("");
  const [trueDevFil, setTrueDevFil] = useState("");
  const [deviceSelected, setDeviceSelected] = useState(false);
  const [hubGuestselected, setHubGuestSelected] = useState(false);
  const [apply, setApply] = useState(false);
  const [selected, setSelected] = useState(false);
  const [loadMore, setLoadMore] = props.logs.length > 10 ? useState(true) : useState(false);
  const [logLength, setLogLength] = useState(0);
  const [trueLogLength, setTrueLogLength] = useState(0);
  const [noLogs, setNoLogs] = useState(false);

  const isFocused = useIsFocused();
  // var logLength = props.logs.length;

  useEffect(() => {
    setTrueLogLength(props.logs.length);
    // (props.params.guest.name ? changeFilter(props.params.guest.name) : null);
  }, [props.logs, isFocused]);

  const openModal = () => {
    setIsVisible(!isVisible);
  };

  const alterDevices = () => {
    (!isVisible ? setCollapsedDevices(!collapsedDevices) : setCollapsed(!collapsed))
  };


  const alterHubsGuests = () => {
    setMainCollapsedHubs(!mainCollapsedHubs)
  };

  const alterGuests = () => {
    (!isVisible ? setMainCollapsedGuests(!mainCollapsedGuests) : setCollapsedGuests(!collapsedGuests))
  };

  const applyChanges = () => {
    setTruePersonFil(filterSel);
    setTrueDevFil(filterDevSel);
    setIsVisible(false);
    filterSel === "" ? null : setHubGuestSelected(true);
    filterDevSel === "" ? null : setDeviceSelected(true);
    setLoadMore(true)
    setSelected(true)
  }

  const changeFilter = (guest) => {
    setTruePersonFil(guest);
    setFilterSel(guest);
    setSelected(true);
  }

  return (
    <View style={styles.container}>

      {/*filter*/}

      <View>
        {props.logs && props.type == 0
          ? props.logs.map((entry, index) => {
              return <LogEntry log={entry} key={index} />;
            })
          : props.logs.map((entry, index) => {
              return <LogEntry log={entry} key={index} />;
            })}

        {trueLogLength == 0 && noLogs &&
          <View style={{ flex: 1, justifyContent: 'center', borderRadius: 50, alignContent: 'center', backgroundColor: '#44ABFF' }}>
            <Image
              style={{ alignSelf: 'center', margin: 20, height: 220, resizeMode: 'contain' }}
              source={require('../../assets/noData.png')}></Image>
            <Text style={{ color: 'white', fontWeight: '400', margin: 20, fontSize: 30, alignSelf: 'center' }}>No Logs Found</Text>
          </View>
        }
        {loadMore &&
          <TouchableOpacity style={styles.loadMoreButton} onPress={() => setLoadMore(false)}>
            <Text style={{ fontSize: 17.5, color: "white" }}>Load More Logs</Text>
          </TouchableOpacity>
        }
        {/*modal2*/}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  filter: {
    backgroundColor: "white",
    height: 45,
    width: 50,
    marginHorizontal: 3,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    fontWeight: "bold",
    flexDirection: "row",
  },

  middleText: {
    alignItems: "center",
    alignSelf: "flex-start",
    padding: 5,
    paddingRight: 40,
    marginLeft: 20,
  },
  keyText: {
    textAlign: 'center',
    padding: 5,
    width: "65%",
    marginRight: 30,
  },
  buttonContainer: {
    marginBottom: 10,
  },
  container: {
    flex: 1,
  },
  loadMoreButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: "#7DEA7B",
    borderRadius: 10,
    height: height / 15,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  modal: {
    backgroundColor: "#F1F1F1",
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 10,
    width: 300,
    height: 500,
    alignSelf: "center",
    alignItems: "center",
  },
  addGuestmodal: {
    backgroundColor: "#F1F1F1",
    elevation: 6,
    borderRadius: 10,
    width: 300,
    maxHeight: 600,
    alignSelf: "center",
    alignItems: "center",
  },
  devicesHeader: {
    width: 300,
    maxHeight: 220,
    alignSelf: "center",
    alignItems: "center",
  },
  textHeader: {
    justifyContent: "flex-start",
    alignSelf: "flex-start",
    marginLeft: 10,
    marginTop: 5,
    flexDirection: "row",
    fontWeight: "bold",
    fontSize: 14,
  },
  input: {
    width: "90%",
    textAlign: 'center',
    alignSelf: "center",
    alignItems: "center",
  },

  addGuestHeader: {
    marginTop: 25,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  submitButton: {
    backgroundColor: "#7DEA7B",
    borderRadius: 10,
    width: 120,
    height: 50,
    justifyContent: "center",
  },
  resetButton: {
    borderRadius: 10,
    width: 120,
    height: 50,
    justifyContent: "center",
    backgroundColor: "#ea5f5f",
  },
  expanded: {
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: "#FFFFFF",
    width: 255,
    height: 40,
    borderBottomWidth: 0.6,
    borderBottomColor: "grey",
  },
  guestHubFilterExpanded: {
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: "#FFFFFF",
    width: "90%",
    height: 50,
    borderBottomWidth: 0.6,
    borderBottomColor: "grey",
  },
  filterheader: {
    width: "85%",
    justifyContent: 'center',
    flexDirection: "column",
    borderRadius: 8,
    elevation: 5,
    backgroundColor: "#FFFFFF",
    paddingLeft: 0,
    height: 48,
    fontSize: 16,
    marginVertical: 10,
    marginHorizontal: 20,
  },
  filterKey: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'flex-start',
    flexDirection: "column",
    borderRadius: 15,
    backgroundColor: "#FFFFFF",
    marginHorizontal: 5,
  },
  filterKeyMain: {
    height: 45,
    elevation: 1,
    justifyContent: 'center',
    alignContent: 'flex-start',
    flexDirection: "column",
    borderRadius: 15,
    backgroundColor: "#FFFFFF",
    marginHorizontal: 3,
  },

  dropDownButtom: {
    backgroundColor: "#44ABFF",
    position: "absolute",
    right: 0,
    borderRadius: 8,
    height: "100%",
    width: "30%",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default LogCard;
export { LogCard };
