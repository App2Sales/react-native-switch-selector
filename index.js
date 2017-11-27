import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    Dimensions,
    TouchableOpacity,
    Easing,
    Image
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default class SwitchSelector extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selected: this.props.initial,
        }
        this.animatedValue = new Animated.Value(this.props.initial / this.props.options.length)
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

    SwitchSelector = (index) => {
        if (this.props.options.length <= 1) return;
        this.animate(index / this.props.options.length, this.state.selected / this.props.options.length);
        this.props.onPress(this.props.options[index].value);
        this.setState({ selected: index });
    }

    render() {
        const {
            textColor,
            selectedColor,
            fontSize,
            buttonColor,
            backgroundColor,
            borderColor,
            hasPadding
        } = this.props;

        const left = this.animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [(hasPadding ? 3 : 0), this.state.sliderWidth - (hasPadding ? 3 : 0)]
        });
        const options = this.props.options.map((element, index) =>
            <View key={index} style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}>
                <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }} hitSlop={{ left: 10, right: 10 }} onPress={() => this.SwitchSelector(index)}>
                    {element.customIcon}
                    {element.imageIcon && <Image source={element.imageIcon} style={{ height: 30, width: 30, tintColor: this.state.selected == index ? selectedColor || '#fff' : textColor || '#000' }} />}
                    <Text style={{ fontSize, textAlign: 'center', color: this.state.selected == index ? selectedColor || '#fff' : textColor || '#000', backgroundColor: 'transparent' }}>{element.label}</Text>
                </TouchableOpacity>
            </View>
        )

        return (
            <View style={{ flexDirection: 'row' }}>
                <View style={{ flex: 1 }}>
                    <View style={{ borderRadius: 50, backgroundColor: backgroundColor || '#ffffff', height: 40 }}
                        onLayout={(event) => {
                            var { x, y, width, height } = event.nativeEvent.layout;
                            this.setState({ sliderWidth: (width - (hasPadding ? 3 : 0)) });
                        }}>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', borderColor: borderColor || '#c9c9c9', borderRadius: 60, borderWidth: 1 }}>
                            <Animated.View ref="switcher" style={{
                                borderRadius: 50,
                                borderWidth: 0,
                                height: (hasPadding ? 34 : 40),
                                backgroundColor: buttonColor || '#BCD635', width: (this.state.sliderWidth / this.props.options.length) - (hasPadding ? 2 : 0),
                                position: 'absolute',
                                left: left,
                                marginTop: (hasPadding ? 2 : 0)
                            }} />
                            {options}
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2c3e50',
    },
});
