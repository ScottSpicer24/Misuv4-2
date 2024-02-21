import * as React from "react";
import { View, Text } from "react-native";
import { Icon } from "react-native-elements";
import LogStyle from "../../../styles/LogStyle";
import { getLogDetails } from "../../../utils/getLogDetails"

const formatImage = (log) => {
  if (log.type) {
    if (log.type === "schedule")
      return (
        <Icon
          containerStyle={{
            alignItems: "flex-start",
            marginTop: 10,
          }}
          size={45}
          color="#44ABFF"
          rounded
          name="insert-invitation"
          type="material"
        />
      );
    else if (log.type === "schedule_time")
      return (
        <Icon
          containerStyle={{
            alignItems: "flex-start",
            marginTop: 10,
          }}
          size={45}
          color="#44ABFF"
          rounded
          name="calendar-clock"
          type="material-community"
        />
      );
    else if (log.type === "device_invitation")
      return (
        <Icon
          containerStyle={{
            alignItems: "flex-start",
            marginTop: 10,
          }}
          size={45}
          color="#44ABFF"
          rounded
          name="add-circle-outline"
          type="material"
        />
      );
    else if (log.type === "access")
      return (
        <Icon
          containerStyle={{
            alignItems: "flex-start",
            marginTop: 10,
          }}
          size={45}
          color= {log.content.includes("gave") ? "#7DEA7B" : "#ea5f5f"}
          rounded
          name="rule"
          type="material"
        />
      )
    else if (log.type === "hub_invitation")
      return (
        <Icon
          containerStyle={{
            alignItems: "flex-start",
            marginTop: 10,
          }}
          size={45}
          color="#44ABFF"
          rounded
          name="home-plus-outline"
          type="material-community"
        />
      );
    else if (log.type === "invitation_accepted") {
      return (
        <Icon
          containerStyle={{
            alignItems: "flex-start",
            marginTop: 10,
          }}
          size={45}
          color="#7DEA7B"
          rounded
          name="account-check-outline"
          type="material-community"
        />
      );
    } else if (log.type === "invitation_rejected") {
      return (
        <Icon
          containerStyle={{
            alignItems: "flex-start",
            marginTop: 10,
          }}
          size={45}
          color="#ea5f5f"
          rounded
          name="account-cancel-outline"
          type="material-community"
        />
      );
    }
    else if (log.type === "removed_device")
      return (
        <Icon
          containerStyle={{
            alignItems: "flex-start",
            marginTop: 10,
          }}
          size={45}
          color="#ea5f5f"
          rounded
          name="remove-circle-outline"
          type="material"
        />
      );
    else if (log.type === "removed_hub")
      return (
        <Icon
          containerStyle={{
            alignItems: "flex-start",
            marginTop: 10,
          }}
          size={45}
          color="#ea5f5f"
          rounded
          name="home-remove-outline"
          type="material-community"
        />
      );
    else if (log.type === "left_hub") {
      return (
        <Icon
          containerStyle={{
            alignItems: "flex-start",
            marginTop: 10,
            marginLeft: 5
          }}
          size={45}
          color="#ea5f5f"
          rounded
          name="sign-out"
          type="font-awesome"
        />
      );
    }
      // needs more details
      else if (log.type === "device_change") {
        const { name, color, type, } = getLogDetails(log);
        return (
          <Icon
            containerStyle={{
              alignItems: "flex-start",
              marginTop: 10,
              marginLeft: 5
            }}
            size={45}
            color={color}
            rounded
            name={name}
            type={type}
          />
        );
      }
      // needs more details
      else if (log.type === "usage") {
        const { name, color, type, } = getLogDetails(log);
        return (
          <Icon
            containerStyle={{
              alignItems: "flex-start",
              marginTop: 10,
            }}
            size={45}
            color={color}
            rounded
            name={name}
            type={type}
          />
        );
      }
    else {
      return (
        <Icon
          containerStyle={{
            alignItems: "flex-start",
            marginTop: 10,
          }}
          size={45}
          color="#44ABFF"
          rounded
          name="notifications-circle-outline"
          type="ionicon"
        />
      );
    }
  }
};


const LogEntry = (props) => {
  const { log } = props;
  const { content } = log;
  let msg = content || log.con
  if(msg.includes("Your Ring Doorbell changed from")) {
    msg = msg.includes("off to on") ? "Your Ring Doorbell is ringing" : "Your Ring Doorbell stopped ringing";
  } else if(msg.includes("Ring Doorbell changed from")) {
    msg = msg.includes("off to on") ? msg.replace("changed from", "is ringing") : msg.replace("changed from", "stopped ringing");
  }

  return (
    <View style={LogStyle.Lcard}>
      {formatImage(log)}

      <Text style={LogStyle.textLog}>{msg}</Text>

      <View style={{ height: 20, alignSelf: 'flex-end', backgroundColor: '#DBDBDB', borderRadius: 15, margin: 5, }}>
        <Text
          style={{
            width: 158,
            marginTop: -7,
            marginRight: 5,
            padding: 10,
            fontSize: 12,
            textAlign: "right",
            alignItems: "flex-end",
          }}
        >
          {log.date} - {log.time}
        </Text>
      </View>
    </View>
  );
};

export default LogEntry;