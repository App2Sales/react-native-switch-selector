declare module "react-native-switch-selector" {
  import { Component } from "react";
  import { ImageStyle, TextStyle, ViewStyle } from "react-native";

  export interface ISwitchSelectorOption {
    label: string;
    value: string | number;
    customIcon?: JSX.Element;
    imageIcon?: string;
    activeColor?: string;
  }

  export interface ISwitchSelectorProps {
    options: ISwitchSelectorOption[];
    initial: number;
    onPress(value: string | number | ISwitchSelectorOption): void;
    fontSize?: number;
    selectedColor?: string;
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
    textStyle?: TextStyle;
    selectedTextStyle?: TextStyle;
    imageStyle?: ImageStyle;
    style?: ViewStyle;
    returnObject?: boolean;
    disabled?: boolean;
  }

  class SwitchSelector extends Component<ISwitchSelectorProps> {}

  export default SwitchSelector;
}
