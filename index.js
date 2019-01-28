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
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  containerButton: {
    flexDirection: "row",
    flex: 1,
    height: 40,
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
      selected: this.props.initial ? this.props.initial : 0
    };
    this.animatedValue = new Animated.Value(
      this.props.initial
        ? I18nManager.isRTL
          ? -(this.props.initial / this.props.options.length)
          : this.props.initial / this.props.options.length
        : 0
    );
  }

  componentWillMount() {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: this.shouldSetResponder,
      onMoveShouldSetPanResponder: this.shouldSetResponder,
      onPanResponderRelease: this.responderEnd,
      onPanResponderTerminate: this.responderEnd
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
      this.toggleItem(nextProps.value);
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

  toggleItem = index => {
    const { options, returnObject, onPress } = this.props;
    if (options.length <= 1) return;
    this.animate(
      I18nManager.isRTL ? -(index / options.length) : index / options.length,
      I18nManager.isRTL
        ? -(this.state.selected / options.length)
        : this.state.selected / options.length
    );
    if (onPress) {
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
      disabled
    } = this.props;

    const options = this.props.options.map((element, index) => (
      <View
        key={index}
        style={{ flex: 1, flexDirection: "column", justifyContent: "center" }}
      >
        <TouchableOpacity
          disabled={disabled}
          style={styles.button}
          onPress={() => this.toggleItem(index)}
        >
          {typeof element.customIcon === "function"
            ? element.customIcon(this.state.selected == index)
            : element.customIcon}
          {element.imageIcon && (
            <Image
              source={element.imageIcon}
              style={[
                {
                  height: 30,
                  width: 30,
                  tintColor:
                    this.state.selected == index ? selectedColor : textColor
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
                color: this.state.selected == index ? selectedColor : textColor,
                backgroundColor: "transparent"
              },
              this.state.selected == index ? selectedTextStyle : textStyle
            ]}
          >
            {element.label}
          </Text>
        </TouchableOpacity>
      </View>
    ));

    return (
      <View style={[{ flexDirection: "row" }, style]}>
        <View {...this._panResponder.panHandlers} style={{ flex: 1 }}>
          <View
            style={{
              borderRadius: borderRadius,
              backgroundColor: backgroundColor,
              height
            }}
            onLayout={event => {
              const { width } = event.nativeEvent.layout;
              this.setState({
                sliderWidth: width - (hasPadding ? valuePadding : 0)
              });
            }}
          >
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                borderColor: borderColor || "#c9c9c9",
                borderRadius: borderRadius,
                borderWidth: hasPadding ? 1 : 0
              }}
            >
              {!!this.state.sliderWidth && (
                <Animated.View
                  style={[
                    {
                      height: hasPadding ? height - 4 : height,
                      backgroundColor: this.getBgColor(),
                      width:
                        this.state.sliderWidth / this.props.options.length -
                        (hasPadding ? valuePadding : 0),
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
                      marginTop: hasPadding ? valuePadding : 0
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
  buttonColor: "#BCD635",
  returnObject: false,
  animationDuration: 100,
  disabled: false
};
