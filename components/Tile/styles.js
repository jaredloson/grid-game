import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  base: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1
  },
  tileEndRow: {
  	borderRightWidth: 0
  },
  text: {
  	fontSize: 40,
  	color: '#fff'
  },
  help: {
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    alignItems: 'center'
  },
  helpText: {
  	color: '#fff',
  	marginBottom: 10
  }
});