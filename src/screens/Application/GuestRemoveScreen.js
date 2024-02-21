import React, { useState, useEffect } from "react";
import Modal from "react-native-modal";
import UserAvatar from "react-native-user-avatar";
import { Icon } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import appStyle from "../../styles/AppStyle";
import { stopSharingAction } from "../../redux/Actions/stopSharing";
import { createADevice } from "../../services/deviceServices";
import { getIcon } from "../../utils/getIcon";
import {
  ScrollView,
  TouchableOpacity,
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
} from "react-native";

const GuestRemoveScreen = (props) => {
  const { sessionData, devicesData } = useSelector(state => state)
  const [selected, setSelected] = useState([]);
  const [removeModal, toggleRemoveModal] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isDisabled, setDisabled] = useState(true);
  const [isVisibleDevices, setIsVisibleDevices] = useState(false);
  const user = props.route.params.user;
  const guestDevices = user.devices
  const dispatch = useDispatch();

  const renderIcons = (deviceType) => {
    const { iconName, iconType } = getIcon(deviceType);
    return (
      <Icon name={iconName} type={iconType} size={45} />
    );
  }

  // console.log('\n\nProps')
  // console.log(props)

  const stopSharing = async () => {
    setLoading(true);
    setTimeout(() => toggleRemoveModal(), 3800);
    dispatch(stopSharingAction(user.login_credentials_id, sessionData.idToken));
    setTimeout(() => props.navigation.pop(), 4000);
  };

  const toggleDevicesModal = () => {
    setIsVisibleDevices(!isVisibleDevices);
    setDisabled(true)
    setSelected([]);
  };

  const removeUserHandler = async () => {
    toggleRemoveModal(true);
  };

  const addDeviceToGuest = () => {
    setLoading(true);
    if (selected.length == 0) {
      console.log("Please select a device");
      return;
    } else {
      selected.forEach(device => {
        shareDevice(
          user.login_credentials_id,
          device.name,
          device.entity_id,
          device.type
        );
      });
    }
  };

  const shareDevice = async (login_id, devName, entity_id, type) => {
    createADevice(login_id, sessionData.idToken, {
      title: devName,
      entity_id: entity_id,
      type: type,
    }).then((response) => {
      // setTimeout(() => toggleDevicesModal(), 2000)
      if (response.statusCode == 200) {
        console.log('success!')
        setTimeout(() => setLoading(false), 5000);
        setTimeout(() => toggleDevicesModal(), 3800);
        dispatch(getSharedUsersListAction(sessionData.idToken));
        dispatch(getDevicesAction(sessionData.idToken));
      }
    })
      .catch((err) => console.log(err));
    setTimeout(() => props.navigation.pop(), 4000);
  }


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

          {devicesData.devices.filter(
            ({ entity_id: id1 }) =>
              !guestDevices.some(({ entity_id: id2 }) => id2 === id1)
          ) == 0 &&
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
            {devicesData.devices &&
              devicesData.devices
                .filter(
                  ({ entity_id: id1 }) =>
                    !guestDevices.some(({ entity_id: id2 }) => id2 === id1)
                )
                .map((entry, i) => {
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


        {devicesData.devices.filter(
          ({ entity_id: id1 }) =>
            !guestDevices.some(({ entity_id: id2 }) => id2 === id1)
        ) != 0 &&
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

  let removeUserModal = (
    <Modal
      isVisible={removeModal}
      backdropColor={"#00000090"}
      hasBackdrop={true}
      backdropOpacity={10}
      onBackdropPress={() => toggleRemoveModal(false)}
      onSwipeComplete={() => toggleRemoveModal(false)}
      swipeDirection="down"
    >
      <View style={styles.modalContainer}>
        <Icon type="font-awesome" name="exclamation-triangle" size={60} />
        <Text style={{ fontSize: 30, fontWeight: "bold", textAlign: "center" }}>
          Are you sure you wish to remove this user?
        </Text>
        <Text style={{ marginTop: 10, textAlign: "center", fontSize: 15 }}>
          In order for them to access the device, you will have to invite them
          again!
        </Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => toggleRemoveModal(false)}
            style={{
              borderWidth: 2,
              borderColor: "green",
              width: 100,
              height: 50,
              borderRadius: 10,
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                color: "green",
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              CANCEL
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => stopSharing()}
            style={{
              backgroundColor: "#ea5f5f",
              borderRadius: 10,
              width: 100,
              height: 50,
              justifyContent: "center",
            }}
          >
            {isLoading ?
              <ActivityIndicator color={'white'} />
              :
              <Text
                style={{
                  color: "white",
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                REMOVE
              </Text>

            }
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={appStyle.container}>
      <View style={[styles.rowInformation, { justifyContent: 'space-between' }]}>
        <View style={styles.card}>
          <View style={styles.rowContainer}>
            <UserAvatar size={40} borderRadius={41} name={user.name} />
            <Text style={{ paddingLeft: 15, paddingRight: 10, alignSelf: "center", fontSize: 16 }}>
              {user.name}
            </Text>
          </View>
        </View>

        <TouchableOpacity 
          onPress={() => toggleDevicesModal()}
          style={styles.addDevicesBtn}
        >
          <View style={[styles.rowContainer, {alignSelf: 'center'}]}>
            <Icon style={{ marginHorizontal: 5, marginVertical: 1, }} name="plus" type="feather" size={18} color='white' />
            <Text style={{color: 'white', textAlign: 'center'}}>Add Devices</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={[styles.lineContainer, { marginVertical: 10 }]} />


      <View style={{ width: "100%", height: "75%" }}>
        <ScrollView style={{}}>
          {guestDevices.map((entry, i) => (
            <View style={styles.deviceDisplay} key={i}>
              <View style={styles.devIcon2}>
                {renderIcons(entry.type)}
              </View>
              <Text>{entry.name}</Text>
              <View style={[styles.lineContainer, { marginVertical: 10 }]} />

            </View>
          ))}

          {/* <TouchableOpacity
            onPress={() => toggleDevicesModal()}
            style={{ padding: 15, justifyContent: 'center', alignItems: 'center', marginTop: 10, borderRadius: 15, backgroundColor: '#7DEA7B' }}>
            <View style={{ flexDirection: 'row' }}>
              <Icon style={{ marginHorizontal: 5, marginVertical: 1, }} name="plus" type="feather" size={25} color='white' />
              <Text style={{ fontSize: 22, color: 'white' }}>Add Devices</Text>
            </View>
          </TouchableOpacity> */}
        </ScrollView>
      </View>

      {selectDevice}

      <View style={styles.revokeArea}>
        <TouchableOpacity
          style={styles.redButton}
          onPress={() => removeUserHandler()}
        >
          <Text style={styles.redButtonText}>Revoke Access</Text>
        </TouchableOpacity>
      </View>
      {removeUserModal}
    </View>
  );
};

const styles = StyleSheet.create({
  name: {
    fontSize: 26,
    fontWeight: "bold",
    marginLeft: 8,
  },
  rowContainer: {
    flexDirection: 'row',
  },
  revokeArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: "flex-end",
    flexDirection: "row",
    alignSelf: 'center',
    width: "100%",
  },
  modalContainer: {
    padding: 12,
    flex: 0.45,
    backgroundColor: "#F1F1F1",
    borderRadius: 15,
    justifyContent: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 50,
    paddingTop: 40,
  },
  rowInformation: {
    flexDirection: "row",
    height: 60,
    width: "100%",
    marginBottom: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  infoLine: {
    flexDirection: "column",
  },
  deviceDisplay: {
    borderBottomWidth: 1,
    borderBottomColor: "gray",
    height: 80,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  devIcon2: {
    height: 46,
    width: 46,
    marginHorizontal: 15,
    borderRadius: 6,
  },
  redButton: {
    backgroundColor: "#ea5f5f",
    marginTop: 15,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    height: 60,
    width: "100%",
  },
  card: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
    backgroundColor: "#FFFFFF",
    borderRadius: 35,
    padding: 5,
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 10,
  },
  redButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
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
  topGuestModal: {
    flex: 0.5,
    alignItems: 'center',
    flexDirection: "row",
  },
  cardCon: {
    flexDirection: "column",
    alignSelf: "flex-start",
    marginLeft: 20,
    marginRight: 20,
    alignSelf: "stretch",
  },
  cardText: {
    fontSize: 16,
    maxWidth: '70%',
    alignSelf: "center",
    marginLeft: 20,
  },
  seperator: {
    marginTop: 10,
    marginBottom: 10,
    borderWidth: 0.5,
    borderColor: "#888888",
  },
  addDevicesBtn: {
    backgroundColor: '#7DEA7B', 
    justifyContent: 'center',
    alignContent: 'center',
    width: '35%', 
    height: '85%',
    borderRadius: 100,
  },
  lineContainer: {
    backgroundColor: "black",
    height: 1,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "stretch",
  },
});

export default GuestRemoveScreen;
