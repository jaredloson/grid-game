import React, { Component } from 'react';
import { View, Text, Dimensions, PanResponder, Animated, Easing } from 'react-native';
import { connect } from 'react-redux';
import { styles } from './styles';
import { STAGEWIDTH, STAGEHEIGHT, TILES, COLUMNS, WIDTH, HEIGHT } from '../../config';
import { propsChanged } from '../../utils';
import {setTileXY, slotTile} from '../../redux/actions/actionCreators';

class Tile extends Component {

	constructor(props) {
    super(props);
    console.log(props);
    this.state = {
    	x: props.x,
      y: props.y,
      zIndex: props.zIndex,
      lastDx: 0,
      lastDy: 0,
      translate: null,
      rotate: new Animated.Value(0)
    }

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => false,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => !this.props.played,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => false,
      onPanResponderMove: (evt, gestureState) => this.handleResponderMove(gestureState),
      onPanResponderRelease: (evt, gestureState) => this.handleResponderRelease(gestureState)
    });

  }

  shouldComponentUpdate(nextProps, nextState) {
    return propsChanged(nextProps, this.props, ['gameStarted', 'x', 'y', 'tilePlayed', 'gameComplete']) ||
           nextState !== this.state;
  }

  componentDidUpdate(prevProps) {
  	const coordsChanged = prevProps.x !== this.props.x || prevProps.y !== this.props.y;
  	const gameComplete = this.props.gameComplete;
    const tilePlayed = this.props.played && !prevProps.played;
    if (coordsChanged && !this.props.played) {
      const easing = prevProps.gameComplete && !this.props.gameComplete ? Easing.bounce : undefined;
  		this.animatePosition({x: this.props.x, y: this.props.y, duration: 250, easing: easing});	
  	}
    if (this.props.gameComplete) {
      this.animateRotate(1, this.props.targetIndex * 50);
    } else if (!this.props.gameComplete && prevProps.gameComplete) {
      this.setState({rotate: new Animated.Value(0)});
    }
  }

  targetIsHovered() {
    const {x, y} = this.props.targetXY;
    const entered = this.state.x > (x - WIDTH) && this.state.x < (x + WIDTH) &&
                    this.state.y > (y - HEIGHT) && this.state.y < (y + HEIGHT); 
    if (!entered || this.state.x === null || this.state.y === null) {
      return false;
    }
    const hoveredWidth = WIDTH - (Math.abs(this.state.x - x));
    const hoveredHeight = HEIGHT - (Math.abs(this.state.y - y));
    return (hoveredWidth * hoveredHeight) >= (WIDTH * HEIGHT * .5);
  }

  handleResponderMove(gestureState) {
  	let x = this.state.x + (gestureState.dx - this.state.lastDx);
    x = x < 0 ? 0 : x;
    x = x + this.props.width > STAGEWIDTH ? STAGEWIDTH - this.props.width : x;
  	let y =  this.state.y + (gestureState.dy - this.state.lastDy);
    y = y < 0 ? 0 : y;
    y = y + this.props.height > STAGEHEIGHT ? STAGEHEIGHT - this.props.height : y;
    this.setState({
    	x: x,
    	y: y,
    	lastDx: gestureState.dx,
    	lastDy: gestureState.dy,
    	dragging: true
    });
    this.props.setTileXY(x, y);
  }

  handleResponderRelease(gestureState) {
  	this.setState({
    	lastDx: 0,
    	lastDy: 0
    });
    const onTarget = this.targetIsHovered(this.props.label);
    const xy = onTarget ? this.props.targetXY : {x: this.props.x, y: this.props.y};
    const duration = onTarget ? 250 : 500;
    this.animatePosition({...xy, duration, easing: onTarget ? undefined : Easing.bounce, slotTile: onTarget});
    this.props.setTileXY(null, null);
  }

  animatePosition({x, y, duration, easing = Easing.bezier(0.86, 0, 0.07, 1), slotTile = false}) {
  	const translate = new Animated.ValueXY({
      x: this.state.x,
      y: this.state.y
    });
  	this.setState({translate});
  	setTimeout( () => {
  		Animated.timing(this.state.translate, {
	      toValue: {x, y},
	      easing: easing,
	      duration: duration
	    }).start( () => {
	      this.setState({x, y, translate: null, dragging: false});
	     	if (slotTile) {
    			this.props.slotTile(this.props.label);
    		}
	    });
  	}, 0);
  }

  animateRotate(value, delay) {
    Animated.timing(this.state.rotate, {
      toValue: value,
      duration: 300,
      delay: delay
    }).start();
  }
  
  render() {
    const rotation = this.state.rotate.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg']
    });
  	const style = {
  		width: this.props.width,
  		height: this.props.height,
  		backgroundColor: this.props.played ? 'rgba(0,180,0,.75)' : 'rgba(0,0,255, .75)',
      transform: [{rotateY: rotation}],
      zIndex: this.state.dragging ? 1 : 0
  	}
    if (this.state.translate) {
      style.left = this.state.translate.x;
      style.top = this.state.translate.y;
    } else {
      style.left = this.state.x;
      style.top = this.state.y;
    }
    return (
      <Animated.View style={[styles.base, style]} {...this.panResponder.panHandlers}>
      	{!this.props.played &&
      		<View style={styles.help}>
            <Text style={styles.helpText}>drag me!</Text>
          </View>
      	}
      	<Text style={styles.text}>{this.props.label}</Text>	
      </Animated.View>
    );
  }

}

const getStartIndex = (state, props) => {
  const playableTiles = state.shuffledTiles.filter( tile => !state.playedTiles.includes(tile.label) );
  return playableTiles.findIndex( tile => tile.label === props.label );
}

const getStartXY = (state, props) => {
  const idx = getStartIndex(state, props);
  const x = ( -idx + (COLUMNS - 1) ) * WIDTH;
  const y = STAGEHEIGHT - HEIGHT;
  return {x, y};
}

const getTargetIndex = (state, props) => {
  return state.tiles.findIndex( tile => tile.label === props.label);
}

const getTargetXY = (state, props) => {
  const idx = getTargetIndex(state, props);
  const x = (idx % COLUMNS) * WIDTH;
  const y = Math.floor(idx / COLUMNS) * HEIGHT;
  return {x, y};
}

const mapStateToProps = (state, ownProps) => ({
  ...getStartXY(state, ownProps),
  startIndex: getStartIndex(state, ownProps),
  targetIndex: getTargetIndex(state, ownProps),
  targetXY: getTargetXY(state, ownProps),
  gameStarted: state.gameStarted,
  played: state.playedTiles.includes(ownProps.label),
  gameComplete: state.playedTiles.length === TILES,
});

//CONNECT
//OPTION 1: use mapDispatchToProps
// the advantage here is that we have the action creators here, visible and editable alongside
// our code where it is used

// const mapDispatchToProps = dispatch => ({
//   setTileXY: (x, y) => dispatch({type: 'SET_XY', x, y}),
//   slotTile: (tileLabel) => dispatch({type: 'SLOT_TILE', tileLabel})
// });

// export default connect(mapStateToProps, mapDispatchToProps)(Tile);

//OPTION 2: Extract to actionCreators.js
//We're abstracting the action creators into a single place to separate the concerns and
//be able to track down our actions together
console.log(setTileXY);
export default connect(mapStateToProps, {setTileXY, slotTile})(Tile);

//OPTION 3: use bindActionCreators inside of mapDispatchToProps
//Apparently is frowned upon unless you're trying just to pass all your actions down as children
//Read more: https://redux.js.org/api/bindactioncreators
