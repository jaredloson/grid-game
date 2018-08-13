import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { styles } from './styles';

class Clock extends Component {

  getClockTime(ms) {
    const totalSecs = ms / 1000;
    const mins = Math.floor( totalSecs / 60 );
    const secs = totalSecs % 60;
    return `${String(mins).padStart(2, '0')} : ${String(secs).padStart(2, '0')}`
  }

  render() {
    return (
      <View style={styles.base}>
        <Text style={styles.clock}>{this.getClockTime(this.props.time)}</Text>
      </View>
    );
  }
}

export default Clock;
