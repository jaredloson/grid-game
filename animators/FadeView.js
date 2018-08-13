import React, { Component } from 'react';
import { View, Animated, Easing } from 'react-native';

class FadeView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      fadeTo: new Animated.Value(props.fadeTo)
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.fadeTo !== this.props.fadeTo && !this.props.disabled) {
      Animated.timing(this.state.fadeTo, {
        toValue: this.props.fadeTo,
        duration: this.props.duration
      }).start();
    }
  }

  render() {
    const styles = {...this.props.styles} || {};
    return (
      <Animated.View style={{...styles, opacity: this.state.fadeTo}}>
        {this.props.children}
      </Animated.View>
    );
  }

}

export default FadeView;