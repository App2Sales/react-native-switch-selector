declare module "react-native-switch-selector" {
  import { Component } from "react";
  import {
    ImageStyle,
    RegisteredStyle,
    TextStyle,
    ViewStyle
  } from "react-native";

  export interface ISwitchSelectorOption {
    label: string;
    value: string | number;
    customIcon?: JSX.Element;
    imageIcon?: string;
    activeColor?: string;
  }

  export interface ISwitchSelectorProps {
    options: ISwitchSelectorOption[];
    initial?: number;
    value?: number;
    onPress(value: string | number | ISwitchSelectorOption): void;
    fontSize?: number;
    selectedColor?: string;
    buttonMargin?: number;
    buttonColor?: string;
    textColor?: string;
    backgroundColor?: string;
    borderColor?: string;
    borderRadius?: number;
    hasPadding?: boolean;
    animationDuration?: number;
    valuePadding?: number;
    height?: number;
    bold?: boolean;
    textStyle?: TextStyle | RegisteredStyle<TextStyle>;
    selectedTextStyle?: TextStyle | RegisteredStyle<TextStyle>;
    textCStyle?: TextStyle | RegisteredStyle<TextStyle>;
    selectedTextContainerStyle?: TextStyle | RegisteredStyle<TextStyle>;
    imageStyle?: ImageStyle | RegisteredStyle<ImageStyle>;
    style?: ViewStyle | RegisteredStyle<ViewStyle>;
    returnObject?: boolean;
    disabled?: boolean;
    disableValueChangeOnPress?: boolean;
  }

  class SwitchSelector extends Component<ISwitchSelectorProps> {
    toggleItem(index: number, callOnPress?: boolean): void;
  }

  export default SwitchSelector;
}
