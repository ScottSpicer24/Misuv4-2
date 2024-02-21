import { showToast } from "./toast"

export const checkAction = (action, deviceState, deviceType) => {
    // Lock actions
    if (deviceType == "Lock") {
      if(action == 'lock' && deviceState == "Locked"){
        showToast('Already Locked')
        return false
      }
      if(action == 'unlock' && deviceState == "Unlocked"){
        showToast('Already Unlocked')
        return false
      }
    }

    // Light actions
    if (deviceType == "Light") {
      if(action == 'turn_on' && deviceState == "on"){
        showToast('Light is already turned on')
        return false
      }
      if(action == 'turn_off' && deviceState == "off"){
        showToast('Light is already turned off')
        return false
      }
    }
    
    // Alarm actions
    if (deviceType == "Alarm") {
      if(action == 'alarm_disarm' && deviceState == "Disarmed"){
        showToast('Alarm is already disarmed')
        return false
      }
      if(action == 'alarm_arm_home' && deviceState == "Armed"){
        showToast('Alarm is already armed')
        return false
      }
    }
    
    if(deviceState == "Unavailable"){
      showToast('Device is unavailable')
      return false
    }

    return true
}