import React, { Component } from 'react';
import {
    View,
    Text,
    Animated,
    TouchableOpacity,
    Easing,
    Image
} from 'react-native';

const styles = {
    button: { flex: 1, flexDirection: 'column' },
    containerButton: {
        flexDirection: 'row', flex: 1, height: 40, justifyContent: 'center', alignItems: 'center'
    },
    animated: {
        borderRadius: 50,
        borderWidth: 0,
        position: 'absolute'
    }
};

export default class SwitchSelector extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: this.props.initial ? this.props.initial : 0
        };
        this.animatedValue = new Animated
            .Value(this.props.initial ? (this.props.initial / this.props.options.length) : 0);
    }

    getBgColor() {
        const { selected } = this.state;
        const { options, buttonColor } = this.props;
        return options[selected].activeColor || buttonColor;
    }

    animate = (value, last) => {
        this.animatedValue.setValue(last);
        Animated.timing(
            this.animatedValue,
            {
                toValue: value,
                duration: 250,
                easing: Easing.cubic
            }
        ).start();
    }

    toggleItem = (index) => {
        if (this.props.options.length <= 1) return;
        this.animate(
            index / this.props.options.length,
            this.state.selected / this.props.options.length
        );
        if (this.props.onPress) {
            this.props.onPress(this.props.options[index].value);
        } else {
            console.log('Call onPress with value: ', this.props.options[index].value);
        }
        this.setState({ selected: index });
    }

    render() {
        const {
            textColor,
            selectedColor,
            fontSize,
            backgroundColor,
            borderColor,
            hasPadding
        } = this.props;

        const left = this.animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [(hasPadding ? 3 : 0), this.state.sliderWidth - (hasPadding ? 3 : 0)]
        });
        const options = this.props.options.map((element, index) =>
            (
                <TouchableOpacity key={index} style={styles.button} onPress={() => this.toggleItem(index)}>
                    <View style={styles.containerButton}>
                        {element.customIcon}
                        {element.imageIcon && <Image source={element.imageIcon} style={{ height: 30, width: 30, tintColor: this.state.selected == index ? selectedColor : textColor }} />}
                        <Text style={{
                            fontSize, textAlign: 'center', color: this.state.selected == index ? selectedColor : textColor, backgroundColor: 'transparent'
                        }}>{element.label}
                        </Text>
                    </View>
                </TouchableOpacity>
            ));

        return (
            <View
                style={{ borderWidth: hasPadding ? 1 : 0, borderColor: borderColor, flex: 1, flexDirection: 'row', justifyContent: 'center', borderRadius: 50, backgroundColor: backgroundColor, height: 40 }}
                onLayout={(event) => {
                    const { width } = event.nativeEvent.layout;
                    this.setState({ sliderWidth: (width - (hasPadding ? 3 : 0)) });
                }}>
                <Animated.View
                    style={[{
                        height: (hasPadding ? 34 : 40),
                        backgroundColor: this.getBgColor(),
                        width: (this.state.sliderWidth / this.props.options.length) - (hasPadding ? 2 : 0),
                        left,
                        marginTop: (hasPadding ? 2 : 0)
                    }, styles.animated]} />
                {options}
            </View>
        );
    }
}


SwitchSelector.defaultProps = {
    textColor: '#000000',
    selectedColor: '#FFFFFF',
    fontSize: 14,
    backgroundColor: '#FFFFFF',
    borderColor: '#C9C9C9',
    hasPadding: false,
    buttonColor: '#BCD635'
};
