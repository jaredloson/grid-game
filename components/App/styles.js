import { StyleSheet } from 'react-native';

export const rawStyles = {
  base: {
    display: 'flex',
    width: '100%',
    height: '100%',
    backgroundColor: '#999',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inner: {
    position: 'relative',
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#fff'
  },
  screen: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    padding: 20,
    backgroundColor: 'rgba(255,255,255,1)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  screenText: {
    fontSize: 40,
    color: '#333'
  },
  button: {
    width: 150,
    height: 40,
    backgroundColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20
  },
  buttonText: {
    color: 'white'
  }
};

export const styles = StyleSheet.create(rawStyles);