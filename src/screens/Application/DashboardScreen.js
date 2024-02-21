import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import SearchBar from "../../components/SearchBar";
import appStyle from "../../styles/AppStyle";
import DeviceInfoCard from "../../components/cards/DeviceInfoCard";
import Modal from "react-native-modal";
import Icon from "react-native-vector-icons/Feather";
import { createSharedUser } from "../../services/sharedUserServices";
import { showToast } from "../../utils/toast";
import SwitchSelector from "react-native-switch-selector";
import { getSharedUsersListAction } from "../../redux/Actions/getSharedUsersListAction";
import { getDevicesAction } from "../../redux/Actions/getDevicesAction";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  TourGuideZone,
  TourGuideZoneByPosition,
  useTourGuideController,
} from "rn-tourguide";
import {
  TouchableWithoutFeedback,
  StyleSheet,
  Keyboard,
  TouchableOpacity,
  View,
  Text,
  TextInput,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Dimensions,
  Image,
  Animated,
} from "react-native";

var { width, height } = Dimensions.get("window"); //full width and height of screen

function DashboardScreen(props) {
  const [searchParam, setSearchParam] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [guestEmail, setGuestEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const { sharedUsersData, sessionData, devicesData, hubInfoData } = useSelector((state) => state);
  const { usageLogs } = useSelector((state) => state.logsData);
  const [view, setView] = useState(1);
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(true);
  const [isDisabled, setDisabled] = useState(true);
  const [refreshing, setRefreshing] = useState(true);
  const [onboarding, setOnboarding] = useState(false);

  const { sharedUsers } = sharedUsersData;
  const { devices } = devicesData;

  const emailRegEx =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const {
    canStart, // a boolean indicate if you can start tour guide
    start, // a function to start the tourguide
    stop, // a function  to stopping it
    eventEmitter, // an object for listening some events
  } = useTourGuideController();

  let hasLoggedIn = null;

  useEffect(() => {
    setLoading(true);
    fetchData();

    setTimeout(() => setRefreshing(false), 2000);
    setTimeout(() => setLoading(false), 4000);
  }, [props, sharedUsersData, devicesData]);

/*
  useEffect(() => {
    if(!hasLoggedIn){
      setRefreshing(false)
    }
    if (canStart && onboarding && !isLoading) {
      start();
    }
  }, [canStart, isLoading, onboarding]); // wait until everything is registered
*/

  async function fetchData() {
    hasLoggedIn = await AsyncStorage.getItem(sessionData.id + "_homeowner");
    if (!hasLoggedIn) {
      setOnboarding(true);
    }
  }
  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    dispatch(getDevicesAction(sessionData.idToken));
    dispatch(getSharedUsersListAction(sessionData.idToken));
    wait(4000).then(() => setRefreshing(false));
  }, []);

  const options = [
    {
      label: "Guests",
      value: "1",
      testID: "switch-one",
      accessibilityLabel: "switch-one",
    },
    {
      label: "Devices",
      value: "2",
      testID: "switch-one-thirty",
      accessibilityLabel: "switch-one-thirty",
    },
  ];

  const toggleView = (value) => {
    if (value != view) {
      setSearchParam("");
      setView(value);
    }
  };

  const toggleAddGuest = () => {
    setErrorMsg("");
    setDisabled(true)
    setIsVisible(!isVisible);
  };

  async function addNewGuest() {
    let str = guestEmail.split(" ").join("").toLowerCase();
    setLoading(true);
    setRefreshing(true);
    setTimeout(() => setDisabled(true), 4000);
    setTimeout(() => setLoading(false), 10000);
    setTimeout(() => setRefreshing(false), 10000);
    createSharedUser(sessionData.idToken, str)
      .then((response) => {
        if (response.statusCode === 200) {
          dispatch(getSharedUsersListAction(sessionData.idToken));
          setTimeout(() => toggleAddGuest(), 1000);
          showToast(`Hub invite sent to ${guestEmail}!`);
        } else {
          setLoading(false);
          setRefreshing(false);
          setErrorMsg("User Does not Exist");
        }
      })
      .catch((err) => {
        setErrorMsg("An error occured, try again.");
        console.log(err);
      });
  }

  let addGuestModal = (
    <Modal
      isVisible={isVisible}
      transparent={true}
      onBackdropPress={() => toggleAddGuest()}
      onSwipeComplete={() => toggleAddGuest()}
      swipeDirection="down"
      backdropColor={"#00000080"}
      backdropOpacity={1}
    >
      <View style={styles.addGuestModal}>
        <View style={styles.addGuestHeader}>
          <Icon name="users" type="feather" color="black" size={25} />
          <Text style={{ marginLeft: 10, fontSize: 20 }}>Add New Guest</Text>
        </View>

        <View
          style={{
            flex: 4,
            width: "100%",
            alignContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              flex: 1,
              paddingHorizontal: 50,
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            Send a request to your guest to have them share your home!
          </Text>

          <View style={styles.input}>
            <TextInput
              style={styles.formInput}
              autoFocus={true}
              keyboardType={"email-address"}
              onSubmitEditing={() => {
                emailRegEx.test(guestEmail)
                  ? addNewGuest()
                  : setErrorMsg("Not a Valid Email Address");
              }}
              onChangeText={(text) => {
                setGuestEmail(text),
                  text == "" ? setDisabled(true) : setDisabled(false);
              }}
              placeholder="Guest Email"
              placeholderTextColor="#808080"
            />
          </View>
          <Text style={styles.responseMsg}>{errorMsg}</Text>
        </View>

        <View style={{ flex: 2, width: "90%", alignItems: "center" }}>
          <TouchableOpacity
            disabled={isDisabled}
            style={
              isDisabled
                ? [styles.submitButton, { backgroundColor: "#26608F" }]
                : [styles.submitButton]
            }
            onPress={() => {
              emailRegEx.test(guestEmail)
                ? addNewGuest()
                : setErrorMsg("Not a Valid Email Address");
            }}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#5BD3FF" />
            ) : (
              <Text
                style={{
                  elevation: 20,
                  textAlign: "center",
                  fontSize: 22,
                  fontWeight: "bold",
                  color: "white",
                }}
              >
                Send Request
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[appStyle.container, { backgroundColor: "#E7E7E7" }]}>

        <TourGuideZoneByPosition
          zone={1}
          shape={'rectangle'}
          isTourGuide
          text={`Welcome ${hubInfoData.name} to your Home Dashboard!`}
          tooltipBottomOffset={0}
          bottom={height / 2}
          left={100}
        />

        <View style={{ marginBottom: 10, width: "60%" }}>
          <TourGuideZone
            style={{}}
            zone={2}
            text={'Here you can toggle between viewing your guests or your devices!'}
            borderRadius={16}
          >
            <SwitchSelector
              borderRadius={10}
              options={options}
              initial={0}
              textColor={"black"}
              buttonColor={"#fff"}
              backgroundColor={"lightgray"}
              borderColor={"#44ABFF"}
              height={25}
              buttonMargin={3}
              textStyle={{ fontWeight: "500" }}
              selectedTextStyle={{ color: "black", fontWeight: "500" }}
              animationDuration={300}
              onPress={(value) => toggleView(value)}
            />
          </TourGuideZone>
        </View>

        <View>
          {view == 1 && (
            <View style={{ alignSelf: "center", width: width }}>
              <View style={styles.header}>
                <SearchBar
                  setSearchParam={setSearchParam}
                  screen={"Guests"}
                />

                <TourGuideZone
                  style={{
                    marginHorizontal: 10,
                    marginLeft: 15,
                    width: "30%",
                  }}
                  zone={3}
                  text={"This is where you can add a guest to your hub to start sharing devices. \n\nLet's start your MiSu journey by inviting some guests!"}
                  borderRadius={16}
                >
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => toggleAddGuest()}
                  >
                    <Icon
                      name="user-plus"
                      size={28}
                      style={{ alignSelf: "center", color: "#FFFF" }}
                    />
                    <Text
                      style={{
                        flex: 1,
                        textAlign: "center",
                        fontWeight: "400",
                        color: "#FFFF",
                        fontSize: height > 1000 ? 21 : null,
                      }}
                    >
                      Add Guest
                    </Text>
                  </TouchableOpacity>
                </TourGuideZone>
              </View>

              <ScrollView
                style={styles.cardContainer}
                refreshControl={
                  <RefreshControl
                    colors={["#FFFFFF"]}
                    tintColor={"#44ABFF"}
                    progressBackgroundColor={"#44ABFF"}
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
              >

                {/* NO GUESTS ADDED VIEW */}
                {(sharedUsers == null || sharedUsers.length == 0) && (!refreshing) &&
                  (
                    <TouchableOpacity 
                      style={{ justifyContent: "center" }}
                      activeOpacity={1}
                    >
                      <Image
                        style={{
                          alignSelf: "center",
                          margin: 20,
                          marginTop: 50,
                          height: 220,
                          resizeMode: "contain",
                        }}
                        source={require("../../assets/noGuests.png")}
                      ></Image>
                      <Text style={{ textAlign: "center", fontSize: 25 }}>
                        {" "}
                        No Guests Added{" "}
                      </Text>
                    </TouchableOpacity>
                  )}

                {/* LIST OF GUESTS VIEW */}
                {Array.isArray(sharedUsers) &&
                  sharedUsers.filter((guest) =>
                    guest.name.toLowerCase().includes(searchParam.toLowerCase())
                  )
                    .map((entry, i) => (
                      <DeviceInfoCard
                        type={"GuestCard"}
                        key={i}
                        cardIndex={i}
                        entry={entry}
                        navigation={props.navigation}
                        lastAction={usageLogs?.filter(
                          (item) => item.guest_email == entry.guest_email
                        )}
                      />
                    ))}
              </ScrollView>
            </View>
          )}

          {view == 2 && (
            <View style={{ width, height: height / 1.35 }}>
              <View style={[styles.header]}>
                <SearchBar
                  setSearchParam={setSearchParam}
                  screen={"Devices"}
                />
              </View>
              <ScrollView
                style={styles.cardContainer}
                refreshControl={
                  <RefreshControl
                    colors={["#FFFFFF"]}
                    tintColor={"#44ABFF"}
                    progressBackgroundColor={"#44ABFF"}
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
              >

                {/* NO DEVICES ADDED VIEW */}
                {(devices.length == 0) && (!refreshing) &&
                  <TouchableOpacity 
                    activeOpacity={1}
                    style={{ justifyContent: "center" }}
                  >
                    <Image
                      style={{
                        alignSelf: "center",
                        margin: 20,
                        marginTop: 50,
                        height: 220,
                        resizeMode: "contain",
                      }}
                      source={require("../../assets/void.png")}
                    ></Image>
                    <Text style={{ textAlign: "center", fontSize: 25 }}>
                      {" "}
                      No Devices Added{" "}
                    </Text>
                  </TouchableOpacity>}


                {/* LIST OF DEVICES VIEW */}
                {Array.isArray(devices) && devices.filter((device) =>
                  device.name
                    .toLowerCase()
                    .includes(searchParam.toLowerCase())
                )
                  .map((entry, i) => (
                    <DeviceInfoCard
                      type={"DeviceCard"}
                      key={i}
                      cardIndex={i}
                      entry={entry}
                      navigation={props.navigation}
                      lastAction={usageLogs?.filter(
                        (item) => item.device_name == entry.name
                      )}
                    />
                  ))}
              </ScrollView>
            </View>
          )}
        </View>
        {addGuestModal}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    height: height / 1.5,
    alignSelf: "center",
    width: "95%",
  },
  header: {
    flexDirection: "row",
    marginTop: 0,
    margin: 12,
    alignItems: "center",
  },
  button: {
    // position: "absolute",
    alignContent: "center",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "#44ABFF",
    height: 45,
    width: "100%",
    borderRadius: 10,
    paddingHorizontal: 17,
    elevation: 2,
  },
  addGuest: {
    alignItems: "center",
  },
  addGuestModal: {
    position: "absolute",
    left: 0,
    top: 150,
    width: "100%",
    height: 250,
    borderRadius: 10,
    marginBottom: 80,
    backgroundColor: "#FFFFFF",
    alignSelf: "center",
    alignItems: "center",
  },

  addGuestHeader: {
    flex: 1,
    marginTop: 25,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  submitButton: {
    borderRadius: 10,
    height: "75%",
    width: "100%",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#289EFF",
  },
  responseMsg: {
    color: "red",
    marginTop: 5,
  },
  input: {
    flex: 0.8,
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 10,
    width: "90%",
    justifyContent: "center",
    borderColor: "#D6D6D6",
    backgroundColor: "#F3F3F3",
  },
  formInput: {
    fontSize: 15,
    width: width / 1.5,
    marginLeft: 20,
    // height: 50,
    // width: 280,
  },
});

export default DashboardScreen;
