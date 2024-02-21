import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import UserAvatar from "react-native-user-avatar";
import { Icon } from "react-native-elements";
import appStyle from "../../styles/AppStyle";
import { getIcon } from "../../utils/getIcon";
import { getStatus } from "../../utils/getStatus";
import { useDevice, toggleRingStream } from "../../services/deviceServices";
import publicIP from 'react-native-public-ip';
import { showToast } from "../../utils/toast";
import StreamView from "../../components/StreamView";
import { Attribute } from "../../components/Attribute";
import { ControlButton } from "../../components/ControlButton";
import { getDevicesAction } from "../../redux/Actions/getDevicesAction";
import { ActivityIndicator, TouchableOpacity, View, Text, StyleSheet, RefreshControl, Dimensions, ScrollView } from "react-native";

var { width, height } = Dimensions.get("screen") // Device screen height and width

function HomeownerControlScreen(props) {
  // Get specific device object
  const { devicesData, websocket, sessionData } = useSelector(state => state);
  const { devices } = devicesData;
  const device = devices[props.route.params.deviceIndex];

  // Initialize all device values/data
  const { state, name, type } = device;
  const { iconName, iconType } = getIcon(type);
  const { deviceState, stateColor, dotStatusColor } = getStatus(state, type);
  const [deviceName, setDeviceName] = useState(name);
  const [deviceType, setDeviceType] = useState(type.charAt(0).toUpperCase() + type.slice(1));
  const [actions, setActions] = useState(null);
  const [attributeData, setAttributeData] = useState(null);
  const [livestreamButton, setLivestreamButton] = useState(type == 'doorbell');
  const [hubOffline, setHubOffline] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [livestream, toggleLivestream] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [streamInfo, setStreamInfo] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    setDeviceName(name);
    setDeviceType(type.charAt(0).toUpperCase() + type.slice(1));

    if (websocket.status == "connected") {
      setActions(device.actions);
      setAttributeData(device.attributes);

      //console.log("Actions: " + JSON.stringify(device.actions))
      //console.log("Attributes Data: " + JSON.stringify(device.attributes));
    }

    setLivestreamButton(type == 'doorbell');
    setTimeout(() => setLoading(false), 1000)

    // Back-up API calls if websocket server is down
    if (websocket.status == "disconnected" || refreshing) {
      dispatch(getDevicesAction(sessionData.idToken))
    }
  }, [refreshing, device]);

  const handleAction = async (action) => {
    if (action == "livestream") {
      toggleRingStream(sessionData.idToken, device, "on").then(
        (msg) => {
          publicIP().then(deviceIP => {
            setStreamInfo({...msg, deviceIP});
            toggleLivestream(!livestream);
          }).catch(error => {
            console.log(error);
            // 'Unable to get IP address.'
          });
        }
      ).catch((err) => showToast(err));
    }
    else _useDevice(action);
  };

  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);


  async function _useDevice(action) {
    // Handles the action for when button is currently toggled
    /*
    if ((action == "unlock" && toggledOn) || (action == "lock" && !toggledOn)) {
      showToast("Already in this state");
      return;
    }
    */
    useDevice(action, sessionData.idToken, device, true).then(() => {
      setErrorMsg("");
      //if (action) setToggle(!toggledOn);
    })
      .catch((err) => showToast(err));
  }

  const renderActions = () => {
    if (actions && actions?.length > 0) {
      return (
        <View>
          <View style={[styles.lineContainer, { marginVertical: 5 }]} />
          <Text style={[styles.headerFont, {}]}>
            {deviceType} Controls
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignSelf: 'center', }}>
            {actions?.map((action, index) =>
              <ControlButton key={index} {...action} deviceType={deviceType} deviceState={deviceState} handleAction={handleAction} />
            )}
          </View>
        </View>
      )
    }
    else if (actions?.length > 0) {
      return (
        <View>
          <View style={[styles.lineContainer, { marginVertical: 5 }]} />
          <Text style={{ fontSize: 26, fontWeight: "bold", color: "#353535" }}>
            {deviceType} Controls
          </Text>
          <View style={{ margin: 10, justifyContent: 'center', backgroundColor: '#7DEA7B', borderRadius: 15, }}>
            <Text style={{ fontWeight: 'bold', color: "white", fontSize: 22, textAlign: 'center', padding: 15 }}>
              No Controls Available
            </Text>
          </View>
        </View>
      )
    }
  }


  const renderAttributes = () => {
    if (attributeData?.length > 0) {
      return (
        <View>
          <View style={[styles.lineContainer, { marginVertical: 5 }]} />
          <Text style={[styles.headerFont, {}]}>
            {deviceType} Sensors
          </Text>
          
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignSelf: 'center', justifyContent: 'space-between' }}>
            {attributeData?.map((attribute, index) => {
              if (attribute.attributes.friendly_name != 'Livestream') {
                return (
                  <Attribute key={index} {...attribute} type={deviceType} />
                )
              }
            }
            )}
          </View>
        </View>
      )
    }
    else {
      return (
        <View>
          <View style={[styles.lineContainer, { marginVertical: 5 }]} />
          <Text style={{ fontSize: 26, fontWeight: "bold", color: "#353535" }}>
            {deviceType} Sensors
          </Text>
          <View style={{ margin: 10, justifyContent: 'center', backgroundColor: '#7DEA7B', borderRadius: 15, }}>
            <Text style={{ fontWeight: 'bold', color: "white", fontSize: 22, textAlign: 'center', padding: 15 }}>
              No Sensors Available
            </Text>
          </View>
        </View>
      )
    }
  }

  return (
    <View style={[appStyle.container, { alignItems: null }]}>
      <ScrollView
        refreshControl={
          <RefreshControl
            colors={['#FFFFFF']}
            tintColor={'#7DEA7B'}
            progressBackgroundColor={'#7DEA7B'}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        showsVerticalScrollIndicator={false}
        style={appStyle.scrollView}>


        <View style={styles.homeownerView}>
          <Text style={[styles.headerFont, { flex: 1 }]} > Home Owner</Text>
          <View style={styles.userCard}>
            <View style={{ flexDirection: 'row' }}>
              <UserAvatar size={40} borderRadius={41} name={sessionData.name} />
              <Text numberOfLines={1} style={{ paddingLeft: 15, paddingRight: 10, alignSelf: "center", fontSize: 16, maxWidth: width / 2.7 }}>
                {sessionData.name}
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.lineContainer, { marginVertical: 10 }]} />

        <Text style={[styles.headerFont, { paddingLeft: 5, }]}>Device</Text>

        <View style={styles.devicecard}>
          <View style={styles.device}>

            <View
              style={{ justifyContent: "center", alignItems: "center" }}
            >
              <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: "bold", color: "#353535" }}>
                {deviceName}
              </Text>
              <Icon name={iconName} type={iconType} size={80} style={{ marginRight: 5 }} />
              <View style={{ marginTop: 10, flexDirection: "row", }}>
                <Icon name="circle" type="FontAwesome" color={dotStatusColor} size={17} style={{ marginRight: 5, marginTop: 2, }} />
                <Text style={{ textAlign: "center", color: stateColor, fontSize: 16, fontWeight: "bold", }}>
                  {deviceState}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {livestream &&
          <StreamView
            idToken={sessionData.idToken}
            device={device}
            toggleView={toggleLivestream}
            streamInfo={streamInfo}
          />}

        {isLoading ?
          <View style={{ height: 200, justifyContent: 'center' }}>
            <ActivityIndicator size="large" color="#7DEA7B" />
          </View>
          :
          <View style={styles.col}>
            {renderActions()}
            {renderAttributes()}
          </View>
        }

        <Text style={styles.error}>{errorMsg}</Text>


      </ScrollView >

      {livestreamButton && (
        <TouchableOpacity
          style={{ backgroundColor: '#44ABFF', borderRadius: 10, height: "10%", justifyContent: 'center', }}
          onPress={() => handleAction('livestream')}
        >
          <Text style={{ textAlign: 'center', color: 'white', fontSize: 20 }}>Live View</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 2,
    borderColor: "#60B8FF",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
    width: 160,
    height: 70,
  },
  cardContainer: {
    flex: 1,
  },
  device: {
    flex: 1.3,
    marginLeft: 0,
    margin: 5,
    height: "90%",
    // width: '43%',
    padding: 10,
    marginVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
  },
  homeownerView: {
    flexDirection: 'row',
    alignItems: 'center',
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
  rowContainer: {
    margin: 2,
    flexDirection: "row",
    justifyContent: "center",
    alignSelf: "stretch",
  },
  lightButton: {
    borderWidth: 2,
    borderColor: "#60B8FF",
    margin: 10,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: "#44ABFF",
    borderRadius: 15,
    width: '45%',
    height: 70,
  },
  actionButton: {
    borderWidth: 2,
    margin: 5,
    height: 70,
    borderRadius: 15,
    width: '45%',
    borderColor: "#60B8FF",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: "#44ABFF",
  },
  attributeArea: {
    margin: 5,
    height: 95,
    borderRadius: 15,
    width: '45%',
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: "#FFFFFF",
  },
  appbar: {
    marginTop: 10,
    marginBottom: -40,
    alignSelf: "flex-start",
    flexDirection: "row",
  },
  title: {
    marginBottom: 20,
  },
  row: {
    marginTop: 10,
    flexDirection: "row",
  },
  col: {
    flexDirection: "column",
    alignSelf: "stretch",
  },
  card: {
    justifyContent: "center",
    alignItems: "center",
    // alignSelf: "stretch",
    backgroundColor: "#FFFFFF",
    borderRadius: 35,
    padding: 15,
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 10,
  },
  scheduleContainer: {
    flex: 2,
    margin: 5,
    marginRight: 0,
    height: '90%',
    alignSelf: "center",
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    paddingBottom: 5,
  },
  scheduleRow: {
    flex: 1,
    justifyContent: "center",
    width: '100%',
    // padding: 5,
    // backgroundColor: 'green',
    alignItems: "center",
    flexDirection: "row",
    // width: "100%",
    // height: 60,
  },
  scheduleDataCont: {
    // height: 60,
    // backgroundColor: 'green',
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
    borderRadius: 15,
  },
  scheduleText: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '600'
  },
  offlineText: {
    fontSize: 28,
    alignSelf: "center",
    paddingTop: 60,
  },
  icons: {
    marginLeft: 10,
  },
  lineContainer: {
    backgroundColor: "#c3c3c3",
    height: 2,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "stretch",
  },
  error: {
    alignSelf: "center",
    color: "red",
    paddingTop: 10,
    paddingBottom: 10,
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

export default HomeownerControlScreen;
