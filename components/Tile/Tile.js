import React, { Component } from 'react';
import { View, Text, Dimensions, PanResponder, Animated, Easing } from 'react-native';
import { connect } from 'react-redux';
import { styles } from './styles';
import { STAGEWIDTH, STAGEHEIGHT, TILES, COLUMNS, WIDTH, HEIGHT } from '../../config';


class Tile extends Component {

	constructor(props) {
    super(props);
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
    const coordsChanged = nextProps.x !== this.props.x || nextProps.y !== this.props.y;
    const gameComplete = nextProps.gameComplete && !this.props.gameComplete;
    const tilePlayed = nextProps.tilePlayed && !this.props.played;
    return coordsChanged || gameComplete || tilePlayed || nextState !== this.state;
  }

  componentDidUpdate(prevProps) {
  	const coordsChanged = prevProps.x !== this.props.x || prevProps.y !== this.props.y;
  	const gameComplete = this.props.gameComplete;
    const tilePlayed = this.props.played && !prevProps.played;
    if (coordsChanged && !this.props.played) {
  		this.animatePosition({x: this.props.x, y: this.props.y, duration: 250});	
  	}
    if (this.props.gameComplete) {
      this.animateRotate(1, this.props.targetIndex * 50);
    } else if (!this.props.gameComplete && prevProps.gameComplete) {
      this.setState({rotate: new Animated.Value(0)});
    }
  }

  getTileColor() {
    if (this.props.played) {
      return this.props.targetIndex % 2 === 0 ? 'rgb(0,160,0)': 'rgb(0,180,0)';
    } else {
      return this.props.startIndex % 2 === 0 ? 'rgb(0,0,200)': 'rgb(0,0,230)';
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
    this.props.setXY(x, y);
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
    this.props.setXY(null, null);
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
  		backgroundColor: this.getTileColor(),
      transform: [{rotateY: rotation}]
  	}
    if (this.state.translate) {
      style.left = this.state.translate.x;
      style.top = this.state.translate.y;
    } else {
      style.left = this.state.x;
      style.top = this.state.y;
    }
    return (
      <Animated.View style={[styles.base, style, {zIndex: this.state.dragging ? 1 : 0}]} {...this.panResponder.panHandlers}>
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

const mapStateToProps = (state, ownProps) => {

  function getStartIndex() {
    const playableTiles = state.shuffledTiles.filter( tile => !state.playedTiles.includes(tile.label) );
    return playableTiles.findIndex( tile => tile.label === ownProps.label );
  }

  function getStartXY() {
    const idx = getStartIndex();
    const x = ( -idx + (COLUMNS - 1) ) * WIDTH;
    const y = STAGEHEIGHT - HEIGHT;
    return {x, y};
  }

  function getTargetIndex() {
    return state.tiles.findIndex( tile => tile.label === ownProps.label);
  }

  function getTargetXY() {
    const idx = getTargetIndex();
    const x = (idx % COLUMNS) * WIDTH;
    const y = Math.floor(idx / COLUMNS) * HEIGHT;
    return {x, y};
  }

  return {
    ...getStartXY(),
    startIndex: getStartIndex(),
    targetIndex: getTargetIndex(),
    targetXY: getTargetXY(),
    played: state.playedTiles.includes(ownProps.label),
    gameComplete: state.playedTiles.length === TILES,
  }

};

const mapDispatchToProps = dispatch => ({
  setXY: (x, y) => dispatch({type: 'SET_XY', x, y}),
  slotTile: (tileLabel) => dispatch({type: 'SLOT_TILE', tileLabel})
});

export default connect(mapStateToProps, mapDispatchToProps)(Tile);