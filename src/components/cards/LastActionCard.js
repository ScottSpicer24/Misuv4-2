import React, { useState, useEffect } from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { Icon } from "react-native-elements";
import { getIcon } from "../../utils/getIcon";


function LastActionCard(props) {
  const [lastAction, setLastAction] = useState(null);
  const [iconName, setIconName] = useState("");
  const [iconType, setIconType] = useState("");
  const [iconColor, setIconColor] = useState("");

  useEffect(() => {
    if (props.lastAction != null && props.lastAction.length > 0) {
      setLastAction(props.lastAction[0]);

      const type = props.lastAction[0].device_type;
      const action = props.lastAction[0].device_action;
      
      // Initialize icons based on device type
      const { iconName, iconType, iconColor } = getIcon(type, action);
      setIconName(iconName);
      setIconType(iconType);
      setIconColor(iconColor);
    }
  }, [props]);

  const capitalize = (string) => {
    if (string == null) return null;
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <View style={{ marginTop: -5 }}>
      {lastAction != null && (
        <View style={styles.container}>


          <View style={styles.headerStyle}>
            <Text style={styles.headerText}>Recent Activity</Text>
            <View style={styles.activityView}>
              <TouchableOpacity onPress={() =>
                props.navigation.navigate("Logs", {
                  guest: lastAction.secondary_user
                })}>
                <Text style={styles.lastActivityText}>View Activity</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.headerStyle}>
            <React.Fragment>
              <View
                style={
                  [
                    styles.squareIconHolder,
                    { borderColor: iconColor },
                  ]
                }
              >
                <Icon
                  name={iconName}
                  type={iconType}
                  size={32}
                  color={iconColor}
                />
              </View>
              {props.screen == "GuestCard" ? (
                <View>
                  {lastAction.device_action != null ? (
                    <Text style={styles.text}>
                      {" "}
                      {capitalize(lastAction.device_action)}ed the{" "}
                      {lastAction.device_name}{" "}
                    </Text>
                  ) :
                    (
                      <Text style={styles.text}>
                        {" "}
                        {lastAction.device_name}{" "}
                      </Text>
                    )
                  }
                  <Text style={styles.dateText}>
                    {" "}
                    {lastAction.date} at {lastAction.time}{" "}
                  </Text>
                </View>
              ) : (
                <View>
                  <Text style={styles.text}>
                    {" "}
                    {lastAction.secondary_user} {lastAction.device_action}ed the{" "}
                    {lastAction.device_name}{" "}
                  </Text>
                  <Text style={styles.dateText}>
                    {" "}
                    {lastAction.date} at {lastAction.time}{" "}
                  </Text>
                </View>
              )}
            </React.Fragment>
            {/* )} */}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 15,
  },

  iconHolder: {
    marginLeft: 27,
    backgroundColor: "green",
    borderRadius: 41,
    width: 50,
    height: 50,
    flexDirection: "row",
  },

  squareIconHolder: {
    marginLeft: 27,
    // backgroundColor: "green",
    borderRadius: 5,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    width: 45,
    height: 45,
    flexDirection: "row",
  },

  text: {
    fontSize: 14,
    marginLeft: 7,
    color: "#515151",
    textAlign: "left",
  },

  dateText: {
    fontSize: 10,
    marginLeft: 8,
    marginTop: 5,
    marginBottom: 5,
    textAlign: "left",
    color: "#5E5E5E",
  },

  headerText: {
    fontWeight: "700",
    fontSize: 18,
    color: "#404040",
    padding: 15,
  },

  headerStyle: {
    flexDirection: "row",
    alignItems: "center",
  },

  lastActivityText: {
    textAlign: "center",
    fontSize: 12,
  },
  activityView: {
    position: "absolute",
    right: 15,
  },
});

export default LastActionCard;