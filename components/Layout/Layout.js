import React, { Component } from 'react';
import { View, TouchableOpacity, Text, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { rawStyles, styles } from './styles';
import Clock from '../Clock/Clock';
import Slot from '../Slot/Slot';
import Tile from '../Tile/Tile';
import FadeView from '../../animators/FadeView';
import { TOPPAD, BOTTOMPAD, STAGEWIDTH, STAGEHEIGHT, TILES, COLUMNS, ROWS, WIDTH, HEIGHT } from '../../config';
import { propsChanged } from '../../utils';
import {setupGame, togglePauseGame} from '../../redux/actions/actionCreators';

class Layout extends Component {

  shouldComponentUpdate(nextProps) {
    return propsChanged(nextProps, this.props, ['gameStarted', 'gamePaused', 'gameComplete', 'tiles']);
  }

  getStubPosition(idx) {
    const left = (idx % COLUMNS) * WIDTH;
    const top = Math.floor(idx / COLUMNS) * HEIGHT;
    return {left, top};
  }

  getStubColor(idx) {
    const offset = COLUMNS % 2 === 0 && Math.floor(idx / COLUMNS) % 2 === 0 ? 1 : 0;
    const darkColor = (idx + offset) % 2 === 1;
    return darkColor ? 'rgba(0,0,0,.15)' : 'rgba(0,0,0,.05)';
  }

  render() {

    return (
      <View style={{...rawStyles.base, paddingTop: TOPPAD, paddingBottom: BOTTOMPAD}}>

        <View style={styles.inner}>

          {/* CHECKERED BACKGROUND PATTERN*/}  
          {[...Array(ROWS * COLUMNS)].map( (item, idx) =>
            <View key={`slot_stub${idx}`} pointerEvents="none" style={[styles.slotStub, {...this.getStubPosition(idx), width: WIDTH, height: HEIGHT, backgroundColor: this.getStubColor(idx)}]}></View>
          )}

          {/* INTRO SCREEN */}
          <FadeView
            fadeTo={this.props.gameStarted ? 0 : 1}
            duration={this.props.gameStarted ? 300 : 0}
            styles={{...rawStyles.screen, zIndex: this.props.gameStarted ? 0 : 999}}
          >
            <Text style={styles.screenText}>welcome!</Text>
            <Text style={styles.screenTextSmall}></Text>
            <TouchableOpacity activeOpacity={.5} onPress={() => this.props.setupGame(true)} style={styles.button}>
              <Text style={styles.buttonText}>start</Text>
            </TouchableOpacity>
          </FadeView>

          {/* GAME PAUSED SCREEN */}
          <FadeView
            fadeTo={this.props.gamePaused ? 1 : 0}
            duration={this.props.gamePaused ? 300 : 0}
            styles={{...rawStyles.screen, zIndex: this.props.gamePaused ? 999 : 0}}
          >
            <TouchableOpacity activeOpacity={.5} onPress={this.props.togglePauseGame} style={styles.button}>
              <Text style={styles.buttonText}>resume game</Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={.5} onPress={() => this.props.setupGame(false)} style={styles.button}>
              <Text style={styles.buttonText}>cancel game</Text>
            </TouchableOpacity>
          </FadeView>

          {/* COMPLETE SCREEN */}
          <FadeView
            fadeTo={this.props.gameComplete ? 1 : 0}
            duration={this.props.gameComplete ? 300 : 0}
            delay={this.props.gameComplete ? this.props.tiles.length * 50 + 500 : 0}
            styles={{...rawStyles.screen, ...rawStyles.screenComplete, height: HEIGHT, zIndex: this.props.gameComplete ? 999 : 0}}
          >
            <TouchableOpacity activeOpacity={.5} onPress={this.props.setupGame} style={[styles.button, styles.buttonSolo]}>
              <Text style={styles.buttonText}>play again</Text>
            </TouchableOpacity>
          </FadeView>

          {/* GRID OF SLOTS THAT TILES ARE MOVED ONTO */}
          {this.props.tiles.map( (tile, idx) =>
            <Slot
              key={`slot_${tile.label}`}
              idx={idx}
              width={WIDTH}
              height={HEIGHT}
              label={tile.label}
            />
          )}

          {/* ROW OF MOVABLE TILES */}
          {this.props.tiles.map( (tile, idx) =>
            <Tile
              key={`tile_${tile.label}`}
              width={WIDTH}
              height={HEIGHT}
              label={tile.label}
            />
          )}  

        </View>

        {/* CLOCK */}
        <Clock />

      </View>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  tiles: state.tiles,
  playedTiles: state.playedTiles,
  gameStarted: state.gameStarted,
  gameComplete: state.playedTiles.length === TILES,
  gamePaused: state.gamePaused
});

export default connect(mapStateToProps, {setupGame, togglePauseGame})(Layout);