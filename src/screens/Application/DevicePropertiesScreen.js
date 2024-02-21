import React, { useEffect, useState } from "react";
import Modal from "react-native-modal";
import { useIsFocused } from "@react-navigation/native";
import { Icon } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import appStyle from "../../styles/AppStyle";
import UserAvatar from "react-native-user-avatar";
import SetScheduleCard from "../../components/cards/SetScheduleCard";
import { ActivityIndicator } from "react-native";
import { stopSharingAction } from "../../redux/Actions/stopSharing";
import { getIcon } from "../../utils/getIcon";
import { getStatus } from "../../utils/getStatus";
import { showToast } from "../../utils/toast";
import { getDeviceProperties, getActionAccess, updateProperties, updateActionAccess } from "../../services/deviceServices";
import {
  ScrollView,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Switch,
  Dimensions
} from "react-native";

var { width, height } = Dimensions.get("window")

function DevicePropertiesScreen(props) {

  const { navigation, deviceIndex, guestIndex, prevScreen } = props.route.params;
  const { sessionData, sharedUsersData, devicesData } = useSelector(state => state)
  let guest, device, shared_device_properties_id, login_credentials_id, state, type;

  // Current Guest/Device Details
  if (prevScreen == "Guests") {
    guest = sharedUsersData?.sharedUsers[guestIndex];
    device = sharedUsersData?.sharedUsers[guestIndex]?.devices[deviceIndex]
    shared_device_properties_id = device.shared_device_properties_id;
    login_credentials_id = device.login_credentials_id;
  } else if (prevScreen == "Devices") {
    device = devicesData?.devices[deviceIndex];
    guest = devicesData?.devices[deviceIndex]?.guests[guestIndex];
    shared_device_properties_id = guest.shared_device_properties_id;
    login_credentials_id = guest.login_credentials_id;
  }
  const [userName, setUserName] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [iconName, setIconName] = useState("");
  const [iconType, setIconType] = useState("");
  const [deviceName, setDeviceName] = useState("");
  const [deviceStatus, setDeviceStatus] = useState("");
  const [statusColor, setStatusColor] = useState("grey");
  const [dotColor, setDotColor] = useState("");
  const [propertiesState, setPropertiesState] = useState({});
  const [geofencing, setGeofencing] = useState(0);
  const [allDayAccess, setAllDayAccess] = useState(0);
  const [removeModal, toggleRemoveModal] = useState(false);
  const [actionSwitches, setActionSwitches] = useState([]);
  const [attributeSwitches, setAttributeSwitches] = useState([]);
  const [actions, setActions] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const isFocused = useIsFocused();
  const dispatch = useDispatch();

  const allActionsEnabled = actionSwitches.every(v => v === true);
  const allAttributesEnabled = attributeSwitches.every(v => v === true);


  useEffect(() => {
    setLoading(true);
  }, []);


  useEffect(() => {
    const { iconName, iconType } = getIcon(device.type);
    const { deviceState, stateColor, dotStatusColor } = getStatus(device.state, device.type);

    setDeviceName(device.name ?? deviceName);
    setUserName(guest.name ?? userName);
    setIconName(iconName);
    setIconType(iconType);
    setDeviceStatus(deviceState);
    setStatusColor(stateColor);
    setDotColor(dotStatusColor);
    if (shared_device_properties_id && login_credentials_id) {
      getDeviceInfo(login_credentials_id, shared_device_properties_id);
    }
  }, [isFocused, devicesData, sharedUsersData]);

  async function getDeviceInfo(accountID, deviceID) {

    getDeviceProperties(accountID, deviceID, sessionData.idToken).then((data) => {
      const { properties } = data;
      if (properties) {
        setGeofencing(properties.geofencing ?? geofencing);
        setAllDayAccess(properties.time_all_day ?? allDayAccess);
        setPropertiesState(properties);
      }
      setLoading(false);
    }).catch((err) => console.log(err));

    getActionAccess(sessionData.idToken, shared_device_properties_id).then((data) => {
      const { actions } = data.action_permissions;
      const { attributes } = data.attribute_permissions;

      setActions(actions);
      setAttributes(attributes);
      setActionSwitches([]);
      setAttributeSwitches([]);

      // Initialize the active action/attribute switches based on each access state
      actions?.forEach(action => {
        setActionSwitches(actionSwitches => [...actionSwitches, action.access]);
      });
      attributes?.forEach(attribute => {
        setAttributeSwitches(attributeSwitches => [...attributeSwitches, attribute.access]);
      });
    }).catch((err) => console.log(err));
  }

  // if no index is passed, it defaults to toggling all to the value passed in
  const handleToggle = async (type, value, index = null) => {

    /* Declare variables required for handling toggles*/
    const updatedSwitches = [];
    let values = [];
    let switches, elements, setSwitches;

    /* Initialize variables based on type */
    if (type === 'action') {
      switches = actionSwitches;
      elements = actions
      setSwitches = (vals) => setActionSwitches([...vals])
    } else {
      switches = attributeSwitches;
      elements = attributes
      setSwitches = (vals) => setAttributeSwitches([...vals])
    }
    
    /* Start toggle logic */
    if (index == null) {
      values = switches.map((v, i) => {
        if (v != value) {
          updatedSwitches.push(i);
        }
        return v = value;
      });
    } else {
      values = [...switches];
      values[index] = value;
      updatedSwitches.push(index);
    }

    setSwitches(values);
    /* End toggle logic */

    /* For every updated switch, push that update to db */
    for (const index of updatedSwitches) {
      const updateStatus = await updateActionAccess(
        sessionData.idToken,
        login_credentials_id,
        shared_device_properties_id,
        elements[index].action || elements[index].attribute,
        values[index],
        type
      )
      //console.log(updateStatus)
    }
  };

  async function toggleGeofencing(value) {
    console.log(value)
    setGeofencing(value);

    const properties = {
      ...propertiesState,
      all_day: allDayAccess,
      account: login_credentials_id,
      device: shared_device_properties_id,
      geofencing: value == true ? 1 : 0,
    }
    updateProperties(properties, sessionData.idToken)
      .then((data) => {
        console.log(data);
        if (data.statusCode != 200) {
          showToast("Unable to toggle geofencing")
          setGeofencing(!value);
        }
      })
      .catch((err) => {
        showToast("Unable to toggle geofencing");
        setGeofencing(!value);
        console.log(err)
      });
  }

  const stopSharing = async () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 5000);
    dispatch(stopSharingAction(login_credentials_id, sessionData.idToken, 1, shared_device_properties_id));
    setTimeout(() => {
      navigation.pop();
    }, 4000);
  };

  const renderActions = () => {
    if (actions.length > 0) {
      return (
        <View>
          <View style={[propstyle.lineContainer, { marginVertical: 10 }]} />
          <View style={[propstyle.headerView,]}>
            <Text style={[propstyle.headerFont, { flex: 1 }]}>
              Control Permissions
            </Text>
            {!allActionsEnabled ?
              <TouchableOpacity
                style={{ flex: .3, alignSelf: 'flex-end', marginBottom: 2 }}
                onPress={() => handleToggle('action', true)}
              >
                <Text style={{ textAlign: 'center', color: '#008CFF' }}>Enable All</Text>
              </TouchableOpacity>
              :
              <TouchableOpacity
                style={{ flex: .3, alignSelf: 'flex-end', marginBottom: 2 }}
                onPress={() => handleToggle('action', false)}
              >
                <Text style={{ textAlign: 'center', color: '#008CFF' }}>Disable All</Text>
              </TouchableOpacity>
            }
          </View>

          <View style={{ backgroundColor: 'white', borderRadius: 10, paddingHorizontal: 10, marginVertical: 5 }}>
            {actions?.map((action, index) => (
              <View>
                <View style={propstyle.actionsContainer} key={index}>
                  <Text style={{ fontSize: 20, paddingBottom: 10, textTransform: 'capitalize' }}>{action.friendly_name}</Text>
                  <Switch
                    style={{
                      marginBottom: 5,
                      transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }],
                    }}
                    trackColor={{ true: "#2DC62A", false: "#FF5D53" }}
                    value={actionSwitches[index]}
                    onValueChange={() => { handleToggle('action', !actionSwitches[index], index) }}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>
      )
    }
  }

  const renderAttributes = () => {
    if (attributes.length > 0) {
      return (
        <View>
          <View style={[propstyle.lineContainer, { marginVertical: 10 }]} />
          <View style={[propstyle.headerView,]}>
            <Text style={[propstyle.headerFont, { flex: 1 }]}>
              Sensor Permissions
            </Text>
            {!allAttributesEnabled ?
              <TouchableOpacity
                style={{ flex: .3, alignSelf: 'flex-end', marginBottom: 2 }}
                onPress={() => handleToggle('attribute', true)}
              >
                <Text style={{ textAlign: 'center', color: '#008CFF' }}>Enable All</Text>
              </TouchableOpacity>
              :
              <TouchableOpacity
                style={{ flex: .3, alignSelf: 'flex-end', marginBottom: 2 }}
                onPress={() => handleToggle('attribute', false)}
              >
                <Text style={{ textAlign: 'center', color: '#008CFF' }}>Disable All</Text>
              </TouchableOpacity>

            }
          </View>

          <View style={{ backgroundColor: 'white', borderRadius: 10, paddingHorizontal: 10, marginVertical: 5 }}>
            {attributes?.map((attribute, index) => (
              <View style={propstyle.actionsContainer} key={index}>
                <Text ellipsizeMode={"tail"} numberOfLines={2} style={{ fontSize: 20, paddingBottom: 10, width: '80%' }}>{attribute.friendly_name}</Text>
                <Switch
                  style={{
                    marginBottom: 5,
                    transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }],
                  }}
                  value={attributeSwitches[index]}
                  onValueChange={() => { handleToggle('attribute', !attributeSwitches[index], index) }}
                />
              </View>
            ))}
          </View>
        </View>
      )
    }
  }

  const renderGeofencing = () => {
    return (
      <View>
        <View style={[propstyle.lineContainer, { marginVertical: 10 }]} />
        <Text style={{ fontSize: 26, fontWeight: "bold" }}>
          Location Permissions
        </Text>
        <View style={{ backgroundColor: 'white', borderRadius: 10, paddingHorizontal: 10, marginVertical: 5 }}>
          <View>
            <View style={propstyle.actionsContainer}>
              <Text style={{ fontSize: 20, paddingBottom: 10, textTransform: 'capitalize' }}>Geofencing</Text>
              <Switch
                style={{
                  marginBottom: 5,
                  transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }],
                }}
                trackColor={{ true: "#2DC62A", false: "#FF5D53" }}
                value={geofencing == 1 ? true : false}
                onValueChange={() => toggleGeofencing(!geofencing)}
              />
            </View>
          </View>
        </View>
      </View>
    )
  }

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
      <View style={propstyle.modalContainer}>
        <Icon type="font-awesome" name="exclamation-triangle" size={60} />
        <Text style={{ fontSize: 30, fontWeight: "bold", textAlign: "center" }}>
          Are you sure you wish to remove this user?
        </Text>
        <Text style={{ marginTop: 10, textAlign: "center", fontSize: 15 }}>
          In order for them to access the device, you will have to invite them
          again!
        </Text>
        <View style={propstyle.buttonContainer}>
          <TouchableOpacity
            onPress={() => toggleRemoveModal(false)}
            style={{ borderWidth: 2, borderColor: "green", width: 100, height: 50, borderRadius: 10, justifyContent: "center", }}>
            <Text style={{ color: "green", textAlign: "center", fontWeight: "bold", }}>CANCEL</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => stopSharing()}
            style={{ backgroundColor: "#ea5f5f", borderRadius: 10, width: 100, height: 50, justifyContent: "center", }}
          >
            {isLoading ?
              <ActivityIndicator color={'white'} />
              :
              <Text style={{ color: "white", textAlign: "center", fontWeight: "bold", }}>
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
      {
        <View style={appStyle.cardContainer}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={appStyle.scrollView}>

            <View style={propstyle.headerView}>
              <Text style={[propstyle.headerFont, { flex: 1 }]} > Guest </Text>
              <View style={propstyle.userCard}>
                <View style={{ flexDirection: 'row', }}>
                  <UserAvatar size={40} borderRadius={41} name={guest.name} />
                  <Text numberOfLines={1} style={{ paddingLeft: 15, paddingRight: 10, alignSelf: "center", fontSize: 16, maxWidth: width / 2.7 }}>
                    {userName}
                  </Text>
                </View>
              </View>
            </View>

            <View style={[propstyle.lineContainer, { marginVertical: 10 }]} />

            <View style={propstyle.headerView}>
              <Text style={[propstyle.headerFont, { flex: 1 }]} > Device </Text>

              <TouchableOpacity
                style={{ flex: .4, alignSelf: 'flex-end',  }}
                onPress={() =>
                  navigation.navigate("SetScheduleScreen", {
                    deviceProperties: propertiesState,
                    guest,
                    navigation,
                    deviceName
                  })
                }
              >
                <Text style={{ textAlign: 'center', color: '#008CFF' }}>Edit Schedule</Text>
              </TouchableOpacity>
            </View>

            {!isLoading ? (
              <View>
                <View style={propstyle.devicecard}>

                  <View style={propstyle.device}>
                    <Text style={{ textAlign: 'center', fontSize: 23, fontWeight: "bold", color: "#353535" }}>
                      {deviceName}
                    </Text>
                    <Icon type={iconType} name={iconName} size={80} />
                    <View style={propstyle.row}>
                      <Icon
                        name="circle"
                        type="FontAwesome"
                        color={dotColor}
                        size={17}
                        style={{ marginRight: 5, marginTop: 2, }}
                      />
                      <Text style={{ textAlign: "center", color: statusColor, fontSize: 16, fontWeight: "bold", }}>
                        {deviceStatus}
                      </Text>
                    </View>
                  </View>

                  <SetScheduleCard deviceProperties={propertiesState} />
                </View>

                <View style={propstyle.column}>
                  {renderActions()}
                  {renderAttributes()}
                  {renderGeofencing()}
                </View>
              </View>

            ) : (
              <View style={{ width: width }}>
                <ActivityIndicator
                  style={{ margin: 50 }}
                  size="large"
                  color="#5BD3FF"
                />
              </View>
            )}
          </ScrollView>

          <View style={{ marginTop: 2 }}>
            <TouchableOpacity
              style={propstyle.redButton}
              onPress={() => toggleRemoveModal(true)}
            >
              <Text style={propstyle.redButtonText}>Revoke Access</Text>
            </TouchableOpacity>
          </View>


        </View >
      }
      {removeUserModal}
    </View >
  );
}

