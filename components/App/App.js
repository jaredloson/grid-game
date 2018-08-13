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
      currentX: null,
      currentY: null,
      tiles: [],
      shuffledTiles: [],
      playedTiles: [],
      time: 0
    }
    this.setCoords = this.setCoords.bind(this);
    this.setupGame = this.setupGame.bind(this);
  }

  setupGame() {
    const gameObject = {
      currentX: null,
      currentY: null,
      playedTiles: [],
      time: 0,
      showIntro: false
    }
    gameObject.tiles = this.state.tiles.length > 0 ? this.state.tiles : Array.apply(null, new Array(TILES)).map( (item, idx) => ( {label: idx + 1} ));
    gameObject.shuffledTiles = shuffle(gameObject.tiles.slice());
    this.setState(gameObject);
    this.setupInterval();
  }

  setupInterval() {
    const self = this;
    this.interval = setInterval( () => {
      // timeout after 10 mins
      if (self.state.time >= 1000 * 60 * 10) {
        clearInterval(self.interval);
        self.setState({time: 0, showIntro: true});
        return;
      }
      //clear interval if game complete
      if (self.state.playedTiles.length === self.state.tiles.length) {
        clearInterval(self.interval);
        return;
      }
      // else update clock
      self.setState({time: self.state.time + 1000})
    }, 1000);
  }

  playableShuffledTiles() {
    return this.state.shuffledTiles.filter( tile => {
      const idx = this.state.playedTiles.findIndex( playedTile => playedTile.label === tile.label);
      return idx < 0;
    });
  }

  getGridCoordsFromLabel(label) {
    const idx = this.state.tiles.findIndex( tile => tile.label === label);
    const x = (idx % COLUMNS) * WIDTH;
    const y = Math.floor(idx / COLUMNS) * HEIGHT;
    return {x, y};
  }

  getStartIndexFromLabel(label) {
    return this.playableShuffledTiles().findIndex( tile => tile.label === label);
  }

  getStartCoordsFromLabel(label) {
    const idx = this.getStartIndexFromLabel(label);
    const x = ( -idx + (COLUMNS - 1) ) * WIDTH;
    const y = STAGEHEIGHT - HEIGHT;
    return {x, y};
  }

  setCoords(x, y) {
    this.setState({
      currentX: x,
      currentY: y
    })
  }

  slotTile(tile) {
    const arr = this.state.playedTiles.slice();
    arr.push(tile);
    this.setState({playedTiles: arr});
  }

  slotIsHovered(label) {
    const {x, y} = this.getGridCoordsFromLabel(label)
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
        <Clock time={this.state.time} />

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
              key={tile.label}
              width={WIDTH}
              height={HEIGHT}
              {...this.getGridCoordsFromLabel(tile.label)}
              isOdd={(idx + 1) % 2 === 1}
              label={tile.label}
              isHovered={this.slotIsHovered(tile.label)}
              slotted={this.state.playedTiles.includes(tile)}
            />
          )}

          {/* ROW OF MOVABLE TILES AT STARTING POSITION */}
          {this.state.tiles.map( (tile, idx) =>
            <Tile
              key={tile.label}
              width={WIDTH}
              height={HEIGHT}
              {...this.getStartCoordsFromLabel(tile.label)}
              label={tile.label}
              color={ this.getStartIndexFromLabel(tile.label) % 2 === 0 ? 'rgba(0,0,255,.7)': 'rgba(0,0,255,.8)'}
              setCoords={this.setCoords}
              targetCoords={this.getGridCoordsFromLabel(tile.label)}
              targetIsHovered={() => this.slotIsHovered(tile.label)}
              slotTile={() => this.slotTile(tile)}
              canMove={!this.state.playedTiles.includes(tile)}
              played={this.state.playedTiles.includes(tile)}
            />
          )}        

        </View>

      </View>
    );
  }
}

export default App;