import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { styles } from './styles';


const Slot = (props) => {

  const style = {
    width: props.width,
    height: props.height,
    left: props.x,
    top: props.y,
    backgroundColor: props.idx % 2 === 1 ? 'rgba(0,0,0,.1)' : 'rgba(0,0,0,.05)',
    opacity: props.slotted ? 0 : 1
  }
  if (props.isHovered) {
    style.backgroundColor = 'rgba(0,0,0,.25)';
  }
  if (props.slotted) {
    style.backgroundColor = 'rgba(0,0,0,.25)';
  }

  return (
    <View style={[styles.base, style]}>
      <Text style={{fontSize: props.slotted ? 40 : 15}}>{props.label}</Text>
    </View>
  );

}

export default Slot;
