import React, { Component } from 'react';
import { connect } from 'react-redux';
import { TouchableOpacity, Text } from 'react-native';
import { styles } from './styles';
import { CLOCKHEIGHT, TILES } from '../../config';

class Clock extends Component {

  constructor() {
    super();
    this.state = {
      time: 0
    }
    this.togglePause = this.togglePause.bind(this);
  }

  componentDidUpdate(prevProps) {
    const newGameStarted = !prevProps.gameStarted && this.props.gameStarted || prevProps.gameComplete && !this.props.gameComplete;
    const gameComplete = !prevProps.gameComplete && this.props.gameComplete;
    const gameCancelled = prevProps.gameStarted && !prevProps.gameComplete && !this.props.gameStarted;
    if (newGameStarted) {
      this.setupInterval();
    } 
    if (gameComplete || gameCancelled) {
      clearInterval(this.interval);
    } 
    if (gameCancelled || newGameStarted) {
      this.setState({time: 0});
    }
  }

  setupInterval() {
    clearInterval(this.interval);
    const self = this;
    this.interval = setInterval( () => {
      if (!self.props.paused) {
        self.setState({time: self.state.time + 1000})
      }
    }, 1000);
  }

  getClockTime(ms) {
    const totalSecs = ms / 1000;
    const mins = Math.floor( totalSecs / 60 );
    const secs = totalSecs % 60;
    return `${String(mins).padStart(2, '0')} : ${String(secs).padStart(2, '0')}`
  }

  togglePause() {
    if (this.props.gameStarted) {
      this.props.togglePauseGame();
    }
  }

  render() {
    return (
      <TouchableOpacity activeOpacity={.5} onPress={this.togglePause} style={[styles.base, {height: CLOCKHEIGHT}]}>
        <Text style={[styles.clock, {color: this.props.gameComplete ? 'gray' : 'black' }]}>{this.getClockTime(this.state.time)}</Text>
      </TouchableOpacity>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  gameStarted: state.gameStarted,
  gameComplete: state.playedTiles.length === TILES,
  paused: state.gamePaused
});

const mapDispatchToProps = dispatch => ({ 
  togglePauseGame: () => dispatch({type: 'TOGGLE_PAUSE_GAME'}) 
});

export default connect(mapStateToProps, mapDispatchToProps)(Clock);
