import { Dimensions, StyleSheet } from 'react-native';

var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height

const authStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  greeting: {
    fontSize: 23,
    textAlign: 'center',
    fontWeight: '100',
  },
  appName: {
    fontSize: 28,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  icon: {
    height: 215,
    width: 225,
    marginBottom: -45,
    marginTop: -55,
  },
  iconHolder: {
    marginTop: 14,
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  passwordError: {
    
    // paddingTop: 20,
  },
  errorMessage: {
    color: 'red',
    alignItems: 'center',
    marginHorizontal: 15,
    marginBottom: -5,
  },
  error: {
    color: '#E9446A',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  message: {
    color: 'red',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 15,
    marginTop: 5,
    marginBottom: -5,
  },
  stepTracker: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginTop: 10,
    marginHorizontal: 42,
  },
  stepTrackerIcon: {
    flexDirection: 'column',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
  },
  authForm: {
    marginBottom: 24,
    marginHorizontal: 15,
  },
  authFormInput: {
    borderRadius: 10,
    backgroundColor: '#F8F8F8',
    height: 48,
    fontSize: 16,
    paddingLeft: 15,
    marginTop: 21,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  authFormStateInput: {
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#F8F8F8',
    height: 48,
    paddingLeft: 15,
    marginRight: 21,
  },
  authFormButtonHolder: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  finalForm: {
    flex: 1,
    flexDirection: 'row',
    borderBottomColor: '#838383',
    borderBottomWidth: 2,
    paddingVertical: 15,
  },
  check: {
    flex: 1,
    flexDirection: 'row',
  },
  authFormButton: {
    marginHorizontal: 30,
    marginTop: 40,
    backgroundColor: '#008CFF',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    height: 45,
    width: 200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  },
});

export default authStyle;
