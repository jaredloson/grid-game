import { Dimensions, Platform } from 'react-native';

export const shuffle = (a) => {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const isIphoneX = () => {
  let d = Dimensions.get('window');
  const { height, width } = d;
  return (Platform.OS === 'ios' && (height === 812 || width === 812));
}

export const propsChanged = (nextProps, thisProps, props) => {
	return props.filter( prop => nextProps[prop] !== thisProps[prop] ).length > 0;
}