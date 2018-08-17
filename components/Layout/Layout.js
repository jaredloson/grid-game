import React, { Component } from 'react';
import { View, TouchableOpacity, Text, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { rawStyles, styles } from './styles';
import Clock from '../Clock/Clock';
import Slot from '../Slot/Slot';
import Tile from '../Tile/Tile';
import FadeView from '../../animators/FadeView';
import { TOPPAD, BOTTOMPAD, STAGEWIDTH, STAGEHEIGHT, TILES, COLUMNS, WIDTH, HEIGHT } from '../../config';
import { shuffle } from '../../utils';

class Layout extends Component {

  render() {

    return (
      <View style={{...rawStyles.base, paddingTop: TOPPAD, paddingBottom: BOTTOMPAD}}>

        {/* CLOCK */}
        <Clock />

        <View style={styles.inner}>

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
            styles={{...rawStyles.screen, zIndex: this.props.gameComplete ? 999 : 0}}
          >
            <Text style={styles.screenText}>congrats!</Text>
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

          {/* ROW OF MOVABLE TILES AT STARTING POSITION */}
          {this.props.tiles.map( (tile, idx) =>
            <Tile
              key={`tile_${tile.label}`}
              width={WIDTH}
              height={HEIGHT}
              label={tile.label}
            />
          )}  

          {/* CHECKERED PATTERN BENEATH BOTTOM ROW OF TILES */}  
          {[...Array(COLUMNS)].map( (item, idx) =>
            <View key={`slot_stub${idx}`} pointerEvents="none" style={[styles.slotStub, {top: STAGEHEIGHT - HEIGHT, left: WIDTH * idx, width: WIDTH, height: HEIGHT, backgroundColor: idx % 2 === 1 ? 'rgba(0,0,0,.1)' : 'rgba(0,0,0,.05)'}]}></View>
          )}

        </View>

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