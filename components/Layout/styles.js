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
    backgroundColor: 'rgba(255,255,255,.9)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  screenComplete: {
    top: 'auto',
    backgroundColor: 'rgba(255,255,255,0)'
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
    marginTop: 10
  },
  buttonSolo: {
    marginTop: 0
  },
  buttonText: {
    color: 'white',
    fontSize: 20
  },
  slotStub: {
    position: 'absolute',
    zIndex: 0
  }
};

export const styles = StyleSheet.create(rawStyles);