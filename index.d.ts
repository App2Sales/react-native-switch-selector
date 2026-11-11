import { Component, ReactNode } from 'react';
import {
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';

export interface ISwitchSelectorOption {
  label: string;
  value: string | number;
  customIcon?: ReactNode | ((selected: boolean) => ReactNode);
  imageIcon?: ImageSourcePropType | string;
  activeColor?: string;
  accessibilityLabel?: string;
  testID?: string;
}

// Keep the bivariance of the original onPress method declaration for existing consumers.
type OnPressHandler = {
  onPress(value: string | number | ISwitchSelectorOption): void;
}['onPress'];

export interface ISwitchSelectorProps {
  options: ISwitchSelectorOption[];
  initial?: number;
  value?: number;
  onPress?: OnPressHandler | null;
  fontSize?: number;
  selectedColor?: string;
  buttonMargin?: number;
  buttonColor?: string;
  buttonStyle?: StyleProp<ViewStyle>;
  textColor?: string;
  backgroundColor?: string;
  borderColor?: string;
  borderRadius?: number;
  borderWidth?: number;
  hasPadding?: boolean;
  animationDuration?: number;
  valuePadding?: number;
  height?: number;
  bold?: boolean;
  textStyle?: StyleProp<TextStyle>;
  selectedTextStyle?: StyleProp<TextStyle>;
  /** @deprecated This prop is ignored. Use textContainerStyle instead. */
  textCStyle?: StyleProp<TextStyle>;
  textContainerStyle?: StyleProp<ViewStyle>;
  selectedTextContainerStyle?: StyleProp<ViewStyle | TextStyle>;
  imageStyle?: StyleProp<ImageStyle>;
  style?: StyleProp<ViewStyle>;
  returnObject?: boolean;
  activeOpacity?: number;
  disabled?: boolean;
  disableValueChangeOnPress?: boolean;
  accessibilityLabel?: string;
  testID?: string;
}

export default class SwitchSelector extends Component<ISwitchSelectorProps> {}
