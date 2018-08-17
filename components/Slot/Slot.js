import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import { styles } from './styles';
import { COLUMNS, WIDTH, HEIGHT } from '../../config';

const Slot = (props) => {

  const style = {
    width: props.width,
    height: props.height,
    left: props.x,
    top: props.y,
    backgroundColor: props.idx % 2 === 1 ? 'rgba(0,0,0,.1)' : 'rgba(0,0,0,.05)',
    opacity: props.slotted ? 0 : 1
  }
  if (props.isHovered) {
    style.backgroundColor = 'rgba(0,0,0,.25)';
  }
  if (props.slotted) {
    style.backgroundColor = 'rgba(0,0,0,.25)';
  }

  return (
    <View style={[styles.base, style]}>
      <Text style={styles.text}>{props.label}</Text>
    </View>
  );

}

const mapStateToProps = (state, ownProps) => {

  function getXY() {
    const x = (ownProps.idx % COLUMNS) * WIDTH;
    const y = Math.floor(ownProps.idx / COLUMNS) * HEIGHT;
    return {x, y};
  }

  function isHovered() {
    const {x, y} = getXY();
    const entered = state.x > (x - WIDTH) && state.x < (x + WIDTH) &&
                    state.y > (y - HEIGHT) && state.y < (y + HEIGHT); 
    if (!entered || state.x === null || state.y === null) {
      return false;
    }
    const hoveredWidth = WIDTH - (Math.abs(state.x - x));
    const hoveredHeight = HEIGHT - (Math.abs(state.y - y));
    return (hoveredWidth * hoveredHeight) >= (WIDTH * HEIGHT * .5);
  }

  return {
    ...getXY(),
    isHovered: isHovered(),
    slotted: state.playedTiles.includes(ownProps.label)
  }

};

export default connect(mapStateToProps, null)(Slot);
