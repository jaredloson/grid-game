import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { styles } from './styles';


class Slot extends Component {

  render() {
    
    const style = {
      width: this.props.width,
      height: this.props.height,
      left: this.props.x,
      top: this.props.y,
      backgroundColor: this.props.isOdd ? 'rgba(0,0,0,.1)' : 'rgba(0,0,0,.05)',
    }
    if (this.props.isHovered) {
      style.backgroundColor = 'rgba(0,0,0,.25)';
    }
    if (this.props.slotted) {
      style.backgroundColor = 'rgba(0,0,0,.25)';
    }

    return (
      <View style={[styles.base, style]}>
        <Text style={{fontSize: this.props.slotted ? 40 : 15}}>{this.props.label}</Text>
      </View>
    );
  }
}

export default Slot;
