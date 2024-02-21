import React, { useEffect, useRef, useState } from "react";
import Collapsible from "react-native-collapsible";
import moment from 'moment';
import {
  Animated,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Dimensions,
} from "react-native";
import {
  MaterialCommunityIcons,
  MaterialIcons,
  FontAwesome,
  Entypo,
  Feather,
} from "react-native-vector-icons";

var { width, height } = Dimensions.get("screen") // Device screen height and width

const Attribute = (props) => {
  //console.log(props);

  moment.locale('en');

  // Animated States
  const scale = useRef(new Animated.Value(1)).current;
  const colorAnim = useRef(new Animated.Value(0)).current;
  const scaleY = useRef(new Animated.Value(1)).current;
  const translationXY = useRef(new Animated.ValueXY(0, 0)).current;
  const [unavailable, setUnavailable] = useState(false);
  const [animated, setAnimated] = useState(false);
  const [heightAnim, setHieghtAnim] = useState(new Animated.Value(50));
  const name = props.attributes.friendly_name.toLowerCase();

  //Hooks
  const [collapsed, setCollapsed] = useState(true);
  const [viewWidth, setViewWidth] = useState(1);
  const [textWidth, setTextWidth] = useState(1);

  const attributeName = getAttributeName();

  // Initialize Alarm Attributes
  const battery = props.attributes.batteryLevel;
  const tamperStatus = props.attributes.tamperStatus;
  const linkQuality = props.attributes.linkQuality;
  const lastUpdate = props.attributes.lastUpdate;
  const tripState = props.attributes.trip_state;
  const smokeState = props.attributes.smoke_state;
  const gasState = props.attributes.gas_state;

  // Initialize Doorbell Attributes
  const doorbellBattery = props.state;
  const lastDingTime = props.attributes.last_ding_time;
  const lastMotionTime = props.attributes.last_motion_time

  const showError = tamperStatus && tamperStatus !== 'ok' ||
  linkQuality && linkQuality !== 'ok' || tripState && tripState !== 'off' ||
  smokeState && smokeState !== 'off' || gasState && gasState !== 'off'  || unavailable


  useEffect(() => {
    console.log(props)
    { props.state == 'unavailable' && setUnavailable(true) }
  },[])

  function animate() {
    Animated.timing(scale, {
      toValue: animated ? 1 : 0.9,
      useNativeDriver: false,
    }).start();
    Animated.timing(scaleY, {
      toValue: animated ? 1 : 3,
      useNativeDriver: false,
    }).start();
    Animated.timing(colorAnim, {
      toValue: animated ? 1 : 0,
      useNativeDriver: false,
    }).start();
    Animated.timing(translationXY, {
      toValue: !animated
        ? { x: -(viewWidth / 2.2 - textWidth / 2), y: 5 }
        // ? { x: -(100), y: 0 }
        : { x: 0, y: 0 },
      useNativeDriver: false,
    }).start();
    setAnimated(!animated);
  }

  function getBatteryIconName() {
    if (battery == 100) return 'battery-full';
    else if (battery > 70) return 'battery-three-quarters';
    else if (battery > 30) return 'battery-half';
    else return 'battery-1'

  }

  function getAttributeName() {
    if (name.includes('smoke')) return 'Smoke/CO Listener';
    else if (name.includes('alarm')) return 'Ring Alarm System';
    else if (name.includes('motion')) return 'Motion Sensor';
    else if (name.includes('contact')) return 'Contact Sensor';
    else if (name.includes('battery')) return "Battery Level";
    else if (name.includes('ding')) return "Last Ding Time";
    else return (props.attributes.friendly_name ? props.attributes.friendly_name : 'Unknown Name')

  }

  const alter = () => {
    setCollapsed(!collapsed);
  };

  if (props.type == "Alarm") {
    return (
      <View style={{ width: "100%", marginBottom: 10, }}>
        <TouchableOpacity
          onLayout={(event) => {
            const layout = event.nativeEvent.layout;
            setViewWidth(layout.width);
          }}
          onPress={() => { alter(); animate() }}
          style={[
            collapsed
              ? [styles.alarmAttributesArea]
              : [styles.alarmAttributesArea,
              { height: 35, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 },
              ]
          ]}
          activeOpacity={1}
        >
          <View style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            alignContent: 'center',
          }}
          >
            {showError && collapsed && 
              <MaterialIcons
                name={"error-outline"}
                color={'red'}
                size={30}
                style={{ position: 'absolute', left: 15 }}
              />
            }
            <Animated.View
              style={[
                styles.attHeader,
                translationXY.getLayout(),
                { transform: [{ scale: scale }] },
              ]}
            >
              <Animated.Text
                onLayout={(event) => {
                  const layout = event.nativeEvent.layout;
                  setTextWidth(layout.width);
                  // console.log('text width: ', layout.width);
                }}
                style={{                    
                  fontWeight: "bold",
                  // left: 15,
                  color: animated ? 'grey' : 'black',
                  fontSize: 16,
                  height: 22,
                  // backgroundColor: 'green',
                  transform: [{ scale: scale, }]
                }}
                >
                {getAttributeName()}
              </Animated.Text>
            </Animated.View>

            <View style={{position: 'absolute', left: viewWidth / 1.15, top: animated ? 5 : 0}}>              
                <MaterialIcons
                  color={animated ? 'grey' : 'black'}
                  name={animated ? "keyboard-arrow-up" : "keyboard-arrow-down" }
                  size={24}
                />
            </View>

          </View>
        </TouchableOpacity>

        <Collapsible collapsed={collapsed} style={styles.expanded}>

          {props.attributes && (
            <View style={{ width: '100%', }}>
              <View style={{ justifyContent: 'center', alignContent: 'center', }}>
                <View style={{ flex: 1, flexDirection: "row", flexWrap: 'wrap', height: '100%', justifyContent: 'center' }}>
                  {!unavailable && battery && !(name.includes('alarm')) &&
                    <View
                      style={[
                        styles.attribute,
                        {
                          alignSelf: "center",
                        },
                      ]}
                    >

                      <Text style={[styles.headerText, { textAlign: 'center' }]}>Battery</Text>


                      <View style={[styles.attributeText, { alignSelf: 'center', flexDirection: 'row' }]}>
                        <FontAwesome
                          name={
                            (getBatteryIconName())
                          }
                          color={battery > 30 ? "#7DEA7B" : "red"}
                          size={16}
                        />
                        <Text style={{ color: 'white' }}>
                          {" "}
                          {props.attributes.batteryLevel}%
                        </Text>
                      </View>
                    </View>
                  }

                  {!unavailable && lastUpdate &&
                    <View style={[styles.attribute, {}]}>
                      <Text style={styles.headerText}>Last Update</Text>

                      <Text style={styles.attributeText}>
                        {moment(lastUpdate).format('LL LT')}
                      </Text>
                    </View>
                  }
                  {!unavailable && tamperStatus &&
                    <View style={[styles.attribute, {}]}>
                      <Text style={styles.headerText}>Tamper Status</Text>
                      <Text style={styles.attributeText}>
                        <Feather
                          name={
                            tamperStatus == 'ok'
                              ? "check-circle"
                              : "alert-circle"
                          }
                          color={
                            tamperStatus == 'ok'
                              ? "#7DEA7B"
                              : "red"
                          }
                          size={27}
                        />
                      </Text>
                    </View>
                  }

                  {!unavailable && linkQuality &&
                    <View style={[styles.attribute, {}]}>
                      <Text style={styles.headerText}>Link Quality</Text>

                      <Text style={styles.attributeText}>

                        <Entypo name={"signal"} size={25} color={(linkQuality == 'ok') ? '#7DEA7B' : 'red'} />
                      </Text>
                    </View>
                  }

                  {!unavailable && tripState && attributeName == 'Contact Sensor' ?
                    <View style={[styles.attribute, {}]}>
                      <Text style={styles.headerText}>Contact Status</Text>
                      <Text style={styles.attributeText}>
                        <MaterialCommunityIcons
                          name={
                            tripState == 'off'
                              ? "window-closed"
                              : "window-open"
                          }
                          color={
                            tripState == 'off'
                              ? "#7DEA7B"
                              : "red"
                          }
                          size={28}
                        />
                      </Text>
                    </View> : !unavailable && tripState && attributeName == 'Motion Sensor' &&
                    <View style={[styles.attribute, {}]}>
                      <Text style={styles.headerText}>Motion Status</Text>
                      <Text style={styles.attributeText}>
                        <MaterialCommunityIcons
                          name={
                            tripState == 'off'
                              ? "motion-sensor-off"
                              : "motion-sensor"
                          }
                          color={
                            tripState == 'off'
                              ? "#7DEA7B"
                              : "red"
                          }
                          size={28}
                        />
                      </Text>
                    </View>
                  }

                  {!unavailable && smokeState &&
                    <View style={[styles.attribute, {}]}>
                      <Text style={styles.headerText}>Smoke Status</Text>
                      <Text style={styles.attributeText}>
                        <MaterialCommunityIcons
                          name={
                            smokeState == 'off'
                              ? "weather-fog"
                              : "weather-fog"
                          }
                          color={
                            smokeState == 'off'
                              ? "#7DEA7B"
                              : "red"
                          }
                          size={30}
                        />
                      </Text>
                    </View>
                  }

                  {!unavailable && gasState &&
                    <View style={[styles.attribute, {}]}>
                      <Text style={styles.headerText}>CO Status</Text>
                      <Text style={styles.attributeText}>
                        <Entypo
                          name={
                            gasState == 'off'
                              ? "air"
                              : "air"
                          }
                          color={
                            gasState == 'off'
                              ? "#7DEA7B"
                              : "red"
                          }
                          size={27}
                        />
                      </Text>
                    </View>
                  }

                  {unavailable &&
                    <View style={styles.unavailableArea}>
                      <Text style={{ color: 'white', fontSize: 17 }}> Currently Unavailable </Text>
                    </View>
                  }

                </View>
              </View>
            </View>
          )}
        </Collapsible>
      </View>
    );
  } else {
    return (
      <TouchableOpacity
        disabled={true}
        style={[styles.ringAttributesArea, lastMotionTime
          ? { width: '97%',  height: 110,  }
          : {}]}
      >
        <View style={{ flex: 1.5, justifyContent: "center" }}>
          <Text
            style={{
              textAlign: "center",
              fontWeight: "bold",
              color: "black",
              fontSize: 16,
            }}
          >
            {attributeName}
          </Text>
        </View>

        <View style={{ flex: 1, flexDirection: "row",  }}>

          {!unavailable && attributeName == "Motion Sensor" && (
            <View style={{ flexDirection: 'row', }}>
              <View
                style={
                  lastMotionTime ? 
                  {width: "50%" , bottom: '4%', justifyContent: 'center', alignItems: 'center', }:
                  {bottom: '40%', justifyContent: 'center', alignItems: 'center', }
                  }
              >
                {lastMotionTime &&
                  <Text style={{ marginBottom: 5 }}>Current Motion:</Text>
                }
                <MaterialCommunityIcons
                  name={
                    props.state == 'off'
                      ? "motion-sensor-off"
                      : "motion-sensor"
                  }
                  color={
                    props.state == 'off'
                      ? "red"
                      : "#7DEA7B"
                  }
                  size={28}
                />
              </View>
              {lastMotionTime &&               
                <View
                  style={{ width: "50%", bottom: '3%', justifyContent: 'center', alignItems: 'center', }}
                >
                  <Text style={{ marginBottom: 5 }}>Last Motion Time:</Text>
                  <Text>{moment(lastMotionTime).format('LL LT')}</Text>
                </View>
              }
            </View>
          )}

          {(!unavailable && attributeName == 'Battery Level' &&
            <View style={{ flexDirection: "row" }}>
              <FontAwesome
                name={
                  doorbellBattery > 30
                    ? doorbellBattery > 70
                      ? "battery-three-quarters"
                      : "battery-half"
                    : "battery-1"
                }
                color={doorbellBattery > 30 ? "#7DEA7B" : "red"}
                size={16}
              />
              <Text style={{}}> {doorbellBattery}%</Text>
            </View>
          )}

          {!unavailable && attributeName == "Last Ding Time" && (
            <Text style={{ textAlign: 'center', width: "60%", bottom: '5%' }}>
              {lastDingTime
                ? moment(lastDingTime).format('LL LT')
                : "Unavailable"
              }
            </Text>
          )}

          {unavailable && (
            <View
              style={{
                backgroundColor: "#44ABFF",
                borderRadius: 10,
                justifyContent: "center",
                width: "90%",
                bottom: 10,
              }}
            >
              <Text style={{ textAlign: "center", color: "white" }}>
                No Info Available Yet
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  }
};

const styles = StyleSheet.create({
  alarmAttributesArea: {
    margin: 5,
    marginBottom: 0,
    height: 60,
    width: "95%",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: "#FFFFFF",
  },
  ringAttributesArea: {
    marginVertical: 5,
    marginHorizontal: 5,
    height: 90,
    borderRadius: 15,
    width: "46%",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  attHeader: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    flex: 1,
    fontSize: 13,
    maxWidth: 120,
    marginBottom: 5,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
  attributeText: {
    flex: 2,
    fontSize: 13,
    textAlign: 'center',
    color: 'white'
  },
  attribute: {
    width: '30%',
    height: 70,
    padding: 5,
    margin: 5,
    marginHorizontal: 3,
    alignSelf: "center",
    justifyContent: "center",
    backgroundColor: '#44ABFF',
    borderRadius: 10,
  },
  expanded: {
    position: "absolute",
    backgroundColor: "white",
    alignItems: 'center',
    alignSelf: "center",
    width: "95%",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  unavailableArea: {
    height: 60,
    width: '90%',
    margin: 7,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#44ABFF'
  }
});

export { Attribute };
