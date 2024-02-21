import React, { useState } from "react";
import Collapsible from "react-native-collapsible";
import SampleDeviceList from "../../components/cards/ListEntries/SampleDeviceList";
import LastActionCard from "../../components/cards/LastActionCard";
import UserAvatar from "react-native-user-avatar";
import { Icon } from "react-native-elements";
import { getIcon } from "../../utils/getIcon";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";

const { width, height } = Dimensions.get('window');

function DeviceInfoCard(props) {
  const [collapsed, setCollapsed] = useState(true);
  let numDevicesGuests = (props.entry.devices ? props.entry.devices.length : props.entry.guests.length)

  function handleClick() {
    if (props.type == "GuestCard") {
      props.navigation.push("GuestRemove", { 
        user: props.entry 
      });
    } else if (props.type == "DeviceCard") {
      props.navigation.push("HomeownerControl", { 
        deviceIndex: props.cardIndex 
      });
    }
  }

  const alter = () => {
    setCollapsed(!collapsed);
  };

  const renderIcons = (deviceType) => {
    const { iconName, iconType } = getIcon(deviceType);
    return (
      <Icon
        name={iconName}
        type={iconType}
        size={45}
        color="#60B8FF"
      />
    );
  }

  let list = (
    <SampleDeviceList
      screen={props.type == "HubCard" ? "Hubs" : props.type == "GuestCard" ? "Guests" : "Devices"}
      entry={props.entry}
      cardIndex={props.cardIndex}
      navigation={props.navigation}
    />
  );

  const panel = (
    <View style={styles.container}>
      <TouchableOpacity style={collapsed ?
        styles.headerCollapsed :
        [styles.headerCollapsed, { borderBottomLeftRadius: 0, borderBottomRightRadius: 0, }]}
        onPress={() => handleClick()}
      >
        {props.type == "GuestCard" ? (
          <View style={styles.devIcon}>
            <UserAvatar size={45} borderRadius={30} name={props.entry.name || props.entry.sharer_name} />
          </View>
        ) : props.type == "HubCard" ? (
          <View style={styles.devIcon2}>
            <Icon name="home" type="feather" size={45} />
          </View>
        ) :
          <View style={styles.devIcon}>
            {renderIcons(props.entry.type)}
          </View>
        }

        <View style={{ flex: 0.7, height: 40, alignItems: 'center', flexDirection: 'row' }}>
          <Text style={[styles.userName, { flex: 4 }]}>{props.entry.name || props.entry.sharer_name}</Text>
          {props.type == "GuestCard" && props.entry?.accepted == 0 ? (
            <Text style={styles.pending}>Pending</Text>
          ) : (
            <View style={{ flex: 2, alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}>
              <View style={{ justifyContent: 'center', height: 35, width: 35, right: 0, backgroundColor: '#7DEA7B', borderRadius: 20, alignSelf: 'flex-end' }}>
                <Text style={[styles.userName, { color: "white", textAlign: 'center' }]}>{numDevicesGuests}</Text>
              </View>
            </View>
          )}
        </View>
        <TouchableOpacity style={styles.dropDownButtom} onPress={alter}>
          {collapsed ? (
            <Icon name="chevron-right" type="feather" size={35} />
          ) : (
            <Icon name="chevron-down" type="feather" size={35} color="#7DEA7B" />
          )}
        </TouchableOpacity>
      </TouchableOpacity>

      <Collapsible collapsed={collapsed} style={styles.expanded}>
        <View style={styles.activeGuests}>
          <Text style={styles.text}>
            {props.type == "DeviceCard" ? "Active Guests" : "Devices"}
          </Text>
        </View>

        <View style={{ alignContent: 'center', alignSelf: 'center', alignItems: 'center', width: '100%' }}>
          {numDevicesGuests == 0 && props.type == 'HubCard' ?
            <View style={{ justifyContent: 'center', width: '90%', backgroundColor: '#44ABFF', height: height / 10, borderRadius: 15, margin: 10 }}>
              <Text style={{ padding: 5, textAlign: 'center', fontSize: 18, color: 'white' }}>
                Please request access from home owner to use their smart devices
              </Text>
            </View>
            :
            <View style={styles.guestList}>{list}</View>
          }
        </View>

        {props.type != "HubCard" && props.entry?.accepted == 1 && (
          <LastActionCard
            screen={props.type}
            navigation={props.navigation}
            lastAction={props.lastAction}
          />
        )}
      </Collapsible>
    </View>
  );

  return (
    <View>
      <TouchableWithoutFeedback>{panel}</TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  activeGuests: {
    alignContent: "center",
    marginHorizontal: 15,
    marginTop: 10,
    marginBottom: 7,
    // padding: 15,
  },
  text: {
    fontWeight: "700",
    fontSize: 18,
    color: "#404040",
  },
  container: {
    width: "100%",
    marginBottom: 15,
  },
  headerCollapsed: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    height: 80,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    borderTopRightRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
  },
  guestList: {
    width: "100%",
    paddingHorizontal: 5,
    // backgroundColor: 'green',
    // alignItems: "center",
  },
  dropDownButtom: {
    backgroundColor: "#FFFFFF",
    position: "absolute",
    right: 0,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    height: "100%",
    width: "20%",
    justifyContent: "center",
    alignItems: "center",
    borderLeftWidth: 0.2,
    borderColor: "#353535",
  },
  expanded: {
    position: "absolute",
    backgroundColor: "#FFFFFF",
    width: "100%",
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  devIcon: {
    alignSelf: "center",
    height: 46,
    width: 46,
    marginHorizontal: 10,
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
  userName: {
    fontWeight: "bold",
    fontSize: 16,
  },
  devIcon2: {
    height: 46,
    width: 46,
    marginHorizontal: 15,
    borderRadius: 6,
  },
  pending: {
    marginLeft: 40,
    color: "red",
    borderWidth: 1,
    borderRadius: 10,
    padding: 5,
    borderColor: "red",
  },
});

export default DeviceInfoCard;