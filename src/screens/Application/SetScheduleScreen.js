import React, { useState, useEffect } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import UserAvatar from "react-native-user-avatar";
import { Icon } from "react-native-elements";
import { updateProperties } from "../../services/deviceServices";
import SwitchSelector from "react-native-switch-selector";
import {
  Switch,
  Image,
  ScrollView,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Dimensions
} from "react-native";
import { useSelector } from "react-redux";

var { width, height } = Dimensions.get("window"); //full width and height of screen


const SetScheduleScreen = (props) => {
  const [name, setName] = useState("User");
  const [endDate, setEndDate] = useState(null);
  const [accessDigit, setAccessDigit] = useState();
  const [accessType, setAccessType] = useState("Schedule");
  const [currentAccessLevel, setCurrentAccessLevel] = useState(
    "Please configure a schedule for your guest. Click the button above to chance access"
  );
  const [isLoading, setLoading] = useState(false);
  const [allDay, setAllDay] = useState(false);
  const [weekly, setWeekly] = useState(false);
  const [error, setError] = useState("");
  // Start Time
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [startTime, setStartTime] = useState(null);
  // End Time
  const [endTime, setEndTime] = useState(null);
  // Start Date
  const [startDate, setStartDate] = useState(null);
  // Week Days
  const [sunday, setSunday] = useState(false);
  const [monday, setMonday] = useState(false);
  const [tuesday, setTuesday] = useState(false);
  const [wednesday, setWednesday] = useState(false);
  const [thursday, setThursday] = useState(false);
  const [friday, setFriday] = useState(false);
  const [saturday, setSaturday] = useState(false);
  const [headerWidth, setHeaderWidth] = useState();
  const [exceeded, setExceeded] = useState(false);

  var nameXPosition; 

  const { sessionData } = useSelector((state) => state);
  const deviceName = props.route.params.deviceName;
  function handleSave() {
    setLoading(true);
    const weekDays = buildWeekdayArray();
    if (weekly && JSON.stringify(weekDays) == JSON.stringify([0, 0, 0, 0, 0, 0, 0])) {
      setError("Please select at least one day of the week.");
      setLoading(false);
    } else if (!allDay && accessDigit == 2 && (startTime == null || endTime == null)) {
      setError("Please select a start time and end time.");
      setLoading(false);
    } else if (accessDigit == 2 && (startDate == null || endDate == null)) {
      setError("Please select a start date and end date.");
      setLoading(false);
    } else if (accessDigit == 2 && startDate > endDate) {
      setError("Cannot set end date before start date.");
      setLoading(false);
    } else if (accessDigit == 2 && (startDate == endDate && startTime >= endTime)) {
      setError("Cannot set end time before start time.");
      setLoading(false);
    } else {
      setError("");
      _updateProperties(weekDays).then(() => {
        setTimeout(() => props.navigation.pop(), 3000);
      });
    }
  }

  function buildWeekdayArray() {
    const retArr = [0, 0, 0, 0, 0, 0, 0];
    if (weekly) {
      if (sunday) retArr[0] = 1;
      if (monday) retArr[1] = 1;
      if (tuesday) retArr[2] = 1;
      if (wednesday) retArr[3] = 1;
      if (thursday) retArr[4] = 1;
      if (friday) retArr[5] = 1;
      if (saturday) retArr[6] = 1;
    }

    return retArr;
  }
  // console.log("SET SCHEDULE", props)

  const options = [
    {
      label: "Never",
      value: "3",
      testID: "switch-one-thirty",
      accessibilityLabel: "switch-one-thirty",
    },
    {
      label: "Always",
      value: "1",
      testID: "switch-one",
      accessibilityLabel: "switch-one",
    },
    {
      label: "Schedule",
      value: "2",
      testID: "switch-one-thirty",
      accessibilityLabel: "switch-one-thirty",
    },
  ];

  const handleAccessType = (value) => {
    if (value == 1) {
      setAccessType("Always");
      setAccessDigit(1);
      setCurrentAccessLevel(
        "Guest will have unrestricted access to this device. Click on Always to change access."
      );
      return;
    }
    if (value == 2) {
      setAccessType("Schedule");
      setAccessDigit(2);
      setCurrentAccessLevel(
        "Please configure a schedule for your guest. Click on Schedule to change access."
        );
        return;
      }
      if (value == 3) {
        setAccessType("Never");
        setAccessDigit(0);
        setCurrentAccessLevel(
          "Guest will not have access to this device. Click on Never to change access."
          );
          setStartDate(null);
          setEndDate(null);
          setStartTime(null);
          setEndTime(null);
          setAllDay(false);
          setWeekly(false);
          return;
        }
  }

  async function _updateProperties(weekDays) {
    const properties = {
      account: props.route.params.guest.login_credentials_id,
      device: props.route.params.deviceProperties.shared_device_properties_id,
      shared_property_id: props.route.params.deviceProperties.shared_property_id,
      geofencing: props.route.params.deviceProperties.geofencing,
      access_type: accessDigit,
      all_day: allDay ? 1 : 0,
      days_reoccuring: weekDays,
      time_start: startTime,
      time_end: endTime,
      date_start: startDate,
      date_end: endDate,
      reoccuring_type: weekly ? 1 : 0,
    }

    updateProperties(properties, sessionData.idToken)
      .then((data) => { console.log(data) });
  }

  useEffect(() => {
    setExceeded(false)

    if (props.route.params.deviceProperties == null) {
      return;
    }
    var deviceProperties = props.route.params.deviceProperties;

    if (props.route.params.guest.name != null) {
      setName(props.route.params.guest.name);
    }

    if (deviceProperties.date_start != null) {
      if (deviceProperties.date_start != "") {
        setStartDate(deviceProperties.date_start);
      }
    }
    if (deviceProperties.date_end != null) {
      if (deviceProperties.date_end != "") {
        setEndDate(deviceProperties.date_end);
      }
    }
    if (deviceProperties.time_start != null) {
      if (deviceProperties.time_start != "") {
        setStartTime(deviceProperties.time_start);
      }
    }
    if (deviceProperties.time_end != null) {
      if (deviceProperties.time_end != "") {
        setEndTime(deviceProperties.time_end);
      }
    }
    if (deviceProperties.time_all_day != null) {
      if (deviceProperties.time_all_day != "") {
        if (deviceProperties.time_all_day == 1) {
          setAllDay(true);
        }
      }
    }

    if (deviceProperties.access_type != null) {
      if (deviceProperties.access_type == 0) {
        setAccessType("Never");
        setAccessDigit(0);
      } else if (deviceProperties.access_type == 1) {
        setAccessType("Always");
        setAccessDigit(1);
      } else if (deviceProperties.access_type == 2) {
        setAccessType("Schedule");
        setAccessDigit(2);
        if (deviceProperties.reoccuring_type == 1) {
          setWeekly(true);
        }
        if (deviceProperties.days_reoccuring != null) {
          if (deviceProperties.days_reoccuring[0] == 1) {
            setSunday(true);
          }
          if (deviceProperties.days_reoccuring[1] == 1) {
            setMonday(true);
          }
          if (deviceProperties.days_reoccuring[2] == 1) {
            setTuesday(true);
          }
          if (deviceProperties.days_reoccuring[3] == 1) {
            setWednesday(true);
          }
          if (deviceProperties.days_reoccuring[4] == 1) {
            setThursday(true);
          }
          if (deviceProperties.days_reoccuring[5] == 1) {
            setFriday(true);
          }
          if (deviceProperties.days_reoccuring[6] == 1) {
            setSaturday(true);
          }
        }
      }
    }
  }, [props]);

  const NameBadge = ({guest, name }) => {
    return (
      <View 
        onLayout={(event) => {
          const layout = event.nativeEvent.layout;
          {(layout.x + layout.width > (headerWidth-10)) && setExceeded(true)}
          // console.log('View X and width', layout.x, '        ', layout.width, '  ', headerWidth,  name);
        }}
        style={[styles.nameChip, {}]}
        >
          <Text 
            onLayout={(event) => {
              const layout = event.nativeEvent.layout;
            }}
            numberOfLines={1}
            style={[true ? {paddingHorizontal: 15,} : { paddingLeft: 15, paddingRight: 10, alignSelf: "center", fontSize: 16,}]}
          >
            {name}
          </Text>
      </View>
    );
  };

  const PropertyBadge = ({ property }) => {
    return (
      <TouchableOpacity 
        style={styles.propertyChip}
        onPress={() => handleAccessType()}>
          <Text style={styles.propertyText}> {accessType}</Text>
          <Icon
            type="font-awesome-5"
            name="caret-right"
            color="white"
            style={{ marginLeft: 5 }}
            size={23}
          />
      </TouchableOpacity>
    );
  };

  const WeekDays = () => {
    return (
      <View style={styles.weekContainer}>
        <TouchableOpacity
          style={[
            styles.day,
            { backgroundColor: sunday ? "#008CFF" : "#FFFFFF" },
          ]}
          onPress={() => setSunday(!sunday)}
        >
          <Text
            style={[styles.weekDay, { color: sunday ? "#FFFFFF" : "#008CFF" }]}
          >
            S
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.day,
            { backgroundColor: monday ? "#008CFF" : "#FFFFFF" },
          ]}
          onPress={() => setMonday(!monday)}
        >
          <Text
            style={[styles.weekDay, { color: monday ? "#FFFFFF" : "#008CFF" }]}
          >
            M
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.day,
            { backgroundColor: tuesday ? "#008CFF" : "#FFFFFF" },
          ]}
          onPress={() => setTuesday(!tuesday)}
        >
          <Text
            style={[styles.weekDay, { color: tuesday ? "#FFFFFF" : "#008CFF" }]}
          >
            T
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.day,
            { backgroundColor: wednesday ? "#008CFF" : "#FFFFFF" },
          ]}
          onPress={() => setWednesday(!wednesday)}
        >
          <Text
            style={[
              styles.weekDay,
              { color: wednesday ? "#FFFFFF" : "#008CFF" },
            ]}
          >
            W
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.day,
            { backgroundColor: thursday ? "#008CFF" : "#FFFFFF" },
          ]}
          onPress={() => setThursday(!thursday)}
        >
          <Text
            style={[
              styles.weekDay,
              { color: thursday ? "#FFFFFF" : "#008CFF" },
            ]}
          >
            T
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.day,
            { backgroundColor: friday ? "#008CFF" : "#FFFFFF" },
          ]}
          onPress={() => setFriday(!friday)}
        >
          <Text
            style={[styles.weekDay, { color: friday ? "#FFFFFF" : "#008CFF" }]}
          >
            F
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.day,
            { backgroundColor: saturday ? "#008CFF" : "#FFFFFF" },
          ]}
          onPress={() => setSaturday(!saturday)}
        >
          <Text
            style={[
              styles.weekDay,
              { color: saturday ? "#FFFFFF" : "#008CFF" },
            ]}
          >
            S
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Recurring swtich component
  const Recurring = (props) => {
    return (
      <View style={styles.time}>
        <Text style={styles.timeText}>Weekly</Text>
        <Switch
          thumbColor={weekly ? "#7DEA7B" : "white"}
          trackColor={{ false: "#767577", true: "#caedca" }}
          value={weekly}
          onValueChange={(val) => {
            setWeekly(val);
          }}
          style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] }}
          disabled={accessType != "Schedule"}
        />
      </View>
    );
  };

  // AllDay swtich component
  const AllDay = (props) => {
    return (
      <View style={styles.time}>
        <Text style={styles.timeText}>All Day</Text>
        <Switch
          thumbColor={allDay ? "#7DEA7B" : "white"}
          trackColor={{ false: "#767577", true: "#caedca" }}
          value={allDay}
          onValueChange={(val) => {
            if (val == true) {
              setStartTime(null);
              setEndTime(null);
            }
            setAllDay(val);
          }}
          style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] }}
          disabled={accessType != "Schedule"}
        />
      </View>
    );
  };

  // Start Time component
  // Button calls time picker

  const StartTime = () => {
    const showTimePicker = () => {
      setTimePickerVisibility(true);
    };

    const hideTimePicker = () => {
      setTimePickerVisibility(false);
    };

    const handleConfirm = (startTime) => {
      console.warn("A start time has been picked: ", startTime);
      setStartTime(
        startTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      );
      hideTimePicker();
    };

    return (
      <View style={styles.time}>
        <Text style={styles.timeText}>Start Time</Text>
        <TouchableOpacity
          onPress={showTimePicker}
          title="Start Time"
          style={
            allDay || accessType != "Schedule"
              ? styles.timeBtnGray
              : styles.timeBtn
          }
          disabled={allDay || accessType != "Schedule"}
        >
          <Text style={styles.timeBtnText}>
            {startTime == null ? "Set Time" : startTime}
          </Text>
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={isTimePickerVisible}
          mode="time"
          onConfirm={handleConfirm}
          onCancel={hideTimePicker}
        />
      </View>
    );
  };

  // End Time component
  // Button calls end time picker

  const EndTime = () => {
    const [isTimePickerVisible, setTimePickerVisibility] = useState(false);

    const showTimePicker = () => {
      setTimePickerVisibility(true);
    };

    const hideTimePicker = () => {
      setTimePickerVisibility(false);
    };

    const handleConfirm = (endTime) => {
      console.warn("A end time has been picked: ", endTime);
      setEndTime(
        endTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      );

      hideTimePicker();
    };

    return (
      <View style={styles.time}>
        <Text style={styles.timeText}>End Time</Text>

        <TouchableOpacity
          onPress={showTimePicker}
          title="Start Time"
          style={
            allDay || accessType != "Schedule"
              ? styles.timeBtnGray
              : styles.timeBtn
          }
          disabled={allDay || accessType != "Schedule"}
        >
          <Text style={styles.timeBtnText}>
            {endTime == null ? "Set Time" : endTime}
          </Text>
        </TouchableOpacity>

        <DateTimePickerModal
          isVisible={isTimePickerVisible}
          mode="time"
          onConfirm={handleConfirm}
          onCancel={hideTimePicker}
        />
      </View>
    );
  };

  // set  Start Date component

  const StartDate = () => {
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const showDatePicker = () => {
      setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
      setDatePickerVisibility(false);
    };

    const handleConfirm = (startDate) => {
      console.warn("A time has been picked: ", startDate);
      setStartDate(startDate.toLocaleDateString());
      hideDatePicker();
    };
    return (
      <View style={styles.time}>
        <Text style={styles.timeText}>Start Date</Text>
        <TouchableOpacity
          style={accessType != "Schedule" ? styles.dateBtnGray : styles.dateBtn}
          onPress={showDatePicker}
          disabled={accessType != "Schedule"}
        >
          <Text style={styles.dateBtnText}>
            {startDate == null ? "Set Start" : startDate}
          </Text>
          <View style={styles.dateIcon}>
            <Icon name="calendar" type="feather" size={31} color="white" />
          </View>
        </TouchableOpacity>

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
      </View>
    );
  };

  const EndDate = () => {
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const showDatePicker = () => {
      setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
      setDatePickerVisibility(false);
    };

    const handleConfirm = (endDate) => {
      console.warn("A time has been picked: ", endDate);
      setEndDate(endDate.toLocaleDateString());
      hideDatePicker();
    };
    return (
      <View style={styles.time}>
        <Text style={styles.timeText}>End Date</Text>

        <TouchableOpacity
          style={accessType != "Schedule" ? styles.dateBtnGray : styles.dateBtn}
          onPress={showDatePicker}
          disabled={accessType != "Schedule"}
        >
          <Text style={styles.dateBtnText}>
            {endDate == null ? "Set End" : endDate}
          </Text>
          <View style={styles.dateIcon}>
            <Icon name="calendar" type="feather" size={31} color="white" />
          </View>
        </TouchableOpacity>

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
      </View>
    );
  };

  return (
    <View style={styles.screen}>
      <View 
        onLayout={(event) => {
          const layout = event.nativeEvent.layout;
          setHeaderWidth(layout.width)
          console.log('View X long', layout.width, width);
        }}
        style={styles.info}
      >
        <Text style={{fontSize: 11,}}>Editing   </Text>
        <NameBadge guest={false} name={deviceName}/>
        <Text style={{fontSize: 11,}}>  for  </Text>
        {!exceeded && <NameBadge guest={true} name={name} />}
      </View>

      {exceeded && <NameBadge guest={true} name={name} />}
      <View style={[styles.lineContainer, { marginVertical: 10 }]} />

      {/* <View style={{backgroundColor: 'transparent',}}> */}
      {/* </View> */}

      {/* <PropertyBadge /> */}

      <SwitchSelector
        borderRadius={10}
        options={options}
        initial={props.route.params.deviceProperties.access_type}
        textColor={"black"}
        buttonColor={"#fff"}
        backgroundColor={"lightgray"}
        borderColor={"#44ABFF"}
        height={25}
        buttonMargin={3}
        textStyle={{ fontWeight: "500" }}
        selectedTextStyle={{ color: "black", fontWeight: "500" }}
        animationDuration={300}
        onPress={(value) => handleAccessType(value)}
      />

      

      {accessDigit == 0 &&      
        <View style={[styles.setTime, {justifyContent: 'flex-start', marginTop: 10}]}>
          <View style={{backgroundColor: '#e5000f', borderRadius: 10, justifyContent: 'center', height: '85%'}}>
            <Text style={{fontSize: 20, fontWeight: '500', color: 'white', textAlign: 'center'}}>
                Your guest will 
            </Text>
            <View style={{margin: 10, alignSelf: 'center', padding: 5, justifyContent: 'center', backgroundColor: 'white', width: '20%', borderRadius: 10}}>
              <Text style={{color: 'black', fontSize: 20, fontWeight: 'bold', textAlign: 'center'}}>never</Text>
            </View>
            <Text style={{color: 'white', fontSize: 20, textAlign: 'center'}}> have access to this device</Text>
          </View>
        </View>
      }

      {accessDigit == 1 &&      
        <View style={[styles.setTime, {justifyContent: 'flex-start', marginTop: 10}]}>
          <View style={{backgroundColor: '#44ABFF', borderRadius: 10, justifyContent: 'center', height: '85%'}}>
            <Text style={{fontSize: 20, fontWeight: '500', color: 'white', textAlign: 'center'}}>
                Your guest will 
            </Text>
            <View style={{margin: 10, alignSelf: 'center', padding: 5, justifyContent: 'center', backgroundColor: 'white', width: '30%', borderRadius: 10}}>
              <Text style={{color: 'black', fontSize: 20, fontWeight: 'bold', textAlign: 'center'}}>always</Text>
            </View>
            <Text style={{color: 'white', fontSize: 20, textAlign: 'center'}}> have access to this device</Text>
          </View>
        </View>
      }

      {accessDigit == 2 &&      
        <View style={styles.setTime}>
          <Recurring />
          {weekly && <WeekDays />}
          <View style={[styles.lineContainer, { marginVertical: 2, marginLeft: 50 }]} />

          <AllDay val={allDay} zIndex={-1000} />
          <StartTime />
          <StartDate />
          <EndTime />
          <EndDate />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      }

      <View style={styles.saveContainer}>
        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() => props.navigation.pop()}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveBtn} onPress={() => handleSave()}>
          {isLoading
            ?
            <ActivityIndicator color={'white'} />
            :
            <Text style={styles.saveText}>Save</Text>
          }
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 12,
    // backgroundColor: "green",
    backgroundColor: "#E7E7E7",
    width: "100%",
  },

  info: {
    flex: 1,
    // padding: 4,
    marginBottom: 5,
    width: '100%',
    flexDirection: "row",
    justifyContent: "center",
    alignSelf: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    // backgroundColor: 'blue',
    // paddingBottom: 15,
  },
  setTime: {
    flex: 15,
    flexDirection: "column",
    justifyContent: 'center',
    width: "100%",
  },
  time: {
    flex: 1,
    // backgroundColor: 'green',
    flexDirection: "row",
    padding: 13,
    // paddingRight: 35,
    justifyContent: "space-between",
    alignItems: "center",

    width: "100%",
  },
  timeText: {
    fontSize: 17,
    fontWeight: "bold",
  },
  picker: {
    paddingLeft: 10,
    borderColor: "white",
    width: 170,
    height: 40,
    zIndex: 10000,
  },
  setRepeat: {
    backgroundColor: "transparent",
    flex: 0.15,
  },
  badges: {
    backgroundColor: "cyan",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  nameChip: {
    alignItems: "center",
    alignSelf: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: "#FFFFFF",
    borderRadius: 35,
    padding: 5,
  },
  nameBadge: {
    marginLeft: 3,
    height: 35,
    width: 35,
  },
  nameText: {
    fontSize: 20,
    fontWeight: "900",
    marginRight: 10,
  },
  propertyChip: {
    borderRadius: 200,
    backgroundColor: "#44ABFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "35%",
    height: '10%',
    overflow: "hidden",
    shadowColor: "#000",
  },

  propertyBadge: {
    marginRight: 2,
    height: 35,
    width: 35,
    tintColor: "white",
  },
  propertyText: {
    fontSize: 17,
    color: "white",
    fontWeight: "bold",
  },
  timeBtn: {
    backgroundColor: "white",
    width: 110,
    height: 45,
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: -10000,
  },
  timeBtnGray: {
    backgroundColor: "#d8d8d8",
    width: 110,
    height: 45,
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: -10000,
  },
  timeBtnText: {
    fontSize: 22,
    zIndex: -10000,
  },
  dateBtn: {
    backgroundColor: "white",
    width: 160,
    height: 45,
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  dateBtnGray: {
    backgroundColor: "#d8d8d8",
    width: 160,
    height: 45,
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  dateIcon: {
    backgroundColor: "#44ABFF",
    width: "25%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    borderBottomRightRadius: 8,
    borderTopRightRadius: 8,
  },
  dateBtnText: {
    width: "75%",
    height: "60%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    fontSize: 20,
  },
  saveBtn: {
    flex: 1,
    height: 50,
    margin: 5,
    backgroundColor: "#44ABFF",
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelBtn: {
    flex: 1,
    margin: 5, 
    height: 50,
    width: "45%",
    borderColor: "#44ABFF",
    backgroundColor: "#F1F1F1",
    borderWidth: 2,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelText: {
    fontSize: 20,
    color: "#44ABFF",
  },
  saveText: {
    fontSize: 20,
    color: "white",
  },
  weekContainer: {
    width: "95%",
    height: "9%",
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  day: {
    height: "100%",
    width: "11%",
    borderColor: "#008CFF",
    borderRadius: 8,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  weekDay: {
    fontSize: 28,
    fontWeight: "bold",
  },
  saveContainer: {
    flex: 1,
    // backgroundColor: 'blue',
    width: '100%',
    flexDirection: "row",
    alignSelf: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  errorText: {
    alignSelf: "center",
    color: "red",
    paddingTop: 10,
    paddingBottom: 10,
  },
  accessText: {
    flex: 1,
    padding: 10,
    backgroundColor: 'blue',
    textAlign: "center",
    color: "black",
    // marginHorizontal: 30,
  },
  lineContainer: {
    backgroundColor: "#c3c3c3",
    height: 2,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "stretch",
  },
});

export default SetScheduleScreen;