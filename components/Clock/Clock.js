import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text } from 'react-native';
import { styles } from './styles';
import { CLOCKHEIGHT, TILES } from '../../config';

class Clock extends Component {

  constructor() {
    super();
    this.state = {
      time: 0
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.paused && !this.props.paused) {
      this.setState({time: 0});
      this.setupInterval();
    } else if (this.props.paused && !prevProps.paused) {
      clearInterval(this.interval);
    }
  }

  setupInterval() {
    clearInterval(this.interval);
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

const mapStateToProps = (state, ownProps) => ({paused: !state.gameStarted || state.playedTiles.length === TILES});

export default connect(mapStateToProps, null)(Clock);
