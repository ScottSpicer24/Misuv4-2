import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showToast } from "../utils/toast";
import { checkAction } from "../utils/checkAction";
import { getActionIcon } from "../utils/getActionIcon";
import {
  Animated,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator
} from "react-native";
import { MaterialCommunityIcons } from "react-native-vector-icons";

var { width, height } = Dimensions.get("screen"); // Device screen height and width

const ControlButton = (props) => {
  const deviceType =  props.deviceType;
  const deviceState = props.deviceState;
  const action = props.action;
  
  const { sharedDevicesData, websocket, sessionData } = useSelector(state => state);

  const [actionToggled, setActionToggled] = useState(false);
  const [icon, setIcon] = useState(action && getActionIcon(action))
  const [isLoading, setLoading] = useState(false);
  
  useEffect(() => {
    setLoading(false)
  }, [sessionData, websocket, sharedDevicesData]);
  
  if(deviceType == 'Lock' || deviceType == 'Light' )
    return (
      <TouchableOpacity
        disabled={false}
        style={[styles.actionButton, { width: '45%'}]}
        onPress={() => {
          checkAction( action, deviceState, deviceType) && props.handleAction(action)
          setLoading(true)
          setTimeout(() => setLoading(false), 10000)
        }}
      >
        {isLoading ? 
          <View>
            <ActivityIndicator
              color={'white'}
              size={'small'}
            />
          </View>
        :
        <View>
          <View style={{flex: 1.4, justifyContent: 'center', alignItems: 'center'}}>
            <MaterialCommunityIcons name={icon} size={28} color={'white'}/>
          </View>

          <Text style={[styles.actionText, {fontSize: 16}]}>{props.friendly_name || props.name}</Text>
        </View>
        }
      </TouchableOpacity>
    )
  else
    return(

      <TouchableOpacity
        style={[styles.actionButton]}
        onPress={() => {
            checkAction(action, deviceState, deviceType) && props.handleAction(action)
            setLoading(true)
            setTimeout(() => setLoading(false), 10000)
          }}
        >
        {isLoading ? 
          <View>
            <ActivityIndicator
              color={'white'}
              size={'small'}
            />
          </View>
        :
        <View>
          <View style={{flex: 1.4, justifyContent: 'center', alignItems: 'center'}}>
            <MaterialCommunityIcons name={icon} size={28} color={'white'}/>
          </View>

          <Text style={styles.actionText}>{props.friendly_name || props.name}</Text>
        </View>
        }
      </TouchableOpacity>
    )
};

const styles = StyleSheet.create({
  actionButton: {
    // borderWidth: 3,
    // borderColor: "#7DEA7B",
    margin: 5,
    height: 100,
    borderRadius: 10,
    width: "30%",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: "#75d785",
  },
  actionText: {
    flex: 1,
    paddingHorizontal: 2,
    textAlign: "center",
    fontWeight: "bold",
    color: "white",
    fontSize: 13,
  },
});

export { ControlButton };
