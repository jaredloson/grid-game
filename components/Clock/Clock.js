import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { styles } from './styles';
import { CLOCKHEIGHT } from '../../config';


class Clock extends Component {

  constructor() {
    super();
    this.state = {
      time: 0
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.start && !prevProps.start) {
      this.setState({time: 0});
      this.setupInterval();
    } else if (this.props.paused && !prevProps.paused) {
      clearInterval(this.interval);
    }
  }

  setupInterval() {
    const self = this;
    this.interval = setInterval( () => {
      self.setState({time: self.state.time + 1000})
    }, 1000);
  }

  getClockTime(ms) {
    const totalSecs = ms / 1000;
    const mins = Math.floor( totalSecs / 60 );
    const secs = totalSecs % 60;
    return `${String(mins).padStart(2, '0')} : ${String(secs).padStart(2, '0')}`
  }

  render() {
    return (
      <View style={[styles.base, {height: CLOCKHEIGHT}]}>
        <Text style={[styles.clock, {color: this.props.paused ? 'blue' : 'black' }]}>{this.getClockTime(this.state.time)}</Text>
      </View>
    );
  }
}

export default Clock;
