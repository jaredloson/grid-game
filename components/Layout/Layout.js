import React, { Component } from 'react';
import { View, TouchableOpacity, Text, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { rawStyles, styles } from './styles';
import Clock from '../Clock/Clock';
import Slot from '../Slot/Slot';
import Tile from '../Tile/Tile';
import FadeView from '../../animators/FadeView';
import { TOPPAD, BOTTOMPAD, STAGEWIDTH, STAGEHEIGHT, TILES, COLUMNS, ROWS, WIDTH, HEIGHT } from '../../config';
import { shuffle, propsChanged } from '../../utils';

class Layout extends Component {

  shouldComponentUpdate(nextProps) {
    return propsChanged(nextProps, this.props, ['showIntro', 'tiles', 'gameComplete']);
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
          {[...Array(TILES + COLUMNS)].map( (item, idx) =>
            <View key={`slot_stub${idx}`} pointerEvents="none" style={[styles.slotStub, {...this.getStubPosition(idx), width: WIDTH, height: HEIGHT, backgroundColor: this.getStubColor(idx)}]}></View>
          )}

          {/* INTRO SCREEN */}
          <FadeView
            fadeTo={ this.props.showIntro ? 1 : 0}
            duration={300}
            styles={{...rawStyles.screen, zIndex: this.props.showIntro ? 999 : 0}}
          >
            <Text style={styles.screenText}>welcome!</Text>
            <Text style={styles.screenTextSmall}></Text>
            <TouchableOpacity activeOpacity={.5} onPress={this.props.setupGame} style={styles.button}>
              <Text style={styles.buttonText}>start</Text>
            </TouchableOpacity>
          </FadeView>

          {/* COMPLETE SCREEN */}
          <FadeView
            fadeTo={ this.props.gameComplete ? 1 : 0}
            duration={this.props.gameComplete ? 300 : 0}
            delay={this.props.gameComplete ? this.props.tiles.length * 50 + 500 : 0}
            styles={{...rawStyles.screen, ...rawStyles.screenComplete, height: HEIGHT, zIndex: this.props.gameComplete ? 999 : 0}}
          >
            <TouchableOpacity activeOpacity={.5} onPress={this.props.setupGame} style={styles.button}>
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
  showIntro: state.showIntro,
  tiles: state.tiles,
  playedTiles: state.playedTiles,
  gameComplete: state.playedTiles.length === TILES
});

const mapDispatchToProps = dispatch => ({
  setupGame: () => dispatch({type: 'SETUP_GAME'})
});

export default connect(mapStateToProps, mapDispatchToProps)(Layout);