const propstyle = StyleSheet.create({
  device: {
    flex: 1.3,
    marginLeft: 0,
    margin: 5,
    height: "90%",
    padding: 10,
    marginVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
  },
  actionsContainer: {
    marginTop: 10,
    height: 50,
    alignItems: 'center',
    width: '100%',
    marginHorizontal: 10,
    alignSelf: 'center',
    // backgroundColor: 'green', 
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between"
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
  devicecard: {
    flex: 1,
    // height: '33%',
    // backgroundColor: 'green',
    width: '100%',
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  row: {
    marginTop: 10,
    flexDirection: "row",
  },
  rowContainer: {
    margin: 2,
    flexDirection: "row",
    justifyContent: "center",
    alignSelf: "stretch",
  },
  column: {
    width: "100%",
  },
  lineContainer: {
    backgroundColor: "#c3c3c3",
    height: 2,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "stretch",
  },
  redButton: {
    // position: "absolute",
    backgroundColor: "#ea5f5f",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    height: 50,
    width: "100%",
    borderColor: "#cc9797",
  },
  redButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  headerView: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: 'green'
  },
  headerFont: {
    // backgroundColor: 'green',
    fontSize: 25,
    fontWeight: "bold",
    color: "#353535"
  },
  userCard: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 35,
    padding: 6,
  },
});

export default DevicePropertiesScreen;