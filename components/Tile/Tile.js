import React, { Component } from 'react';
import { View, Text, Dimensions, PanResponder, Animated, Easing } from 'react-native';
import { styles } from './styles';

const WINWIDTH = Dimensions.get('window').width;
const STAGEHEIGHT = Dimensions.get('window').height - 20;

class Tile extends Component {

	constructor(props) {
    super(props);
    this.state = {
    	x: props.x,
      y: props.y,
      zIndex: props.zIndex,
      lastDx: 0,
      lastDy: 0,
      translate: null
    }
  }

	componentWillMount() {
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => false,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => this.props.canMove,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => false,
      onPanResponderMove: (evt, gestureState) => this.handleResponderMove(gestureState),
      onPanResponderRelease: (evt, gestureState) => this.handleResponderRelease(gestureState)
    });
  }

  componentDidUpdate(prevProps) {
  	const coordsChanged = prevProps.x !== this.props.x || prevProps.y !== this.props.y;
  	if (coordsChanged && this.props.canMove) {
  		this.animatePosition({x: this.props.x, y: this.props.y}, 250, Easing.bounce);	
  	}
  }

  handleResponderMove(gestureState) {
  	let x = this.state.x + (gestureState.dx - this.state.lastDx);
    x = x < 0 ? 0 : x;
    x = x + this.props.width > WINWIDTH ? WINWIDTH - this.props.width : x;
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
    this.props.setCoords(x, y);
  }

  handleResponderRelease(gestureState) {
  	this.setState({
    	lastDx: 0,
    	lastDy: 0
    });
    const onTarget = this.props.targetIsHovered(this.props.label);
    const coords = onTarget ? this.props.targetCoords : {x: this.props.x, y: this.props.y};
    const duration = onTarget ? 250 : 500;
    this.animatePosition(coords, duration, onTarget ? undefined : Easing.bounce, onTarget);
    this.props.setCoords(null, null);
  }

  animatePosition({x, y}, duration, easing = Easing.bezier(0.86, 0, 0.07, 1), slotTile = false) {
  	const translate = new Animated.ValueXY({
      x: this.state.x,
      y: this.state.y
    });
  	this.setState({translate});
  	setTimeout( () => {
  		Animated.timing(this.state.translate, {
	      toValue: {
	        x: x,
	        y: y
	      },
	      easing: easing,
	      duration: duration
	    }).start( () => {
	      this.setState({
	      	translate: null,
	      	x: x,
	      	y: y,
	      	dragging: false
	     	});
	     	if (slotTile) {
    			this.props.slotTile();
    		}
	    });
  	}, 0);
  }
  
  render() {
  	const style = {
  		width: this.props.width,
  		height: this.props.height,
  		backgroundColor: this.props.played ? 'rgba(0,150,0,.9)' : this.props.color
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
      		<Text style={styles.helpText}>drag me!</Text>	
      	}
      	<Text style={styles.text}>{this.props.label}</Text>	
      </Animated.View>
    );
  }

}

export default Tile;