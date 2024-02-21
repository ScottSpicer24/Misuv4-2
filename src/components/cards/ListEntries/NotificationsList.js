import React, { useState, useEffect } from "react";
import Icon from "react-native-vector-icons/MaterialIcons";
import UserAvatar from "react-native-user-avatar";
import { handleInviteResponse } from "../../../services/sharedUserServices";
import { getSharedDevicesListAction } from "../../../redux/Actions/getSharedDevicesListAction";
import { useDispatch } from "react-redux";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from "react-native";

const NotificationsList = (props) => {
  const [userData, setUserData] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    setUserData(props.data);
  }, [props]);

  async function _handleInviteResponse(answer, id) {
    setLoading(true);
    setTimeout(() => setLoading(false), 3000);
    handleInviteResponse(answer, id, props.bearer)
      .then(() => {
        dispatch(getSharedDevicesListAction(props.bearer));
        props.toggle();
      })
      .catch((err) => console.log(err));
  }

  const Item = ({ sharer_name, id }) => (
    <View style={styles.item} key={id}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View style={styles.icon}>
            <UserAvatar size={45} borderRadius={30} name={sharer_name} />
          </View>

          <View>
            <Text style={styles.name}>{sharer_name}</Text>
          </View>

          <View style={styles.buttons}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => _handleInviteResponse(0, id, props.bearer)}
            >
              <Icon name="close" size={45} color="#F36464" id={id} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => _handleInviteResponse(1, id, props.bearer)}
            >
              <Icon name="check" size={45} color="#57E455" id={id} />
            </TouchableOpacity>
          </View>
        </View>
    </View>
  );

  const renderItems = userData.map((user, index) => {
    return (
      <Item
        sharer_name={user.sharer_name}
        id={user.login_credentials_id}
        key={user.login_credentials_id}
      />
    );
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pending Requests</Text>
      <ScrollView style={styles.scrollContainer}>
        {userData.length !== 0 ? (
          renderItems
        ) : (
          <View
            style={{
              flex: 1,
              height: "100%",
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "20%",
            }}
          >
            <Icon name="inbox" size={50} />
            <Text style={{ fontSize: 20 }}>No New Notifications</Text>
          </View>
        )}
      </ScrollView>

      {isLoading && (
        <View
          style={{
            width: "100%",
            height: "20%",
          }}
        >
          <ActivityIndicator style={{}} size={"large"} />
        </View>
        )
      } 
    </View>
  );
};

export default NotificationsList;

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    flex: 0.5,
    backgroundColor: "#F1F1F1",
    elevation: 12,
    borderRadius: 10,
    flexWrap: "wrap",
    paddingBottom: 15,
  },
  scrollContainer: {
    flex: 1,
    width: "100%",
    backgroundColor: "#F1F1F1",
    borderRadius: 10,
  },
  item: {
    backgroundColor: "white",
    marginTop: 5,
    flex: 0.3,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    margin: 10,
    borderRadius: 10,
    elevation: 5,
  },
  buttons: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  button: {
    backgroundColor: "#F6F6F6",
    borderRadius: 10,
    elevation: 4,
    marginRight: 13,
  },
  name: {
    fontSize: 23,
  },
  title: {
    fontSize: 30,
    textAlign: "center",
    margin: 15,
  },
  icon: {
    flexBasis: 65,
    alignItems: "center",
  },
});
