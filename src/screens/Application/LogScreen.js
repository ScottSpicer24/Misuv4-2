import React, { useState, useEffect } from "react";;
import appStyle from "../../styles/AppStyle";
import LogCard from "../../components/cards/LogCard";
import { useIsFocused } from "@react-navigation/native";
import { useSelector } from "react-redux";
import {
  View,
  ScrollView,
  ActivityIndicator,
  Text,
  Image
} from "react-native";

function LogScreen({route}) {
  const { hubInfoData } = useSelector(state => state)
  const { logs } = useSelector(state => state.logsData)
  const [isLoading, setLoading] = useState(true);
  const isFocused = useIsFocused();
  const error = "There was an error getting your logs. Please try again later.";

  useEffect(() => {
    setLoading(true)
    setTimeout(() => setLoading(false), 3000);
  }, [route]);

  return (
    <View
      style={[
        appStyle.container,
        { alignItems: "stretch", marginHorizontal: -5 },
      ]}
    >
      {isLoading && (!logs && !logs.length || logs.length == 0) ? (
        <ActivityIndicator
          style={appStyle.spinner}
          size="large"
          color="#5BD3FF"
        />
      ) : (
        <ScrollView style={appStyle.scrollView}>
          <LogCard type={hubInfoData.user_type} logs={logs} err={error} params={route.params}/>
          {(!logs || !logs.length || logs.length == 0) &&
              <View style={{flex: 1, justifyContent: 'center', borderRadius: 50, alignContent:'center', backgroundColor: '#44ABFF'}}>
                <Image 
                  style={{ alignSelf: 'center', margin: 20, height: 220, resizeMode: 'contain'}}
                  source={require('../../assets/noData.png')}></Image>
                <Text style={{color: 'white', fontWeight: '400', margin: 20, fontSize: 30, alignSelf: 'center'}}>No Logs Found</Text>
              </View>}
        </ScrollView>
      )
      }
    </View >
  );
}

export default LogScreen;
