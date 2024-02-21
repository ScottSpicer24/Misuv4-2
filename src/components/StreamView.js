import React, { useEffect, useState } from "react";
import { StyleSheet, View, ActivityIndicator, Text, Dimensions, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import { Video } from 'expo-av';
import { toggleRingStream } from "../services/deviceServices";
import { showToast } from "../utils/toast";
import * as ScreenOrientation from 'expo-screen-orientation';
import CryptoJS from "crypto-js";
import config from "C:/Users/Jack/Desktop/misu4/aws-exports";
import publicIP from 'react-native-public-ip';

let { width, height } = Dimensions.get("screen") // Device screen height and width

function StreamView(props) {
  const video = React.useRef(null);
  const [shouldPlay, setShouldPlay] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  let intervalId = null;

  // Decrypt encrypted ip string
  let encryptedPublicIP = props.streamInfo.publicIP;

  let encryptedPublicSource = props.streamInfo.publicSource;
  let encryptedLocalSource = props.streamInfo.localSource;

  let key = config.livestream.secret_key;
  key = CryptoJS.enc.Utf8.parse(key);

  let decryptedPublicSource = CryptoJS.AES.decrypt(encryptedPublicSource, key, { mode: CryptoJS.mode.ECB }).toString(CryptoJS.enc.Utf8);
  let decryptedLocalSource = CryptoJS.AES.decrypt(encryptedLocalSource, key, { mode: CryptoJS.mode.ECB }).toString(CryptoJS.enc.Utf8);
  let decryptedPublicIP = CryptoJS.AES.decrypt(encryptedPublicIP, key, { mode: CryptoJS.mode.ECB }).toString(CryptoJS.enc.Utf8);
  let source;

  useEffect(() => {
    toggleStreamInstance("on");

    publicIP().then(deviceIP => {
      source = decryptedPublicIP === deviceIP ? decryptedLocalSource : decryptedPublicSource;
      console.log("STREAM SOURCE: " + source);
    }).catch(error => {
      // 'Unable to get IP address.'
      console.log(error);
      source = decryptedPublicIP === deviceIP ? decryptedLocalSource : decryptedPublicSource;
      console.log("STREAM SOURCE: " + source);
    });

  }, []);

  const setOrientation = () => {
    ScreenOrientation.unlockAsync();
  };

  const handleLoadStart = () => {
    console.log('Loading...')
  };
  const handleLoaded = params => {
    setIsLoaded(true);
    console.log('Video loaded:', params);
  }
  const handleError = error => console.error(error);

  const loadStream = () => {
    video?.current.loadAsync({ uri: source }, {}, false)
      .then((msg) => {
        clearInterval(intervalId);
        intervalId = null;
        video?.current.playAsync();
        console.log(msg);
      }).catch((err) => {
        console.log(err);
      });
  }

  const toggleStreamInstance = async (value) => {

    if (value == "on" && !isLoaded) {
      ScreenOrientation.unlockAsync();
      intervalId = setInterval(loadStream, 5000);
    }
    else if (value == "off") {
      clearInterval(intervalId);
      intervalId = null;
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
      setShouldPlay(false);
      props.toggleView(false);
      toggleRingStream(props.idToken, props.device, "off")
        .then((msg) => {
        }).catch((err) => showToast(err));
    }
  };

  return (
    <View>
      <Modal
        isVisible={true}
        backdropColor={"black"}
        hasBackdrop={true}
        backdropOpacity={10}
        onSwipeComplete={() => toggleStreamInstance("off")}
        swipeDirection="down"
      >
        <Video
          usePoster={true}
          ref={video}
          style={styles.video}
          resizeMode="contain"
          shouldPlay={shouldPlay}
          onLoad={handleLoaded}
          onError={handleError}
          onLoadStart={handleLoadStart}
          volume={1.0}
          useNativeControls={true}
          onFullscreenUpdate={setOrientation}
        />

        {!isLoaded &&
          <View style={{ height: height * .8, justifyContent: 'center', alignContent: 'center', }}>
            <ActivityIndicator
              color={'#7DEA7B'}
              size={'large'}
            />
          </View>
        }

        <TouchableOpacity
          style={{ justifyContent: 'center', alignItems: 'center', height: 80, width: '100%', borderRadius: 15, backgroundColor: '#44ABFF' }}
          onPress={() => toggleStreamInstance("off")}
        >
          <Text style={{ color: 'white', fontSize: 22 }}>Exit Stream</Text>
        </TouchableOpacity>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: "30%",
    width: "100%",
    backgroundColor: "black"
  },
  video: {
    flex: 1,
    alignSelf: 'stretch',
  },
});

export default StreamView;