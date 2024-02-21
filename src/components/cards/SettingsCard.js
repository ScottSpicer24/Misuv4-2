import React, { useState } from "react";
import { Icon } from "react-native-elements";
import Modal from "react-native-modal";
import { changeRole, changeRadius } from "../../services/appServices";
import {getCurrentPosition,setHubLocation, requestLocationPermissions,startLocationUpdates} from "../../services/locationServices";
import { getHubInfoAction } from "../../redux/Actions/getHubInfoAction";
import { useDispatch, useSelector } from "react-redux";
import {Alert} from "react-native"; 
import { showToast } from "../../utils/toast";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Platform,
  ActivityIndicator,
  Slider,
} from "react-native";

function SettingsCard(props) {
  const [isDistanceVisible, setIsDistanceVisible] = useState(false);
  const [isHubLocationVisible, setIsHubLocationVisible] = useState(false);
  const [isRoleVisible, setIsRoleVisible] = useState(false);
  const { sessionData, hubInfoData } = useSelector(state => state)
  const [accessLevel, setAccess] = useState(hubInfoData.user_type);
  const [initialRole, setInitialRole] = useState(hubInfoData.user_type);
  const [sliderValue, setSliderValue] = useState(hubInfoData.geofencing_range);
  const [isLoading, setLoading] = useState(false);
  const dispatch = useDispatch();

  async function handleClick() {
    setLoading(true)
    if (initialRole != accessLevel) {
      await changeRole(accessLevel, sessionData.idToken).then(
        setTimeout(() => {
          dispatch(getHubInfoAction(sessionData.idToken));
        }, 1500)
      );
      setIsRoleVisible(false);
      props.navigation.navigate("Loading");
    } else {
      setIsRoleVisible(false);
    }
  }

  async function handleRadius() {
    var radius = sliderValue;

    if (radius == 0 || radius === undefined) {
      radius = 1;
    }

    await changeRadius(sessionData.idToken, radius).then((e) => console.log(e));
    showToast("Geofencing radius set.");

    setIsDistanceVisible(false);
  }

  async function handleLocation() {

    if (await requestLocationPermissions() === true){
      const location = await getCurrentPosition();
      console.log("Current location: " + JSON.stringify(location));
  
      const coords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      }
      console.log("coords " + JSON.stringify(coords));
      await setHubLocation(sessionData.idToken,coords).then((data)=>{
        if (data.statusCode != 200){
          console.log(data);

        }
        showToast("Hub location set.");
      });

      await startLocationUpdates();

    }else{
      Alert.alert("Grant location permissions to use geofencing.");
    }

    // await changeRadius(sessionData.idToken, radius).then((e) => console.log(e));

    setIsHubLocationVisible(false);
  }

  let radiusModal = (
    <Modal
      isVisible={isDistanceVisible}
      transparent={true}
      onBackdropPress={() => setIsDistanceVisible(false)}
      onSwipeComplete={() => setIsDistanceVisible(false)}
      swipeDirection="down"
      backdropColor={"#00000090"}
      hasBackdrop={true}
      backdropOpacity={10}
    >
      <View style={styles.modal}>

        <View style={styles.modalHeader}>
          <Text style={styles.radiusTitle}>Set Geofencing Radius</Text>
        </View>

        <View style={styles.sliderContainer}>
          <Slider
            thumbTintColor={"#44ABFF"}
            minimumTrackTintColor={"#5BD3FF"}
            value={sliderValue}
            style={styles.slider}
            step={5}
            minimumValue={0}
            maximumValue={20}
            onValueChange={(e) => setSliderValue(e)}
          ></Slider>
        </View>

        <View style={{flex: .3,}}>
          <Text style={styles.miles}>
            {sliderValue == 0 || sliderValue === undefined ? "1 mile" : sliderValue + " miles"}
          </Text>
        </View>

        <View style={{flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center'}}>
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={() => {
                handleRadius()
                setLoading(true)
                setTimeout(() => setLoading(false), 3000)
              }
            }
          >
            {isLoading ? 
              <ActivityIndicator
                color={'white'}
                size={'small'}
              />
            :
              <Text style={{ color: "#FEFEFE", fontSize: 25 }}>Confirm</Text>
            }
          </TouchableOpacity>
        </View>
      

      </View>
    </Modal>
  );
  let locationModal = (
    <Modal
      isVisible={isHubLocationVisible}
      transparent={true}
      onBackdropPress={() => setIsHubLocationVisible(false)}
      onSwipeComplete={() => setIsHubLocationVisible(false)}
      swipeDirection="down"
      backdropColor={"#00000090"}
      hasBackdrop={true}
      backdropOpacity={10}
    >
      <View style={styles.modal}>

        <View style={styles.modalHeader}>
          <Text style={styles.radiusTitle}>Set Hub Location</Text>
        </View>

        <View style={{flex: 1, justifyContent: 'center'}}>
          <Text style={styles.body}>
            Go to the location where your hub is set up, 
            then press "capture location" to set your hub's location used for geofencing
          </Text>
        </View>


        <View style={{flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center'}}>
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={() => {
              handleLocation()
              setLoading(true)
              setTimeout(() => setLoading(false), 3000)
            }}
          >
            {isLoading ? 
              <ActivityIndicator
                color={'white'}
                size={'small'}
              />
            :
              <Text style={{ color: "#FEFEFE", fontSize: 25 }}>Capture Location</Text>
            }
          </TouchableOpacity>
        </View>

      </View>
    </Modal>
  );

  let roleModal = (
    <Modal
      isVisible={isRoleVisible}
      transparent={true}
      onBackdropPress={() => setIsRoleVisible(false)}
      onSwipeComplete={() => setIsRoleVisible(false)}
      swipeDirection="down"
      backdropColor={"#00000090"}
      hasBackdrop={true}
      backdropOpacity={1}
    >
      <View style={styles.modal}>

        <View style={styles.modalHeader}>
          <Text style={{fontWeight: 'bold', fontSize: 23}}>Modify Role</Text>
        </View>

        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: 'center',
            // backgroundColor: 'green',
          }}
        >

          <View style={styles.roleButtonView}>
            <TouchableOpacity 
              style={[
                styles.roleButton,
                {
                  backgroundColor: accessLevel == 0 ? "#7DEA7B" : "white",
                  elevation: accessLevel == 0 ? 7 : 0,
                },
              ]}              
              onPress={() => setAccess(0)}>
                <Icon
                  name="user"
                  size={35}
                  type="feather"
                  color={accessLevel == 0 ? "white" : "#3E3E3E"}
                />
                <Text style={{marginTop: 5, color: accessLevel == 0 ? "white" : "#3E3E3E" }}>
                  Guest
                </Text>
            </TouchableOpacity>
          </View>

          <View style={{flex: 1, alignItems: 'center'}}>
            <Text
              style={{
                color: "#B2B2B2",
                fontWeight: "bold",
              }}
            >
              OR
            </Text>
          </View>

          <View style={styles.roleButtonView}>
            <TouchableOpacity 
              onPress={() => setAccess(1)}
              style={[
                styles.roleButton,
                {
                  backgroundColor: accessLevel == 1 ? "#44ABFF" : "white",
                  elevation: accessLevel == 1 ? 7 : 0,
                }
              ]}
              >
                <Icon
                  name="home"
                  type="font-awesome"
                  size={35}
                  color={accessLevel == 1 ? "white" : "#3E3E3E"}
                />
                <Text style={{marginTop: 5, color: accessLevel == 1 ? "white" : "#3E3E3E" }}>
                  Owner
                </Text>
            </TouchableOpacity>
          </View>
        </View>


        <View style={{width: "100%", alignItems: 'center', flex: 1, justifyContent: 'center', backgroundColor: 'transparent'}}>
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={() => handleClick()}
          >
            {isLoading ? 
            <ActivityIndicator
              color={'white'}
              size={'small'}
            />
            :
            <Text style={{ color: "#FEFEFE", fontSize: 25 }}>Confirm</Text>
            }
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>

      <View style={styles.headerLine}>
        <Text style={styles.header}>Settings</Text>
      </View>

      <View style={styles.settingsBackground}>
        {initialRole == 1 && <TouchableOpacity
          onPress={() => setIsDistanceVisible(true)}
          style={styles.settings}
        >
          <Text style={styles.settingFont}>Geofencing Radius</Text>

          <View style={styles.icon}>
            <Icon
              type="material-icons"
              name="chevron-right"
              color="#808080"
              size={32}
            />
          </View>
        </TouchableOpacity>}

        {initialRole == 1 && <TouchableOpacity
          onPress={() => setIsHubLocationVisible(true)}
          style={styles.settings}
        >
          <Text style={styles.settingFont}>Set Hub Location</Text>

          <View style={styles.icon}>
            <Icon
              type="material-icons"
              name="chevron-right"
              color="#808080"
              size={32}
            />
          </View>
        </TouchableOpacity>}

        <TouchableOpacity
          style={[styles.settings]}
          onPress={() => setIsRoleVisible(true)}
        >
          <Text style={styles.settingFont}>Modify Role</Text>
          <View style={styles.icon}>
            <Icon
              type="material-icons"
              name="chevron-right"
              color="#808080"
              size={32}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.settings, { borderBottomColor: "#FFFFFF" }]}
        onPress={() => showToast('🤫')}
        >
          <Text style={styles.settingFont}>Notifications</Text>
          <View style={styles.icon}>
            <Icon
              type="material-icons"
              name="chevron-right"
              color="#808080"
              size={32}
            />
          </View>
        </TouchableOpacity>

        



      </View>
      
      {roleModal}
      {radiusModal}
      {locationModal}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    width: "100%",
  },
  settings: {
    borderBottomColor: "grey",
    borderBottomWidth: 0.8,
    flexDirection: "row",
    alignItems: "center",
    padding: 3,
  },
  settingsBackground: {
    width: "95%",
    alignSelf: 'center',
    backgroundColor: "white",
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  settingFont: {
    fontSize: 16,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    color: 'grey',
  },
  icon: {
    flexGrow: 1,
    alignItems: "flex-end",
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
  modalHeader:{
    flex: .7, 
    alignItems: 'center', 
    justifyContent: 'center',
  },
  modal: {
    flex: .5,
    backgroundColor: "#F1F1F1",
    borderRadius: 10,
    width: "90%",
    height: "45%",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  roleButton: {
    flex: 1,
    flexDirection: "column",
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderColor: "#3E3E3E",
  },
  confirmButton: {
    flex: .6,
    backgroundColor: "#44ABFF",
    marginTop: 40,
    borderRadius: 10,
    width: "90%",
    alignItems: "center",
    justifyContent: "center",
    height: 60,
  },
  slider: {
    width: 200,
  },
  radiusTitle: {
    // backgroundColor: 'green',
    fontWeight: 'bold',
    fontSize: 25,
    // marginBottom: 50,
  },
  miles: {
    fontSize: 20,
    marginTop: 20,
  },
  body: {
    fontSize: 18,
    // marginTop: 20,
    marginHorizontal: 10,
    textAlign: "center"
  },
  roleButtonView:{
    flex: 1.8, 
    padding: 15,
    alignSelf: 'center', 
    justifyContent: 'center',
  },
  sliderContainer:{
    flex: .5,
  },
});

export default SettingsCard;