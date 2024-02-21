import Toast from 'react-native-root-toast';

// This creates little popups on the screen
export const showToast = (text) => {
	Toast.show(text, { duration: Toast.durations.LONG });
};
