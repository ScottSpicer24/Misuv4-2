import React, { useState, useEffect } from "react";
import { Icon } from "react-native-elements";
import { MaterialIcons } from "react-native-vector-icons";
import Collapsible from "react-native-collapsible";
import UserAvatar from "react-native-user-avatar";
import Modal from "react-native-modal";
import { ScrollView } from "react-native";
import { deleteHub } from "../../services/hubServices";
import { deleteASharedUser } from "../../services/sharedUserServices";
import { handleLeavingHub } from "../../services/hubServices";
import { useDispatch, useSelector } from "react-redux";
import { getSharedDevicesListAction } from "../../redux/Actions/getSharedDevicesListAction";
import { getSharedUsersListAction } from "../../redux/Actions/getSharedUsersListAction";
import { getHubInfoAction } from "../../redux/Actions/getHubInfoAction";
import { useIsFocused } from "@react-navigation/native";
import { showToast } from "../../utils/toast";
import {
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  View,
  Text,
  ActivityIndicator,
  Platform
} from "react-native";

var width = Dimensions.get("window").width; //full width
var height = Dimensions.get("window").height; //full height

function YourHubCard(props) {
  const { hubInfoData, sessionData, sharedUsersData, sharedDevicesData } = useSelector(state => state)
  const [registering, setRegistering] = useState(hubInfoData?.hub_registered == 0 ? false : true);
  const [isVisible, setIsVisible] = useState(false);
  const [isVisibleGuests, setIsVisibleGuests] = useState(false);
  const [isVisibleGuestsDisconnect, setIsVisibleGuestsDisconnect] = useState(false);
  const [hubEntryName, setHubEntryName] = useState("");
  const [selected, setSelected] = useState([]);
  const [isDisabled, setDisabled] = useState(true);
  const [isLoading, setLoading] = useState(false)
  const [sharedAccUsers, setSharedAccUsers] = useState(null);
  const [collapsed, setCollapsed] = useState(true);
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  useEffect(() => {
    setLoading(false);
    setCollapsed(true);
    setSharedAccUsers(sharedUsersData.sharedUsers);
    setRegistering(hubInfoData?.hub_registered == 0 ? false : true)
  }, [hubInfoData.hub_registered, isFocused, sharedUsersData]);

  const registerHub = () => {
    props.navigation.navigate("Hub");
  };

  const openDeleteModal = () => {
    setIsVisible(!isVisible);
  };

  const openRemoveGuestsModal = () => {
    setIsVisibleGuests(!isVisibleGuests);
    setLoading(false)
    setDisabled(true)
    setSelected([]);
  };

  const openGuestDisconnectModal = (name) => {
    setIsVisibleGuestsDisconnect(!isVisible);
    setHubEntryName(name);
  };

  const alter = () => {
    setCollapsed(!collapsed);
  };

  const removeGuests = () => {
    setLoading(true)
    selected.forEach(guest => {
      deleteASharedUser(guest.login_credentials_id, sessionData.idToken)
        .then(() => {
          dispatch(getSharedDevicesListAction(sessionData.idToken));
          dispatch(getSharedUsersListAction(sessionData.idToken));
          showToast(`Successfully removed from your hub`);
        })
        .catch((err) => {
          showToast("Error trying to delete guest from hub");
          console.log(err);
        });
    }
    )
    setTimeout(() => { setLoading(false), openRemoveGuestsModal() }, 3000)

  }

  const selectUser = (entry) => {

    // Removes user if theyre already selected
    if (selected.length > 0 && selected.includes(entry)) {
      // setDisabled(false)
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

  let deleteModal = (
    <Modal
      isVisible={isVisible}
      transparent={true}
      onBackdropPress={() => setIsVisible(false)}
      onSwipeComplete={() => setIsVisible(false)}
      swipeDirection="down"
    >
      <View style={styles.disconnectModal}>
        <View style={styles.disconnectHeader}>
          <Text style={{ fontWeight: 'bold', marginLeft: 10, fontSize: 20 }}>Delete Hub</Text>
        </View>
        
        <Text
          style={{
            textAlign: "center",
            justifyContent: "center",
            marginLeft: 5,
            marginRight: 5,
            flex: 1,
          }}
        >
          {"Are you sure you want to delete your hub?\nFuture hub connection will require you to install the MISU connection package back onto your Raspberry Pi."}
        </Text>

        <View style={{flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center'}}>
          <TouchableOpacity
            style={[styles.submitButton, {flex: .5,}]}
            onPress={
              () => {
                setLoading(true);
                deleteHub(sessionData.idToken).then((res) => {
                  if (res.statusCode == 200) {
                    dispatch(getSharedDevicesListAction(sessionData.idToken));
                    dispatch(getSharedUsersListAction(sessionData.idToken));
                    dispatch(getHubInfoAction(sessionData.idToken));
                    setIsVisible(false);
                    showToast("Successfully disconnected your hub");
                    setLoading(false);
                  }
                  else {
                    setLoading(false);
                    showToast(`Unable to delete hub. Please try again later.`);
                  }
                })
                  .catch(() => {
                    setLoading(false);
                    showToast(`Unable to delete hub. Please try again later.`);
                  });
              }
            }
          >
            {isLoading
              ?
              <ActivityIndicator size="small" color="#5BD3FF" />
              :
              <View style={{}}>
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 22,
                    fontWeight: "bold",
                    color: "white",
                  }}
                >
                  Delete Hub
                </Text>
              </View>

            }
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  let guestDisconnectModal = (
    <Modal
      isVisible={isVisibleGuestsDisconnect}
      backdropColor={"#00000080"}
      backdropOpacity={1}
      hasBackdrop={true}
      transparent={true}
      onBackdropPress={() => setIsVisibleGuestsDisconnect(false)}
      onSwipeComplete={() => setIsVisibleGuestsDisconnect(false)}
      swipeDirection="down"
    >
      <View style={styles.disconnectModal}>
        <View style={styles.disconnectHeader}>
          <Text style={{ fontWeight: 'bold', marginLeft: 10, fontSize: 20 }}>
            Disconnect from Hub
          </Text>
        </View>

        <Text
          style={{
            textAlign: "center",
            justifyContent: "center",
            marginLeft: 5,
            marginRight: 5,
            flex: 1,
          }}
        >
          Are you sure you want to disconnect from {hubEntryName.sharer_name}'s
          hub?
        </Text>

        <View style={{ flex: 1, width: '90%' }}>
          <TouchableOpacity
            style={[styles.submitButton, { width: '100%', backgroundColor: '#ea5f5f' }]}
            onPress={
              () => {
                handleLeavingHub(hubEntryName.login_credentials_id, 2, sessionData.idToken)
                  .then(() => {
                    dispatch(getSharedDevicesListAction(sessionData.idToken));
                    setIsVisibleGuestsDisconnect(false);
                  });
                setLoading(true)
                setTimeout(() => setLoading(false), 3000)
              }
            }
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
                Disconnect Hub
              </Text>
          }
          </TouchableOpacity>
        </View>
      </View>
    </Modal >
  );

  let removeGuestsModal = (
    <Modal
      isVisible={isVisibleGuests}
      transparent={true}
      backdropOpacity={1}
      backdropColor={"#00000080"}
      onBackdropPress={() => setIsVisibleGuests(false)}
      onSwipeComplete={() => setIsVisibleGuests(false)}
      propagateSwipe={true}
      swipeDirection="down"
    >
      <View style={styles.removeGuestsModal}>
        <View style={styles.disconnectHeader}>
          <Text style={{ fontWeight: 'bold', marginLeft: 10, fontSize: 24 }}>Remove Guests</Text>
        </View>

        <View style={styles.item}></View>
        <View style={{ flex: 2.2, width: "100%" }}>
          <ScrollView>
            {sharedAccUsers && sharedAccUsers?.map((entry, i) => (
              <View key={i} style={styles.cardCon}>
                <TouchableOpacity
                  onPress={() => {
                    selectUser(entry);
                  }}
                >
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

        <View style={{ flex: .7, width: "100%", alignItems: 'center' }}>
          <TouchableOpacity
            disabled={isDisabled}
            style={isDisabled ? [styles.submitButton, { backgroundColor: "#26608F" }] : [styles.submitButton]}
            onPress={() => {
              removeGuests();
            }
            }
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
                Remove Guest
              </Text>
            }
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerLine}>
        {hubInfoData.user_type == 1 ?
          <Text style={styles.header}>My Hub</Text> : <Text style={styles.header}>My Hubs</Text>}
      </View>


      {/* -------- HubCard for Home Owner Start ------------ */}

      {registering == true && hubInfoData.user_type == 1 && (
        <View>
          <TouchableOpacity
            style={collapsed ? !hubInfoData.package_installed ? [styles.headerCollapsed, { backgroundColor: "#26608F" }] :
              styles.headerCollapsed : [styles.headerCollapsed, !hubInfoData.package_installed
                ? { borderBottomLeftRadius: 0, borderBottomRightRadius: 0, backgroundColor: "#26608F" }
                : { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }]}
            onPress={alter}>

            <View style={styles.devIcon}>
              <Image
                style={{
                  height: 40,
                  width: 40,
                }}
                source={require("../../assets/icons/raspberry.png")}
              />
            </View>


            <Text style={styles.hubName}>Raspberry Pi</Text>
            <TouchableOpacity style={[styles.dropDownButton, !hubInfoData.package_installed ? { backgroundColor: "#26608F" } : { backgroundColor: "#44ABFF", }]} onPress={alter}>
              {!hubInfoData.package_installed ?
                <Icon name="error-outline" type="material" size={30} color="red" />
                : collapsed ? (
                  <Icon name="chevron-right" type="feather" size={35} color="#FFFFFF" />
                ) : (
                  <Icon name="chevron-down" type="feather" size={35} color="#7DEA7B" />
                )}
            </TouchableOpacity>
          </TouchableOpacity>

          <Collapsible collapsed={collapsed} style={[styles.expanded, !hubInfoData.package_installed ? {backgroundColor:"#26608F"} : {backgroundColor:"#E62642"}]}>
            {hubInfoData.package_installed ?
              <>
                <TouchableOpacity
                  style={[styles.hubOptions, { borderTopWidth: 0.5, borderColor: 'white', backgroundColor: '#44ABFF' }]}
                  onPress={() => openRemoveGuestsModal()}>
                  <Text style={styles.hubOptionsText}>Remove Guests</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.hubOptions, { borderBottomLeftRadius: 15, borderBottomRightRadius: 15, }]}
                  onPress={() => openDeleteModal()}>
                  <Text style={styles.hubOptionsText}>Delete Hub</Text>
                </TouchableOpacity>
              </>
              :
              <View style={{ backgroundColor: 'white', borderRadius: 15, padding: 15, margin: 5, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: '#E62642' }}>
                  {"MiSu Connection Package has not yet been installed on your Raspberry Pi.\n"}
                </Text>
                <Text style={{ color: '#44ABFF', textAlign: 'center' }}>
                  {"For detailed instructions on how to finish setting up your hub please visit:"}
                </Text>
                <Text style={{fontWeight: "bold", color: '#44ABFF'}}>{"misu.com/setup"}</Text>
              </View>
            }
          </Collapsible>
        </View>
      )}

      {/* -------- HubCard for Home Owner End ------------ */}


      {/* -------- Return if home owner is not connected to hub ------------ */}
      {registering == false && hubInfoData.user_type == 1 && (
        <View style={styles.noHub}>

          <Text style={{ fontSize: 17 }}>No Hub Connected </Text>
          <TouchableOpacity
            style={styles.connectButton}
            onPress={() => registerHub()}
          >
            <Text style={{ fontSize: 22, color: "#15A3DF" }}>Connect Hub</Text>
          </TouchableOpacity>
        </View>
      )}


      {/* -------- HubCards for Guest Start ------------ */}

      {hubInfoData.user_type == 0 &&
        ((sharedDevicesData?.sharedDevices?.length == 0 || (sharedDevicesData?.sharedDevices?.filter((hub) => hub.accepted == 1).length == 0)) ? (
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 22, color: "black" }}>No Hubs Connected</Text>
            <View style={{ backgroundColor: 'white', borderRadius: 15, padding: 15, margin: 5, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: '#44ABFF' }}>
                Request access to a homeowner's smart home to gain accessibility to their devices!
              </Text>
            </View>
          </View>
        ) : (
          <ScrollView
            style={{ borderRadius: 15, }}
            horizontal={true}
          >
            <View style={styles.guestHubView}>
              {hubInfoData?.user_type == 0 &&
                sharedDevicesData &&
                sharedDevicesData.sharedDevices?.filter((hub) => hub.accepted == 1).map((entry, i) => (
                  <View key={i}>
                    <View style={styles.horizontalHubs}>
                      <View style={{ flex: 1.5, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={styles.guestHubText}>
                          {entry.sharer_name}'s hub
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={styles.disconnectGuestButton}
                        onPress={() => {
                          setHubEntryName(entry);
                          openGuestDisconnectModal(entry);
                        }}
                      >
                        <Text style={styles.guestRedButtonText}>Disconnect</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
            </View>

            {/* <TouchableOpacity style={[styles.addHubButton]}>
            <MaterialIcons style={{
              textAlign: 'center',
              alignSelf: 'center',
              left: Platform.OS === "ios" ? 0 : 6,
              height: 49
            }} color={"#FFFFFF"} name="add-box" size={50}> </MaterialIcons>
          </TouchableOpacity> */}
          </ScrollView>
        ))}
      {/* -------- HubCards for Guest End ------------ */}


      {deleteModal}
      {removeGuestsModal}
      {guestDisconnectModal}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    flexDirection: "column",
    paddingTop: 10,
    paddingBottom: 20,
    borderBottomColor: "#828282",
    borderBottomWidth: 0.9,
    width: "95%",
  },
  connectButton: {
    borderColor: "gray",
    borderWidth: 0,
    backgroundColor: "white",
    margin: 10,
    height: 50,
    width: "95%",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  guestHubText: {
    textAlign: 'center',
    color: 'white',
    width: "90%",
    padding: 5,
    fontSize: 16,
  },
  guestRedButtonText: {
    alignSelf: 'center',
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },

  horizontalHubs: {
    flex: 1,
    backgroundColor: '#44ABFF',
    borderRadius: 15,
    marginHorizontal: 5,
    justifyContent: 'center',
    width: width / 4,
  },

  addHubButton: {
    flex: 1,
    marginVertical: 5,
    backgroundColor: '#44ABFF',
    borderRadius: 15,
    justifyContent: 'center',
  },

  guestHubView: {
    flexDirection: 'row',
    padding: 5,
    borderRadius: 15,
    height: height / 7,
  },

  seperator: {
    marginTop: 10,
    marginBottom: 10,
    borderWidth: 0.5,
    borderColor: "#888888",
  },

  disconnectGuestButton: {
    flex: 1,
    backgroundColor: "#ea5f5f",
    borderRadius: 15,
    width: "100%",
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    alignSelf: "center",
    justifyContent: "center",
    height: 30,
    paddingHorizontal: 10,
  },
  raspPi: {
    height: 35,
    width: 35,
    marginRight: 5,
  },
  cardCon: {
    flexDirection: "column",
    alignSelf: "center",
    justifyContent: "center",
    marginLeft: 20,
    marginRight: 20,
    alignSelf: "stretch",
  },
  modal: {
    backgroundColor: "#F1F1F1",
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 10,
    width: 300,
    alignSelf: "center",
    alignItems: "center",
  },
  verticleColumns: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginLeft: 10,
  },
  verticleMiddleColumns: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginRight: 8,
    marginLeft: 15,
    marginBottom: 20,
  },
  newColumn: {
    width: "100%",
    marginTop: 10,
  },
  userHubInfo: {
    flexDirection: "row",
    marginTop: 0,
    height: "60%",
    alignItems: "center",
    justifyContent: "center",
  },
  hubDisplay: {
    backgroundColor: "#44ABFF",
    borderRadius: 15,
    height: "80%",
    width: "95%",
    padding: 5,
    marginLeft: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  hubStats: {
    justifyContent: "center",

    height: "60%",
    marginLeft: 30,
  },
  editBox: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    right: 15,
    justifyContent: "flex-end",
    width: 40,
    height: 25,
  },
  gear: {
    height: 16,
    width: 16,
    marginRight: 5,
  },
  header: {
    color: "black",
    fontSize: 30,
    paddingLeft: 10,
    fontWeight: "bold",
  },
  headerLine: {
    flexDirection: "row",
    marginBottom: 10,
  },
  hardwareType: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },

  redButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
  cardText: {
    fontSize: 16,
    alignSelf: "center",
    marginLeft: 20,
  },
  noHub: {
    alignItems: "center",
    justifyContent: "center",
  },

  disconnectModal: {
    flex: .35,
    backgroundColor: "#F1F1F1",
    borderRadius: 10,
    width: "90%",
    height: "45%",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },

  removeGuestsModal: {
    borderRadius: 10,
    height: "50%",
    width: "80%",
    alignSelf: "center",
    alignItems: "center",
    backgroundColor: "#F1F1F1",
  },

  disconnectHeader: {
    flex: .7, 
    alignItems: 'center', 
    justifyContent: 'center',
    flexDirection: "row",
  },

  submitButton: {
    borderRadius: 10,
    width: "90%",
    flex: .8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#289EFF",
  },
  hubOptions: {
    backgroundColor: '#E62642',
    borderBottomColor: "grey",
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: "center",
    padding: 10,
  },
  hubOptionsText: {
    alignSelf: "center",
    fontWeight: Platform.OS === "ios" ? "500" : 'bold',
    fontSize: 18,
    color: "#FFFFFF",
  },
  headerCollapsed: {
    height: height / 12,
    width: "90%",
    backgroundColor: "#44ABFF",
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    borderTopRightRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: 'center',
  },
  dropDownButton: {
    backgroundColor: "#44ABFF",
    position: "absolute",
    right: 0,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    height: "80%",
    width: "20%",
    justifyContent: "center",
    alignItems: "center",
    borderLeftWidth: 1,
    borderColor: "#FFFFFF",
  },
  expanded: {
    backgroundColor: "#E62642",
    width: "90%",
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    alignSelf: 'center',
  },
  devIcon: {
    marginLeft: 10,
  },
  iconContainer: {
    height: 30,
    width: 30,
    alignSelf: "center",
    justifyContent: "center",
  },
  row: {
    margin: 2,
    marginLeft: 40,
    paddingBottom: 0,
    flexDirection: "row",
  },
  hubName: {
    fontWeight: "bold",
    marginLeft: 5,
    fontSize: 16,
    color: "#FFFFFF"
  },
});

export default YourHubCard;
