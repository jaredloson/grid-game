import React, { Component } from 'react';
import { View, Animated, Easing } from 'react-native';

class TranslateView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      translate: new Animated.ValueXY({
        x: props.x,
        y: props.y
      })
    };
    this.styles = {...props.styles} || {};
  }

  componentDidUpdate(prevProps) {
    const changed = prevProps.x !== this.props.x || prevProps.y !== this.props.y;
    if ( changed && !this.props.disabled ) {
      Animated.timing(this.state.translate, {
        toValue: {
          x: this.props.x,
          y: this.props.y
        },
        easing: Easing.bezier(0.86, 0, 0.07, 1),
        duration: this.props.duration !== undefined ? this.props.duration : 500
      }).start( () => {
        if (this.props.onAnimationComplete) {
          this.props.onAnimationComplete();
        }
      });
    }
  }

  render() {

    console.log(this.styles);

    return (
      <Animated.View style={[
        this.styles,
        {transform: [{translateX: this.state.translate.x}, {translateY: this.state.translate.y}]}
      ]}>
        {this.props.children}
      </Animated.View>
    );
  }

}

export default TranslateView;