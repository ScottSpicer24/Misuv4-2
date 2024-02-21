// Returns the name, type, and color for an icon based on device action or type
export const getIcon = (type = null, action = null) => {
  let iconName, iconType, iconColor;

  if (action) {
    if (action == "lock") {
      iconName = "lock";
      iconType = "simple-line-icon";
      iconColor = "#57E455";
    } 
    else if (action == "unlock") {
      iconName = "lock-open";
      iconType = "simple-line-icon";
      iconColor = "#FF5722";
    } 
    else {
      iconName = "home-assistant";
      iconType = "material-community";
    }
  }

  else if (type) {
    if (type.includes("doorbell")) {
      iconName = "doorbell-video";
      iconType = "material-community";
    }
    else if (type.includes("lock")) {
      iconName = "lock";
      iconType = "simple-line-icon";
    }
    else if (type.includes("light")) {
      iconName = "lightbulb-outline";
      iconType = "material-community";
    }
    else if (type.includes("alarm")) {
      iconName = "alarm-light-outline";
      iconType = "material-community";
    }  
    else {
      iconName = "home-assistant";
      iconType = "material-community";
    }
  }

  return { iconName, iconType, iconColor };
};
