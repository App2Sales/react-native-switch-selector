import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Animated,
  Easing,
  I18nManager,
  Image,
  PanResponder,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const styles = {
  button: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  animated: {
    borderWidth: 0,
    position: 'absolute',
  },
};

export default class SwitchSelector extends Component {
  constructor(props) {
    super(props);
    const { initial, options } = props;
    this.state = {
      selected: initial,
    };

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: this.shouldSetResponder,
      onMoveShouldSetPanResponder: this.shouldSetResponder,
      onPanResponderRelease: this.responderEnd,
      onPanResponderTerminate: this.responderEnd,
    });

    this.animatedValue = new Animated.Value(
      initial
        ? I18nManager.isRTL
          ? -(initial / options.length)
          : initial / options.length
        : 0,
    );
  }

  componentDidUpdate(prevProps) {
    const { value, disableValueChangeOnPress } = this.props;
    if (prevProps.value !== value) {
      this.toggleItem(value, !disableValueChangeOnPress);
    }
  }

  getSwipeDirection(gestureState) {
    const { dx, dy, vx } = gestureState;
    // 0.1 velocity
    if (Math.abs(vx) > 0.1 && Math.abs(dy) < 80) {
      return dx > 0 ? 'RIGHT' : 'LEFT';
    }
    return null;
  }

  getBgColor() {
    const { selected } = this.state;
    const { options, buttonColor } = this.props;
    if (selected === -1) {
      return 'transparent';
    }
    return options[selected].activeColor || buttonColor;
  }

  responderEnd = (evt, gestureState) => {
    const { disabled, options } = this.props;
    const { selected } = this.state;

    if (disabled) return;
    const swipeDirection = this.getSwipeDirection(gestureState);
    if (
      swipeDirection === 'RIGHT'
      && selected < options.length - 1
    ) {
      this.toggleItem(selected + 1);
    } else if (swipeDirection === 'LEFT' && selected > 0) {
      this.toggleItem(selected - 1);
    }
  };

  shouldSetResponder = (evt, gestureState) => evt.nativeEvent.touches.length === 1
    && !(Math.abs(gestureState.dx) < 5 && Math.abs(gestureState.dy) < 5);

  animate = (value, last) => {
    const { animationDuration } = this.props;
    this.animatedValue.setValue(last);
    Animated.timing(this.animatedValue, {
      toValue: value,
      duration: animationDuration,
      easing: Easing.cubic,
      useNativeDriver: true,
    }).start();
  };

  toggleItem = (index, callOnPress = true) => {
    const { selected } = this.state;
    const { options, returnObject, onPress } = this.props;
    if (options.length <= 1 || index === null || isNaN(index)) return;
    this.animate(
      I18nManager.isRTL ? -(index / options.length) : index / options.length,
      I18nManager.isRTL
        ? -(selected / options.length)
        : selected / options.length,
    );
    if (callOnPress && onPress) {
      onPress(returnObject ? options[index] : options[index].value);
    } else {
      console.log('Call onPress with value: ', options[index].value);
    }
    this.setState({ selected: index });
  };

  render() {
    const {
      style,
      textStyle,
      selectedTextStyle,
      textContainerStyle,
      selectedTextContainerStyle,
      imageStyle,
      textColor,
      selectedColor,
      fontSize,
      backgroundColor,
      borderColor,
      borderRadius,
      borderWidth,
      hasPadding,
      valuePadding,
      height,
      bold,
      disabled,
      buttonMargin,
      options,
    } = this.props;

    const { selected, sliderWidth } = this.state;

    const optionsMap = options.map((element, index) => {
      const isSelected = selected === index;

      return (
        <TouchableOpacity
          key={index}
          disabled={disabled}
          style={[
            styles.button,
            isSelected ? selectedTextContainerStyle : textContainerStyle,
          ]}
          onPress={() => this.toggleItem(index)}
        >
          {typeof element.customIcon === 'function'
            ? element.customIcon(isSelected)
            : element.customIcon}
          {element.imageIcon && (
            <Image
              source={element.imageIcon}
              style={[
                {
                  height: 30,
                  width: 30,
                  tintColor: isSelected ? selectedColor : textColor,
                },
                imageStyle,
              ]}
            />
          )}
          <Text
            style={[
              {
                fontSize,
                fontWeight: bold ? 'bold' : 'normal',
                textAlign: 'center',
                color: isSelected ? selectedColor : textColor,
                backgroundColor: 'transparent',
              },
              isSelected ? selectedTextStyle : textStyle,
            ]}
          >
            {element.label}
          </Text>
        </TouchableOpacity>
      );
    });

    return (
      <View style={[{ flexDirection: 'row' }, style]}>
        <View {...this.panResponder.panHandlers} style={{ flex: 1 }}>
          <View
            style={{
              borderRadius,
              backgroundColor,
              height: height + buttonMargin * 2,
            }}
            onLayout={(event) => {
              const { width } = event.nativeEvent.layout;
              this.setState({
                sliderWidth: width - (hasPadding ? 2 : 0),
              });
            }}
          >
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                borderColor,
                borderRadius,
                borderWidth: hasPadding ? borderWidth : 0,
                alignItems: 'center',
              }}
            >
              {!!sliderWidth && (
                <Animated.View
                  style={[
                    {
                      height: hasPadding
                        ? height - valuePadding * 2 - borderWidth * 2
                        : height,
                      backgroundColor: this.getBgColor(),
                      width:
                        sliderWidth / options.length
                        - ((hasPadding ? valuePadding : 0) + buttonMargin * 2),
                      transform: [
                        {
                          translateX: this.animatedValue.interpolate({
                            inputRange: [0, 1],
                            outputRange: [
                              hasPadding ? valuePadding : 0,
                              sliderWidth
                                - (hasPadding ? valuePadding : 0),
                            ],
                          }),
                        },
                      ],
                      borderRadius,
                      margin: buttonMargin,
                    },
                    styles.animated,
                  ]}
                />
              )}
              {optionsMap}
            </View>
          </View>
        </View>
      </View>
    );
  }
}

