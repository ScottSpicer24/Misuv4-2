import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View, Text, Dimensions } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

var width = Dimensions.get("window").width; //full width
var height = Dimensions.get("window").height; //full height

// if issues arise in this card, change DeviceProps to pass in entire Properties array instead of [0]
// Sengled Light:
// deviceProps[0] => slider props
// deviceProps[1] => bool props
const SetScheduleCard = (props) => {
  const [startDate, setStartDate] = useState("None");
  const [endDate, setEndDate] = useState("None");
  const [reoccuring, setReoccuring] = useState("Not Reoccuring");
  const [reoccuringDays, setReoccuringDays] = useState("");
  const [timeStart, setTimeStart] = useState("None");
  const [timeEnd, setTimeEnd] = useState("None");
  const [accessType, setAccessType] = useState(0);

  const [gpsLocation, setGpsStatus] = useState(false);

  useEffect(() => {
    if (props.deviceProperties == null) {
      return;
    }

    if (props.deviceProperties.date_start != null) {
      if (props.deviceProperties.date_start != "") {
        setStartDate(props.deviceProperties.date_start);
      }
    }
    if (props.deviceProperties.date_end != null) {
      if (props.deviceProperties.date_end != "") {
        setEndDate(props.deviceProperties.date_end);
      }
    }

    if (props.deviceProperties.access_type != null) {
      setAccessType(props.deviceProperties.access_type);
    }

    if (props.deviceProperties.reoccuring_type != null) {
      if (props.deviceProperties.reoccuring_type == 0) {
        setReoccuring("Not Reoccuring");
      }
      if (props.deviceProperties.reoccuring_type == 1) {
        setReoccuring("Weekly");
      }
      if (props.deviceProperties.reoccuring_type == 2) {
        setReoccuring("Bi-Weekly");
      }
    }

    if (props.deviceProperties.days_reoccuring != null) {
      let daysOfWeek = "";
      if (props.deviceProperties.days_reoccuring[0]) daysOfWeek += "Sun, ";
      if (props.deviceProperties.days_reoccuring[1]) daysOfWeek += "Mon, ";
      if (props.deviceProperties.days_reoccuring[2]) daysOfWeek += "Tues, ";
      if (props.deviceProperties.days_reoccuring[3]) daysOfWeek += "Wed, ";
      if (props.deviceProperties.days_reoccuring[4]) daysOfWeek += "Thurs, ";
      if (props.deviceProperties.days_reoccuring[5]) daysOfWeek += "Fri, ";
      if (props.deviceProperties.days_reoccuring[6]) daysOfWeek += "Sat, ";
      daysOfWeek = daysOfWeek.slice(0, -2);
      setReoccuringDays(daysOfWeek);
    }

    if (props.deviceProperties.time_start != null) {
      if (props.deviceProperties.time_start != "") {
        setTimeStart(props.deviceProperties.time_start);
      }
    }
    if (props.deviceProperties.time_end != null) {
      if (props.deviceProperties.time_end != "") {
        setTimeEnd(props.deviceProperties.time_end);
      }
    }
  }, [props]);

  return (
      <View style={styles.contentContainer}>

        <View style={{flex: 1, justifyContent: 'flex-end',}}>
          <Text style={{fontWeight: 'bold', fontSize: 20}}>Schedule</Text>
        </View>

        <View style={styles.contentRow}>
          <Icon name="schedule" color={'#44ABFF'} size={25} style={styles.icons} />
          <View style={styles.scheduleDataCont}>
            {reoccuringDays != "" && (
              <Text style={styles.scheduleText}>{reoccuringDays}</Text>
            )}
            {timeStart != "None" && timeEnd != "None" ? (
              <Text style={styles.font}>
                {timeStart.slice(0, -3)} - {timeEnd.slice(0, -3)}
              </Text>
            ) : accessType == 0 ? (
              <Text style={styles.scheduleText}>Never</Text>
            ) : (
              <Text style={styles.scheduleText}>All Day</Text>
            )}
          </View>
        </View>

        <View style={styles.contentRow}>
            <Icon name="replay" color={'#44ABFF'} size={25} style={styles.icons} />
            <View style={styles.scheduleDataCont}>
              <Text style={styles.scheduleText}>{reoccuring}</Text>
            </View>
        </View>

        <View style={styles.contentRow}>
          <Icon name="date-range" color={'#44ABFF'} size={25} style={styles.icons} />
          <View style={styles.scheduleDataCont}>
            {accessType == 0 ? (
              <Text style={styles.scheduleText}>Never</Text>
            ) : accessType == 1 ? (
              <Text style={styles.scheduleText}>Always</Text>
            ) : (
              <Text style={styles.scheduleText}>
                {startDate} - {endDate}
              </Text>
            )}
          </View>
        </View>
      </View>
  );
};

export default SetScheduleCard;

const styles = StyleSheet.create({
  editButton: {
    backgroundColor: "#44ABFF",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: width/5,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
  },
  contentContainer: {
    flex: 2,
    margin: 5,
    marginRight: 0,
    height: '90%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    paddingBottom: 5,
  },
  contentRow: {
    // backgroundColor:'green',
    flex: 1,
    width: '100%',
    alignItems: "center",
    flexDirection: "row",
  },
  icons: {
    marginLeft: 10,
  },
  scheduleText: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '600'
  },
  scheduleDataCont: {
    // height: 60,
    // backgroundColor: 'green',
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
    borderRadius: 15,
  },
});