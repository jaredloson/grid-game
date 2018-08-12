import React, { Component } from 'react';
import { View, TouchableOpacity, Text, Dimensions } from 'react-native';
import { rawStyles, styles } from './styles';
import Slot from '../Slot/Slot';
import Tile from '../Tile/Tile';
import TranslateView from '../../animators/TranslateView';
import { shuffle } from '../../utils';

const STAGEWIDTH = Dimensions.get('window').width;
const STAGEHEIGHT = Dimensions.get('window').height - 20;
const TILES = 9;
const COLUMNS = 3;
const WIDTH = STAGEWIDTH / COLUMNS;
const ROWS = TILES % COLUMNS > 0 ? Math.floor(TILES / COLUMNS) + 2 : Math.floor(TILES / COLUMNS) + 1;
const HEIGHT = STAGEHEIGHT / ROWS;

class App extends Component {
  
  constructor() {
    super();
    this.state = {
      showIntro: false,
      currentX: null,
      currentY: null,
      tiles: [],
      shuffledTiles: [],
      playedTiles: []
    }
    this.setCoords = this.setCoords.bind(this);
    this.setupGame = this.setupGame.bind(this);
  }

  componentDidMount() {
    this.setupGame();
  }

  setupGame() {
    const tiles = Array.apply(null, new Array(TILES)).map( (item, idx) => ( {label: idx + 1} ));
    const shuffledTiles = shuffle(tiles.slice());
    this.setState({
      currentX: null,
      currentY: null,
      tiles: tiles,
      shuffledTiles: shuffledTiles,
      playedTiles: []
    })
  }

  playableShuffledTiles() {
    return this.state.shuffledTiles.filter( tile => {
      const idx = this.state.playedTiles.findIndex( playedTile => playedTile.label === tile.label);
      return idx < 0;
    });
  }

  getSlotCoordsFromLabel(label) {
    const idx = this.state.tiles.findIndex( tile => tile.label === label);
    const x = (idx % COLUMNS) * WIDTH;
    const y = Math.floor(idx / COLUMNS) * HEIGHT;
    return {x, y};
  }

  getTileCoordsFromIndex(idx) {
    const tile = this.playableShuffledTiles()[idx];
    const x = (-idx + 2) * WIDTH;
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
    const {x, y} = this.getSlotCoordsFromLabel(label)
    const entered = this.state.currentX > (x - WIDTH) && this.state.currentX < (x + WIDTH) &&
                    this.state.currentY > (y - HEIGHT) && this.state.currentY < (y + HEIGHT); 
    if (!entered || this.state.currentX === null || this.state.currentY === null) {
      return false;
    }
    const width = WIDTH - (Math.abs(this.state.currentX - x));
    const height = HEIGHT - (Math.abs(this.state.currentY - y));
    return (width * height) >= (WIDTH * HEIGHT * .5);
  }

  render() {

    return (
      <View style={styles.base}>

        <View style={styles.inner}>

          {this.state.playedTiles.length === this.state.tiles.length &&
            <View style={styles.screen}>
              <Text style={styles.screenText}>congrats!</Text>
              <TouchableOpacity activeOpacity={.5} onPress={this.setupGame} style={styles.button}>
                <Text style={styles.buttonText}>restart</Text>
              </TouchableOpacity>
            </View>
          }

          {/* GRID OF SLOTS THAT TILES ARE DRAGGED ONTO */}
          {this.state.tiles.map( (tile, idx) =>
            <Slot
              key={tile.label}
              width={WIDTH}
              height={HEIGHT}
              {...this.getSlotCoordsFromLabel(tile.label)}
              isOdd={(idx + 1) % 2 === 1}
              label={tile.label}
              isHovered={this.slotIsHovered(tile.label)}
              slotted={this.state.playedTiles.includes(tile)}
            />
          )}

          {/* ROW OF SHUFFLED DRAGGABLE TILES */}
          {this.playableShuffledTiles().map( (tile, idx) =>
            <Tile
              key={tile.label}
              width={WIDTH}
              height={HEIGHT}
              {...this.getTileCoordsFromIndex(idx)}
              label={tile.label}
              color='blue'
              setCoords={this.setCoords}
              targetCoords={this.getSlotCoordsFromLabel(tile.label)}
              targetIsHovered={() => this.slotIsHovered(tile.label)}
              slotTile={() => this.slotTile(tile)}
              canMove={true}
              played={this.state.playedTiles.includes(tile)}
            />
          )}  

          {/* PLAYED TILES */}
          {this.state.playedTiles.map( (tile, idx) =>
            <Tile
              key={tile.label}
              width={WIDTH}
              height={HEIGHT}
              {...this.getSlotCoordsFromLabel(tile.label)}
              label={tile.label}
              color='blue'
              canMove={false}
            />
          )}          

        </View>

      </View>
    );
  }
}

export default App;
