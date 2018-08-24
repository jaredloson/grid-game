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
    backgroundColor: props.isHovered ? 'rgba(0,0,0,.2)' : 'rgba(0,0,0,.0)'
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

  return {
    ...getXY(),
    isHovered: state.hoveredSlot === ownProps.label
  }

};

export default connect(mapStateToProps, null)(Slot);
