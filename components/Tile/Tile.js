import React, { Component } from "react";
import {
  View,
  Text,
  Dimensions,
  PanResponder,
  Animated,
  Easing
} from "react-native";
import { connect } from "react-redux";
import { styles } from "./styles";
import {
  STAGEWIDTH,
  STAGEHEIGHT,
  TILES,
  COLUMNS,
  WIDTH,
  HEIGHT
} from "../../config";
import { propsChanged } from "../../utils";
import {
  slotTile,
  unSlotTile,
  setHoveredSlot
} from "../../redux/actions/actionCreators";
import {
  getStartIndex,
  getStartXY,
  getIsSlottted,
  getGameComplete
} from "../../redux/selectors/index";

export class Tile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      x: props.x,
      y: props.y,
      dragging: false,
      zIndex: props.zIndex,
      lastDx: 0,
      lastDy: 0,
      translate: null,
      rotate: new Animated.Value(0)
    };

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => false,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
      onMoveShouldSetPanResponder: (evt, gestureState) =>
        !this.props.gameComplete,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => false,
      onPanResponderMove: (evt, gestureState) =>
        this.handleResponderMove(gestureState),
      onPanResponderRelease: (evt, gestureState) =>
        this.handleResponderRelease(gestureState)
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      propsChanged(nextProps, this.props, [
        "gameStarted",
        "x",
        "y",
        "tilePlayed",
        "gameComplete"
      ]) || nextState !== this.state
    );
  }

  componentDidUpdate(prevProps) {
    const coordsChanged =
      (prevProps.x !== this.props.x || prevProps.y !== this.props.y) &&
      !this.state.dragging;
    const gameComplete = this.props.gameComplete;
    const tilePlayed = this.props.isSlottted && !prevProps.isSlottted;
    if (coordsChanged && !this.props.isSlottted) {
      const easing =
        prevProps.gameComplete && !this.props.gameComplete
          ? Easing.bounce
          : undefined;
      this.animatePosition({
        x: this.props.x,
        y: this.props.y,
        duration: 250,
        easing: easing
      });
    }
    if (this.props.gameComplete) {
      this.animateRotate(1, this.props.targetIndex * 50);
    } else if (!this.props.gameComplete && prevProps.gameComplete) {
      this.setState({ rotate: new Animated.Value(0) });
    }
  }

  getSlotIdx(label) {
    return this.props.tiles.findIndex(tile => tile.label === label);
  }

  getSlotXY(idx) {
    const x = (idx % COLUMNS) * WIDTH;
    const y = Math.floor(idx / COLUMNS) * HEIGHT;
    return { x, y };
  }

  slotIsHovered(x, y) {
    const entered =
      this.state.x > x - WIDTH &&
      this.state.x < x + WIDTH &&
      this.state.y > y - HEIGHT &&
      this.state.y < y + HEIGHT;
    if (!entered || this.state.x === null || this.state.y === null) {
      return false;
    }
    const hoveredWidth = WIDTH - Math.abs(this.state.x - x);
    const hoveredHeight = HEIGHT - Math.abs(this.state.y - y);
    return hoveredWidth * hoveredHeight >= WIDTH * HEIGHT * 0.5;
  }

  setHovered() {
    let hoveredSlot = null;
    this.props.tiles.forEach((tile, idx) => {
      const { x, y } = this.getSlotXY(idx);
      if (
        this.slotIsHovered(x, y) &&
        this.props.slottedTiles.findIndex(node => node.slot === tile.label) ===
          -1
      ) {
        hoveredSlot = tile.label;
      }
    });
    if (hoveredSlot !== this.props.hoveredSlot) {
      this.props.setHoveredSlot(hoveredSlot);
    }
  }

  handleResponderMove(gestureState) {
    let x = this.state.x + (gestureState.dx - this.state.lastDx);
    x = x < 0 ? 0 : x;
    x = x + this.props.width > STAGEWIDTH ? STAGEWIDTH - this.props.width : x;
    let y = this.state.y + (gestureState.dy - this.state.lastDy);
    y = y < 0 ? 0 : y;
    y =
      y + this.props.height > STAGEHEIGHT ? STAGEHEIGHT - this.props.height : y;
    this.setState(
      {
        x: x,
        y: y,
        lastDx: gestureState.dx,
        lastDy: gestureState.dy,
        dragging: true
      },
      () => {
        if (this.props.isSlottted) {
          const idx = this.props.slottedTiles.findIndex(
            node => node.tile === this.props.label
          );
          const node = this.props.slottedTiles[idx];
          this.props.unSlotTile(node.slot);
        }
      }
    );
    this.setHovered();
  }

  handleResponderRelease(gestureState) {
    this.setState({
      lastDx: 0,
      lastDy: 0,
      dragging: false
    });
    const xy = this.props.hoveredSlot
      ? this.getSlotXY(this.getSlotIdx(this.props.hoveredSlot))
      : { x: this.props.x, y: this.props.y };
    const duration = this.props.hoveredSlot ? 250 : 500;
    this.animatePosition({
      ...xy,
      duration,
      easing: this.props.hoveredSlot ? undefined : Easing.bounce,
      setSlotTile: this.props.hoveredSlot
    });
  }

  animatePosition({
    x,
    y,
    duration,
    easing = Easing.bezier(0.86, 0, 0.07, 1),
    setSlotTile = false
  }) {
    const translate = new Animated.ValueXY({
      x: this.state.x,
      y: this.state.y
    });
    this.setState({ translate }, () => {
      Animated.timing(this.state.translate, {
        toValue: { x, y },
        easing: easing,
        duration: duration
      }).start(() => {
        this.setState({ x, y, translate: null });
        if (setSlotTile) {
          this.props.slotTile(this.props.hoveredSlot, this.props.label);
        }
      });
    });
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
      outputRange: ["0deg", "360deg"]
    });
    const style = {
      width: this.props.width,
      height: this.props.height,
      backgroundColor: this.props.gameComplete
        ? "rgba(0,180,0,.75)"
        : "rgba(0,0,255, .75)",
      transform: [{ rotateY: rotation }],
      zIndex: this.state.dragging ? 2 : 1
    };
    if (this.state.translate) {
      style.left = this.state.translate.x;
      style.top = this.state.translate.y;
    } else {
      style.left = this.state.x;
      style.top = this.state.y;
    }
    return (
      <Animated.View
        style={[styles.base, style]}
        {...this.panResponder.panHandlers}
      >
        {!this.props.gameComplete && (
          <View style={styles.help}>
            <Text style={styles.helpText}>drag me!</Text>
          </View>
        )}
        <Text style={styles.text}>{this.props.label}</Text>
      </Animated.View>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  ...getStartXY(state, ownProps),
  tiles: state.tiles,
  slottedTiles: state.slottedTiles,
  gameStarted: state.gameStarted,
  isSlottted: getIsSlottted(state, ownProps),
  gameComplete: getGameComplete(state),
  hoveredSlot: state.hoveredSlot
});

export default connect(
  mapStateToProps,
  { slotTile, unSlotTile, setHoveredSlot }
)(Tile);
