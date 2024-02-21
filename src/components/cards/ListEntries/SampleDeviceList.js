import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Icon } from "react-native-elements";
import Modal from "react-native-modal";
import DeviceElement from "../../DeviceElement";
import GuestElement from "../../GuestElement";
import UserAvatar from "react-native-user-avatar";
import { createADevice } from "../../../services/deviceServices";
import { getSharedUsersListAction } from "../../../redux/Actions/getSharedUsersListAction";
import { getDevicesAction } from "../../../redux/Actions/getDevicesAction";
import { getIcon } from "../../../utils/getIcon";

import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  ActivityIndicator,
  ScrollView,
} from "react-native";

function SampleDeviceList(props) {
  const [isVisible, setIsVisible] = useState(false);
  const [isVisibleDevices, setIsVisibleDevices] = useState(false);
  const [selected, setSelected] = useState([]);
  const [guestDevices, setGuestDevices] = useState([]);
  const [availableGuests, setAvailableGuests] = useState([]);
  const [availableDevices, setAvailableDevices] = useState([]);
  const { sessionData, sharedUsersData, devicesData } = useSelector(state => state)
  const [isLoading, setLoading] = useState(false)
  const [isDisabled, setDisabled] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    if (props.screen == "Devices") {
      setGuestDevices(props.entry.guests);
      const results = sharedUsersData.sharedUsers.filter(({ name: id1 }) => !props.entry.guests.some(({ name: id2 }) => id2 === id1));
      setAvailableGuests(results);
    }
    else {
      setGuestDevices(props.entry.devices);
      const results = devicesData.devices.filter(({ entity_id: id1 }) => !props.entry.devices.some(({ entity_id: id2 }) => id2 === id1));
      setAvailableDevices(results);
    }

  }, [props.entry.guests, devicesData, sharedUsersData, props.entry.devices]);

  const toggleGuestsModal = () => {
    setLoading(false);
    setIsVisible(!isVisible);
    setDisabled(true)
    setSelected([]);
  };

  const toggleDevicesModal = () => {
    setLoading(false);
    setIsVisibleDevices(!isVisibleDevices);
    setDisabled(true)
    setSelected([]);
  };

  const selectUser = (entry) => {

    // Removes user if theyre already selected
    if (selected.length > 0 && selected.includes(entry)) {
      console.log("Removing user: " + entry.name)
      setSelected(selected => selected.filter(e => e !== entry));
      console.log(selected.filter(e => e !== entry))
      if (selected.filter(e => e !== entry).length == 0)
        setDisabled(true)
    }
    // Adds user if not already selected
    else {
      setDisabled(false)
      console.log("Adding user: " + entry.name)
      setSelected(selected => [...selected, entry]);
      console.log([...selected, entry])
    }
  };

  const addGuestToDevice = () => {
    setLoading(true)
    if (selected.length == 0) {
      console.log("Please select a guest");
      return;
    } else {
      selected.forEach(guest => {
        shareDevice(
          guest.login_credentials_id,
          props.entry.name,
          props.entry.entity_id,
          props.entry.type,
          false
        );
      });
    }
  };

  const addDeviceToGuest = () => {
    setLoading(true);
    if (selected.length == 0) {
      console.log("Please select a device");
      return;
    } else {
      selected.forEach(device => {
        shareDevice(
          props.entry.login_credentials_id,
          device.name,
          device.entity_id,
          device.type,
          true
        );
      });
    }
  };

  const shareDevice = async (login_id, devName, entity_id, type, modalType) => {
    createADevice(login_id, sessionData.idToken, {
      title: devName,
      entity_id: entity_id,
      type: type,
    }).then((response) => {
      if (response.statusCode == 200) {
        setTimeout(() => {
          modalType ? toggleDevicesModal() : toggleGuestsModal();
        }, 500);
        setTimeout(() => {
          dispatch(getSharedUsersListAction(sessionData.idToken)),
          dispatch(getDevicesAction(sessionData.idToken))
        }, 800);
      }
      else {
        setLoading(false);
      }
    })
      .catch((err) => console.log(err));
  }

  const addButton = () => {
    return (
      <View style={styles.iconAndName}>
        <TouchableOpacity
          onPress={() =>
            props.screen == "Devices" ? toggleGuestsModal() : toggleDevicesModal()
          }
          style={props.screen == "Devices" ? styles.addGuest : styles.addDevice}
        >
          <Icon name="plus" type="font-awesome" color="#FFFFFF" size={38} />
        </TouchableOpacity>
        <Text style={{ marginTop: 6, width: 73, fontSize: 10.5, textAlign: "center" }}>{props.screen == "Devices" ? "Add Guest" : "Add Device"}</Text>
      </View>
    );
  }

  let selectGuest = (
    <Modal
      isVisible={isVisible}
      transparent={true}
      onBackdropPress={() => toggleGuestsModal()}
      onSwipeComplete={() => toggleGuestsModal()}
      swipeDirection="down"
      backdropColor={"#00000080"}
      propagateSwipe={true}
      backdropOpacity={1}
    >
      <View style={styles.modal}>

        <View style={styles.topGuestModal}>
          <Icon size={26} name="users" type="feather" color="black" />
          <Text style={{ marginLeft: 10, fontSize: 24 }}>Add Guest</Text>
        </View>

        <View style={{ flex: 2.2, width: "100%" }}>

          {availableGuests.length == 0 &&
            <View style={{ flex: 100, justifyContent: 'center', alignItems: 'center', backgroundColor: '#44ABFF', margin: 10, borderRadius: 15, }}>
              <Text style={{ fontSize: 24, color: 'white', textAlign: 'center' }}>There are no more available guests</Text>
            </View>
          }

          <ScrollView>
            {availableGuests &&
              availableGuests.map((entry, i) => (
                <View key={i} style={styles.cardCon}>
                  <TouchableOpacity onPress={() => selectUser(entry)}>
                    <View
                      style={{
                        paddingLeft: 10,
                        paddingVertical: 6,
                        flexDirection: "row",
                        borderRadius: 10,
                        elevation: selected?.includes(entry) ? 2 : 0,
                        backgroundColor: selected?.includes(entry) ? "white" : "#F1F1F1",
                      }}
                    >
                      <UserAvatar
                        size={40}
                        borderRadius={41}
                        name={entry.name}
                      />
                      <Text style={styles.cardText}>{entry.name}</Text>
                    </View>
                  </TouchableOpacity>
                  <View style={styles.seperator}></View>
                </View>
              ))}
          </ScrollView>
        </View>


        {availableGuests.length != 0 &&
          <View style={{ flex: .7, width: "100%", alignItems: 'center' }}>
            <TouchableOpacity
              onPress={() => addGuestToDevice()}
              style={{
                marginTop: 25,
                borderRadius: 10,
                width: '90%',
                height: "50%",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: isDisabled ? "#26608F" : "#289EFF",
              }}
            >
              {isLoading
                ?
                <ActivityIndicator color={'white'} />
                :
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 22,
                    fontWeight: "bold",
                    color: "white",
                  }}
                >
                  Add Guest
                </Text>
              }
            </TouchableOpacity>
          </View>
        }
      </View>
    </Modal>
  );

  let selectDevice = (
    <Modal
      isVisible={isVisibleDevices}
      transparent={true}
      onBackdropPress={() => toggleDevicesModal()}
      onSwipeComplete={() => toggleDevicesModal()}
      swipeDirection="down"
      backdropColor={"#00000080"}
      propagateSwipe={true}
      backdropOpacity={1}
    >
      <View style={styles.modal}>

        <View style={styles.topGuestModal}>
          <View style={{ flexDirection: 'row' }}>
            <Icon name="codesandbox" type="feather" color="black" />
            <Icon name="plus" type="feather" color="black" size={13} />
          </View>
          <Text style={{ marginLeft: 10, fontSize: 24 }}>Add Device</Text>
        </View>

        <View style={{ flex: 2.2, width: "100%" }}>

          {availableDevices.length == 0 &&
            <View style={{
              flex: 100,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#44ABFF',
              margin: 10,
              borderRadius: 15
            }}
            >
              <Text style={{ fontSize: 24, color: 'white', textAlign: 'center' }}>
                There are no more available devices
              </Text>
            </View>
          }

          <ScrollView>
            {devicesData.devices && availableDevices
              .map((entry, i) => {
                //console.log("ENTRY: " + JSON.stringify(entry));  
                const { iconName, iconType } = getIcon(entry.type);
                return (
                  <View key={i} style={styles.cardCon}>
                    <TouchableOpacity onPress={() => selectUser(entry)}>
                      <View
                        style={{
                          paddingLeft: 10,
                          paddingVertical: 6,
                          flexDirection: "row",
                          borderRadius: 10,
                          elevation: selected?.includes(entry) ? 2 : 0,
                          backgroundColor: selected?.includes(entry) ? "white" : "#F1F1F1",
                        }}
                      >
                        <Icon
                          name={iconName}
                          type={iconType}
                          containerStyle={{
                            padding: 4,
                            borderColor: "#60b8ff",
                            borderWidth: 2,
                            borderRadius: 4,
                          }}
                        />
                        <Text numberOfLines={2} ellipsizeMode='tail' style={styles.cardText}>
                          {entry.name}
                        </Text>
                      </View>
                    </TouchableOpacity>
                    <View style={styles.seperator}></View>
                  </View>
                )
              })}
          </ScrollView>
        </View>


        {availableDevices.length != 0 &&
          <View style={{ flex: .7, width: "100%", alignItems: 'center' }}>
            <TouchableOpacity
              disabled={isDisabled}
              style={{
                marginTop: 25,
                borderRadius: 10,
                width: '90%',
                height: "50%",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: isDisabled ? "#26608F" : "#289EFF",
              }}
              onPress={() => {
                addDeviceToGuest();
              }}
            >
              {isLoading
                ?
                <ActivityIndicator color={'white'} />
                :
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 22,
                    fontWeight: "bold",
                    color: "white",
                  }}
                >
                  Add Device
                </Text>
              }
            </TouchableOpacity>
          </View>
        }
      </View>
    </Modal>
  );

  return (
    <View style={{ alignSelf: 'center', width: '100%' }}>
      <View style={styles.container} transparent={true}>
        {
          guestDevices.map((d, i) => (
            <View style={styles.iconAndName} key={i}>
              {props.screen === "Devices" ? (
                <GuestElement
                  key={d.shared_device_properties_id}
                  currGuest={d}
                  guestIndex={i}
                  cardIndex={props.cardIndex}
                  screen={props.screen}
                  navigation={props.navigation}
                />
              ) : (
                <DeviceElement
                  key={d.shared_device_properties_id}
                  currDevice={d}
                  deviceIndex={i}
                  cardIndex={props.cardIndex}
                  screen={props.screen}
                  navigation={props.navigation}
                />
              )}
            </View>
          ))
        }
        {props.screen != "Hubs" && addButton()}
        {selectGuest}
        {selectDevice}

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  iconHolder: {
    // backgroundColor: "green",
    width: 70,
    height: 70,
  },
  iconAndName: {
    backgroundColor: "transparent",
    marginVertical: 5,
    marginHorizontal: 8,
    width: '20%'
  },
  text: {
    fontSize: 10,
    width: 70,
    textAlign: "center",
  },
  addGuest: {
    backgroundColor: "#57E455",
    justifyContent: "center",
    borderRadius: 40,
    width: 70,
    height: 70,
  },
  addDevice: {
    backgroundColor: "#7DEA7B",
    justifyContent: "center",
    borderRadius: 5,
    width: 70,
    height: 70,
  },
  modal: {
    borderRadius: 10,
    width: "80%",
    alignSelf: "center",
    alignItems: "center",
    height: "50%",
    backgroundColor: "#F1F1F1",
    // maxHeight: "55%"
  },
  seperator: {
    marginTop: 10,
    marginBottom: 10,
    borderWidth: 0.5,
    borderColor: "#888888",
  },
  input: {
    borderRadius: 10,
    borderColor: "black",
    borderWidth: 0.5,
    backgroundColor: "#F4F4F4",
    alignSelf: "stretch",
    paddingLeft: 20,
    height: 48,
    fontSize: 16,
    marginTop: 21,
    marginHorizontal: 20,
  },
  topGuestModal: {
    flex: 0.5,
    alignItems: 'center',
    flexDirection: "row",
  },
  cardText: {
    fontSize: 16,
    maxWidth: '70%',
    alignSelf: "center",
    marginLeft: 20,
  },
  cardCon: {
    flexDirection: "column",
    alignSelf: "flex-start",
    marginLeft: 20,
    marginRight: 20,
    alignSelf: "stretch",
  },
  iconCon: {
    paddingLeft: 4,
    flexDirection: "row",
    borderRadius: 10,
    backgroundColor: "#F1F1F1",
  },
  addGuestHeader: {
    marginTop: 25,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  submitButton: {
    marginTop: 35,
    backgroundColor: "#289EFF",
    borderRadius: 10,
    width: 200,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
});


export default SampleDeviceList;
