import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  base: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderColor: '#fff'
  },
  tileEndRow: {
  	borderRightWidth: 0
  },
  text: {
  	fontSize: 40,
  	color: '#fff'
  }
});