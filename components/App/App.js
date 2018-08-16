import React, { Component } from 'react';
import { View, TouchableOpacity, Text, Dimensions } from 'react-native';
import { rawStyles, styles } from './styles';
import Clock from '../Clock/Clock';
import Slot from '../Slot/Slot';
import Tile from '../Tile/Tile';
import FadeView from '../../animators/FadeView';
import { TOPPAD, BOTTOMPAD, STAGEWIDTH, STAGEHEIGHT, TILES, COLUMNS, WIDTH, HEIGHT } from '../../config';
import { shuffle } from '../../utils';

class App extends Component {
  
  constructor() {
    super();
    this.state = {
      showIntro: true,
      showComplete: false,
      gameStarted: false,
      currentX: null,
      currentY: null,
      tiles: [],
      shuffledTiles: [],
      playedTiles: []
    }
    this.setXY = this.setXY.bind(this);
    this.setupGame = this.setupGame.bind(this);
    this.slotTile = this.slotTile.bind(this);
    this.slotIsHovered = this.slotIsHovered.bind(this);
  }

  setupGame() {
    const gameObject = {
      currentX: null,
      currentY: null,
      playedTiles: [],
      time: 0,
      showIntro: false,
      gameStarted: true
    }
    gameObject.tiles = this.state.tiles.length > 0 ? this.state.tiles : Array.apply(null, new Array(TILES)).map( (item, idx) => ( {label: idx + 1} ));
    gameObject.shuffledTiles = shuffle(gameObject.tiles.slice());
    this.setState(gameObject);
  }

  getGridIndexFromLabel(label) {
    return this.state.tiles.findIndex( tile => tile.label === label);
  }

  getGridXYFromLabel(label) {
    const idx = this.state.tiles.findIndex( tile => tile.label === label);
    const x = (idx % COLUMNS) * WIDTH;
    const y = Math.floor(idx / COLUMNS) * HEIGHT;
    return {x, y};
  }

  getStartIndexFromLabel(label) {
    const playableTiles = this.state.shuffledTiles.filter( tile => {
      const idx = this.state.playedTiles.findIndex( label => label === tile.label);
      return idx < 0;
    });
    return playableTiles.findIndex( tile => tile.label === label);
  }

  getStartXYFromLabel(label) {
    const idx = this.getStartIndexFromLabel(label);
    const x = ( -idx + (COLUMNS - 1) ) * WIDTH;
    const y = STAGEHEIGHT - HEIGHT;
    return {x, y};
  }

  setXY(x, y) {
    this.setState({
      currentX: x,
      currentY: y
    })
  }

  slotTile(label) {
    const arr = this.state.playedTiles.slice();
    arr.push(label);
    this.setState({playedTiles: arr});
  }

  slotIsHovered(label) {
    const {x, y} = this.getGridXYFromLabel(label)
    const entered = this.state.currentX > (x - WIDTH) && this.state.currentX < (x + WIDTH) &&
                    this.state.currentY > (y - HEIGHT) && this.state.currentY < (y + HEIGHT); 
    if (!entered || this.state.currentX === null || this.state.currentY === null) {
      return false;
    }
    const hoveredWidth = WIDTH - (Math.abs(this.state.currentX - x));
    const hoveredHeight = HEIGHT - (Math.abs(this.state.currentY - y));
    return (hoveredWidth * hoveredHeight) >= (WIDTH * HEIGHT * .5);
  }

  render() {

    const gameComplete = this.state.playedTiles.length === this.state.tiles.length && this.state.tiles.length > 0;

    return (
      <View style={{...rawStyles.base, paddingTop: TOPPAD, paddingBottom: BOTTOMPAD}}>

        {/* CLOCK */}
        <Clock start={this.state.gameStarted && !gameComplete} paused={gameComplete} />

        <View style={styles.inner}>

          {/* INTRO SCREEN */}
          <FadeView
            fadeTo={ this.state.showIntro ? 1 : 0}
            duration={300}
            styles={{...rawStyles.screen, zIndex: this.state.showIntro ? 999 : 0}}
          >
            <Text style={styles.screenText}>welcome!</Text>
            <Text style={styles.screenTextSmall}>Move blue tiles onto the correct spot in the checkered grid.</Text>
            <TouchableOpacity activeOpacity={.5} onPress={this.setupGame} style={styles.button}>
              <Text style={styles.buttonText}>start</Text>
            </TouchableOpacity>
          </FadeView>

          {/* COMPLETE SCREEN */}
          <FadeView
            fadeTo={ gameComplete ? 1 : 0}
            duration={gameComplete ? 300 : 0}
            delay={gameComplete ? this.state.tiles.length * 50 + 500 : 0}
            styles={{...rawStyles.screen, zIndex: gameComplete ? 999 : 0}}
          >
            <Text style={styles.screenText}>congrats!</Text>
            <TouchableOpacity activeOpacity={.5} onPress={this.setupGame} style={styles.button}>
              <Text style={styles.buttonText}>play again</Text>
            </TouchableOpacity>
          </FadeView>

          {/* GRID OF SLOTS THAT TILES ARE MOVED ONTO */}
          {this.state.tiles.map( (tile, idx) =>
            <Slot
              key={`slot_${tile.label}`}
              idx={idx}
              width={WIDTH}
              height={HEIGHT}
              label={tile.label}
              {...this.getGridXYFromLabel(tile.label)}              
              isHovered={this.slotIsHovered(tile.label)}
              slotted={this.state.playedTiles.includes(tile.label)}
            />
          )}

          {/* ROW OF MOVABLE TILES AT STARTING POSITION */}
          {this.state.tiles.map( (tile, idx) =>
            <Tile
              key={`tile_${tile.label}`}
              idx={this.getStartIndexFromLabel(tile.label)}
              width={WIDTH}
              height={HEIGHT}
              label={tile.label}
              {...this.getStartXYFromLabel(tile.label)}              
              setParentXY={this.setXY}
              targetIndex={this.getGridIndexFromLabel(tile.label)}
              targetXY={this.getGridXYFromLabel(tile.label)}
              targetIsHovered={this.slotIsHovered}
              slotTile={this.slotTile}
              played={this.state.playedTiles.includes(tile.label)}
              gameComplete={gameComplete}
            />
          )}  

          {/* CHECKERED PATTERN BENEATH BOTTOM ROW OF TILES */}  
          {[...Array(10)].map( (item, idx) =>
            <View key={`slot_stub${idx}`} pointerEvents="none" style={[styles.slotStub, {top: STAGEHEIGHT - HEIGHT, left: WIDTH * idx, width: WIDTH, height: HEIGHT, backgroundColor: idx % 2 === 1 ? 'rgba(0,0,0,.1)' : 'rgba(0,0,0,.05)'}]}></View>
          )}

        </View>

      </View>
    );
  }
}

export default App;