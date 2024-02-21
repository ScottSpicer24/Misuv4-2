import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Image } from 'react-native';
import { useIsFocused } from "@react-navigation/native";
import SearchBar from "../../components/SearchBar";
import appStyle from "../../styles/AppStyle";
import DeviceInfoCard from "../../components/cards/DeviceInfoCard";
import { getSharedDevicesListAction } from "../../redux/Actions/getSharedDevicesListAction";
import {
  TouchableWithoutFeedback,
  StyleSheet,
  Keyboard,
  View,
  ActivityIndicator,
  Dimensions,
  RefreshControl,
  Text,
  ScrollView,
} from "react-native";

var { width, height } = Dimensions.get("window") //full width

function YourHubsScreen(props) {
  const isFocused = useIsFocused();
  const [searchParam, setSearchParam] = useState("");
  const { sharedDevicesData, sessionData } = useSelector(state => state);
  const { sharedDevices } = sharedDevicesData;
  const [refreshing, setRefreshing] = useState(true);
  const dispatch = useDispatch();
  let collapsibleList;

  useEffect(() => {
    setTimeout(() => setRefreshing(false), 1000)
    dispatch(getSharedDevicesListAction(sessionData.idToken));
  }, [isFocused]);

  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    dispatch(getSharedDevicesListAction(sessionData.idToken))
    wait(2000).then(() => setRefreshing(false));
  }, []);

  collapsibleList =
    !sharedDevices ? (
      <View style={{ height: height / 2, alignItems: 'center', alignSelf: 'center', justifyContent: 'center', }}>
        <ActivityIndicator size={'large'}/>
      </View>
    ) : ((sharedDevices?.length == 0 || (sharedDevices?.filter((hub) => hub.accepted == 1).length == 0) && !refreshing)) ? (

      <View style={{ justifyContent: 'center', }}>
        <View style={{ flex: 1, padding: 15, backgroundColor: "white", borderRadius: 15, }}>
          <Text style={{ color: '#44ABFF' }}>Request access to a homeowner's smart home to gain accessibility to their devices!</Text>
        </View>

        <Image
          style={{ alignSelf: 'center', margin: 20, marginTop: 50, height: 220, resizeMode: 'contain' }}
          source={require('../../assets/void.png')}></Image>
        <Text style={{ textAlign: 'center', fontSize: 25 }}> No Hubs Added </Text>

      </View>
    ) : (
      sharedDevices?.filter(
        (hub) => hub.sharer_name.toLowerCase().includes(searchParam.toLowerCase()) && hub.accepted == 1)
        .map((entry, index) => (
          <DeviceInfoCard
            type={"HubCard"}
            entry={entry}
            cardIndex={index}
            key={entry.login_credentials_id}
            navigation={props.navigation}
          />
        ))
    );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[appStyle.container, { backgroundColor: "#E7E7E7" }]}>
        <View style={styles.header}>
          <SearchBar setSearchParam={setSearchParam} screen={""} />
        </View>

        <ScrollView
          refreshControl={
            <RefreshControl
              colors={['#FFFFFF']}
              tintColor={'#7DEA7B'}
              progressBackgroundColor={'#7DEA7B'}
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
          style={styles.cardContainer}
        >
          {collapsibleList}
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    width: "100%",
  },
  header: {
    flexDirection: "row",
    width: "100%",
    marginTop: 0,
    margin: 15,
    justifyContent: "flex-start",
    alignItems: "center",
  },
});

export default YourHubsScreen;
