import React, { Component } from "react";
import {
  Animated,
  Easing,
  I18nManager,
  Image,
  PanResponder,
  Text,
  TouchableOpacity,
  View
} from "react-native";

const styles = {
  button: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  animated: {
    borderWidth: 0,
    position: "absolute"
  }
};

export default class SwitchSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: this.props.initial
    };

    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: this.shouldSetResponder,
      onMoveShouldSetPanResponder: this.shouldSetResponder,
      onPanResponderRelease: this.responderEnd,
      onPanResponderTerminate: this.responderEnd
    });

    this.animatedValue = new Animated.Value(
      this.props.initial
        ? I18nManager.isRTL
          ? -(this.props.initial / this.props.options.length)
          : this.props.initial / this.props.options.length
        : 0
    );
  }

  componentDidUpdate(prevProps) {
    if (prevProps.value !== this.props.value) {
      this.toggleItem(this.props.value, !this.props.disableValueChangeOnPress);
    }
  }

  shouldSetResponder = (evt, gestureState) => {
    return (
      evt.nativeEvent.touches.length === 1 &&
      !(Math.abs(gestureState.dx) < 5 && Math.abs(gestureState.dy) < 5)
    );
  };

  responderEnd = (evt, gestureState) => {
    if (this.props.disabled) return;
    const swipeDirection = this._getSwipeDirection(gestureState);
    if (
      swipeDirection === "RIGHT" &&
      this.state.selected < this.props.options.length - 1
    ) {
      this.toggleItem(this.state.selected + 1);
    } else if (swipeDirection === "LEFT" && this.state.selected > 0) {
      this.toggleItem(this.state.selected - 1);
    }
  };

  _getSwipeDirection(gestureState) {
    const { dx, dy, vx } = gestureState;
    // 0.1 velocity
    if (Math.abs(vx) > 0.1 && Math.abs(dy) < 80) {
      return dx > 0 ? "RIGHT" : "LEFT";
    }
    return null;
  }

  getBgColor() {
    const { selected } = this.state;
    const { options, buttonColor } = this.props;
    if (selected === -1) {
      return "transparent";
    }
    return options[selected].activeColor || buttonColor;
  }

  animate = (value, last) => {
    this.animatedValue.setValue(last);
    Animated.timing(this.animatedValue, {
      toValue: value,
      duration: this.props.animationDuration,
      easing: Easing.cubic,
      useNativeDriver: true
    }).start();
  };

  toggleItem = (index, callOnPress = true) => {
    const { options, returnObject, onPress } = this.props;
    if (options.length <= 1 || index === null || isNaN(index)) return;
    this.animate(
      I18nManager.isRTL ? -(index / options.length) : index / options.length,
      I18nManager.isRTL
        ? -(this.state.selected / options.length)
        : this.state.selected / options.length
    );
    if (callOnPress && onPress) {
      onPress(returnObject ? options[index] : options[index].value);
    } else {
      console.log("Call onPress with value: ", options[index].value);
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
      hasPadding,
      valuePadding,
      height,
      bold,
      disabled,
      buttonMargin
    } = this.props;

    const options = this.props.options.map((element, index) => {
      const is_selected = this.state.selected == index;

      return (
        <TouchableOpacity
          key={index}
          disabled={disabled}
          style={[styles.button, is_selected ? selectedTextContainerStyle : textContainerStyle]}
          onPress={() => this.toggleItem(index)}
        >
          {typeof element.customIcon === "function"
            ? element.customIcon(is_selected)
            : element.customIcon}
          {element.imageIcon && (
            <Image
              source={element.imageIcon}
              style={[
                {
                  height: 30,
                  width: 30,
                  tintColor:
                    is_selected ? selectedColor : textColor
                },
                imageStyle
              ]}
            />
          )}
          <Text
            style={[
              {
                fontSize,
                fontWeight: bold ? "bold" : "normal",
                textAlign: "center",
                color: is_selected ? selectedColor : textColor,
                backgroundColor: "transparent"
              },
              is_selected ? selectedTextStyle : textStyle
            ]}
          >
            {element.label}
          </Text>
        </TouchableOpacity>
      )
    });

    return (
      <View style={[{ flexDirection: "row" }, style]}>
        <View {...this._panResponder.panHandlers} style={{ flex: 1 }}>
          <View
            style={{
              borderRadius: borderRadius,
              backgroundColor: backgroundColor,
              height: height + (buttonMargin * 2)
            }}
            onLayout={event => {
              const { width } = event.nativeEvent.layout;
              this.setState({
                sliderWidth: width - (hasPadding ? 2 : 0)
              });
            }}
          >
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                borderColor: borderColor,
                borderRadius: borderRadius,
                borderWidth: hasPadding ? 1 : 0
              }}
            >
              {!!this.state.sliderWidth && (
                <Animated.View
                  style={[
                    {
                      height: hasPadding ? height - (valuePadding * 2) : height,
                      backgroundColor: this.getBgColor(),
                      width:
                        this.state.sliderWidth / this.props.options.length -
                        ((hasPadding ? valuePadding : 0) + (buttonMargin * 2)),
                      transform: [
                        {
                          translateX: this.animatedValue.interpolate({
                            inputRange: [0, 1],
                            outputRange: [
                              hasPadding ? valuePadding : 0,
                              this.state.sliderWidth -
                              (hasPadding ? valuePadding : 0)
                            ]
                          })
                        }
                      ],
                      borderRadius: borderRadius,
                      margin: buttonMargin
                    },
                    styles.animated
                  ]}
                />
              )}
              {options}
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
  textColor: "#000000",
  selectedColor: "#FFFFFF",
  fontSize: 14,
  backgroundColor: "#FFFFFF",
  borderColor: "#C9C9C9",
  borderRadius: 50,
  hasPadding: false,
  valuePadding: 1,
  height: 40,
  bold: false,
  buttonMargin: 0,
  buttonColor: "#BCD635",
  returnObject: false,
  animationDuration: 100,
  disabled: false,
  disableValueChangeOnPress: false,
  initial: -1
};
