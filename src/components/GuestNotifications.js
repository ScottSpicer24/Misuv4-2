import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import Modal from "react-native-modal";
import NotificationsList from "./cards/ListEntries/NotificationsList";
import { Badge } from "react-native-elements";
import { connect } from "react-redux";
import { getInvitations } from "../services/sharedUserServices";

const Notifications = (props) => {
  const [toggled, setToggled] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    async function updateInvitations() {
      setData(await getInvitations(props.sessionData.idToken));
    }

    updateInvitations();
  }, [props, toggled]);

  function toggleBell() {
    setToggled(!toggled);
    props.navigate("Hubs", { refresh: true });
  }

  let notificationsModal = (
    <Modal
      isVisible={toggled}
      onBackdropPress={toggleBell}
      backdropColor={"#00000090"}
      hasBackdrop={true}
      backdropOpacity={10}
      onSwipeComplete={() => setToggled(false)}
      swipeDirection="down"
    >
      <NotificationsList
        data={data}
        bearer={props.sessionData.idToken}
        toggle={toggleBell}
      />
    </Modal>
  );
  return (
    <View>
      <TouchableOpacity onPress={toggleBell} style={styles.bell}>
        {props.guest ? (
          <View>
            <Icon name="bell" size={38} color="#1a1a1a" />
            {data.length > 0 &&
            <Badge
              status="error"
              containerStyle={styles.badgeStyle}
              value={data.length}
            />
          }
          </View>
        ) : null}
      </TouchableOpacity>
      {notificationsModal}
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    flex: 1,
    backgroundColor: "transparent",
    flexGrow: 1,
  },
  badgeStyle: {
    position: "absolute",
    top: -4,
    right: -4,
  },
  headerText: {
    textAlign: 'center',
    fontSize: 25,
    fontWeight: "normal",
    color: "#242424",
  },
  tinyLogo: {
    width: 70,
    height: 70,
  },
  image: {
    backgroundColor: "transparent",
    position: "absolute",
  },
  bell: {
    marginRight: 10,
  },
});

const mapStateToProps = (state) => {
  const { sessionData } = state;
  return { sessionData };
};

export default connect(mapStateToProps)(Notifications);