SwitchSelector.defaultProps = {
  style: {},
  textStyle: {},
  selectedTextStyle: {},
  textContainerStyle: {},
  selectedTextContainerStyle: {},
  imageStyle: {},
  options: [],
  textColor: '#000000',
  selectedColor: '#FFFFFF',
  fontSize: 14,
  backgroundColor: '#FFFFFF',
  borderColor: '#C9C9C9',
  borderRadius: 50,
  borderWidth: 1,
  hasPadding: false,
  valuePadding: 1,
  height: 40,
  bold: false,
  buttonMargin: 0,
  buttonColor: '#BCD635',
  returnObject: false,
  animationDuration: 100,
  disabled: false,
  disableValueChangeOnPress: false,
  initial: -1,
  value: 1,
  onPress: null,
};

SwitchSelector.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  textStyle: PropTypes.object,
  selectedTextStyle: PropTypes.object,
  textContainerStyle: PropTypes.object,
  selectedTextContainerStyle: PropTypes.object,
  imageStyle: PropTypes.object,
  options: PropTypes.array,
  textColor: PropTypes.string,
  selectedColor: PropTypes.string,
  fontSize: PropTypes.number,
  backgroundColor: PropTypes.string,
  borderColor: PropTypes.string,
  borderRadius: PropTypes.number,
  borderWidth: PropTypes.number,
  hasPadding: PropTypes.bool,
  valuePadding: PropTypes.number,
  height: PropTypes.number,
  bold: PropTypes.bool,
  buttonMargin: PropTypes.number,
  buttonColor: PropTypes.string,
  returnObject: PropTypes.bool,
  animationDuration: PropTypes.number,
  disabled: PropTypes.bool,
  disableValueChangeOnPress: PropTypes.bool,
  initial: PropTypes.number,
  value: PropTypes.number,
  onPress: PropTypes.func,
};
