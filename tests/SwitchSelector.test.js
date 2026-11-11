import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { Animated, I18nManager, PanResponder, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import SwitchSelector from 'react-native-switch-selector';

const options = [
  { label: 'First', value: 'first', testID: 'first-option', accessibilityLabel: 'First option' },
  { label: 'Second', value: 'second', testID: 'second-option', accessibilityLabel: 'Second option' },
  { label: 'Third', value: 3, testID: 'third-option' },
];

function textColor(label) {
  return StyleSheet.flatten(screen.getByText(label).props.style).color;
}

beforeEach(() => {
  jest.spyOn(Animated, 'timing').mockReturnValue({ start: jest.fn() });
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('SwitchSelector', () => {
  it('renders the initial selection and forwards accessibility and test labels', () => {
    render(
      <SwitchSelector
        options={options}
        initial={0}
        textColor="black"
        selectedColor="white"
        testID="selector"
        accessibilityLabel="Choose an option"
      />,
    );

    expect(screen.getByTestId('selector')).toBeTruthy();
    expect(screen.getByLabelText('Choose an option')).toBeTruthy();
    expect(screen.getByLabelText('First option')).toBeTruthy();
    expect(textColor('First')).toBe('white');
    expect(textColor('Second')).toBe('black');
  });

  it('selects an option, reports its value, and animates with the native driver', () => {
    const onPress = jest.fn();
    render(<SwitchSelector options={options} initial={0} onPress={onPress} />);

    fireEvent.press(screen.getByTestId('second-option'));

    expect(onPress).toHaveBeenCalledWith('second');
    expect(textColor('Second')).toBe('#FFFFFF');
    expect(Animated.timing).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ toValue: 1 / 3, duration: 100, useNativeDriver: true }),
    );
  });

  it('returns the complete option when returnObject is enabled', () => {
    const onPress = jest.fn();
    render(<SwitchSelector options={options} initial={0} onPress={onPress} returnObject />);

    fireEvent.press(screen.getByTestId('third-option'));

    expect(onPress).toHaveBeenCalledWith(options[2]);
  });

  it('responds to subsequent value changes without treating value as the initial selection', () => {
    const onPress = jest.fn();
    const { rerender } = render(
      <SwitchSelector options={options} initial={0} value={1} onPress={onPress} />,
    );

    expect(textColor('First')).toBe('#FFFFFF');
    expect(onPress).not.toHaveBeenCalled();

    rerender(<SwitchSelector options={options} initial={0} value={2} onPress={onPress} />);

    expect(onPress).toHaveBeenCalledWith(3);
    expect(textColor('Third')).toBe('#FFFFFF');
  });

  it('can suppress callbacks for value changes without suppressing presses', () => {
    const onPress = jest.fn();
    jest.spyOn(console, 'log').mockImplementation(() => {});
    const { rerender } = render(
      <SwitchSelector options={options} initial={0} value={0} onPress={onPress} disableValueChangeOnPress />,
    );

    rerender(
      <SwitchSelector options={options} initial={0} value={1} onPress={onPress} disableValueChangeOnPress />,
    );
    expect(onPress).not.toHaveBeenCalled();
    expect(textColor('Second')).toBe('#FFFFFF');

    fireEvent.press(screen.getByTestId('third-option'));
    expect(onPress).toHaveBeenCalledWith(3);
  });

  it('disables presses and swipes', () => {
    const onPress = jest.fn();
    const panResponder = jest.spyOn(PanResponder, 'create');
    render(<SwitchSelector options={options} initial={0} onPress={onPress} disabled />);

    const secondOption = screen.UNSAFE_getAllByType(TouchableOpacity)
      .find((option) => option.props.testID === 'second-option');
    expect(secondOption.props.disabled).toBe(true);
    act(() => {
      panResponder.mock.calls[0][0].onPanResponderRelease(null, { dx: 50, dy: 0, vx: 1 });
    });

    expect(onPress).not.toHaveBeenCalled();
    expect(textColor('First')).toBe('#FFFFFF');
  });

  it('forwards the default and custom activeOpacity to every option', () => {
    const onPress = jest.fn();
    const { rerender } = render(<SwitchSelector options={options} initial={0} onPress={onPress} />);
    const buttons = () => screen.UNSAFE_getAllByType(TouchableOpacity);

    expect(buttons()).toHaveLength(options.length);
    buttons().forEach((button) => expect(button.props.activeOpacity).toBe(0.2));

    rerender(<SwitchSelector options={options} initial={0} onPress={onPress} activeOpacity={0} />);
    buttons().forEach((button) => expect(button.props.activeOpacity).toBe(0));
    fireEvent.press(screen.getByTestId('second-option'));
    expect(onPress).toHaveBeenCalledWith('second');

    rerender(<SwitchSelector options={options} initial={0} onPress={onPress} activeOpacity={0.7} disabled />);
    buttons().forEach((button) => {
      expect(button.props.activeOpacity).toBe(0.7);
      expect(button.props.disabled).toBe(true);
    });
  });

  it('changes selection for a horizontal swipe and ignores slow swipes', () => {
    const onPress = jest.fn();
    const panResponder = jest.spyOn(PanResponder, 'create');
    render(<SwitchSelector options={options} initial={0} onPress={onPress} />);
    const { onPanResponderRelease } = panResponder.mock.calls[0][0];

    act(() => onPanResponderRelease(null, { dx: 50, dy: 0, vx: 0.05 }));
    expect(onPress).not.toHaveBeenCalled();

    act(() => onPanResponderRelease(null, { dx: 50, dy: 0, vx: 0.5 }));
    expect(onPress).toHaveBeenCalledWith('second');
    expect(textColor('Second')).toBe('#FFFFFF');
  });

  it('passes selection state to custom icon functions', () => {
    const customIcon = jest.fn((selected) => <Text>{selected ? 'Selected icon' : 'Icon'}</Text>);
    const withIcon = [{ ...options[0], customIcon }, options[1]];
    const onPress = jest.fn();
    render(<SwitchSelector options={withIcon} initial={0} onPress={onPress} />);

    expect(customIcon).toHaveBeenCalledWith(true);
    expect(screen.getByText('Selected icon')).toBeTruthy();

    fireEvent.press(screen.getByTestId('second-option'));
    expect(customIcon).toHaveBeenCalledWith(false);
    expect(screen.getByText('Icon')).toBeTruthy();
  });

  it('applies the actual option container styles and ignores the legacy textCStyle prop', () => {
    render(
      <SwitchSelector
        options={options}
        initial={0}
        textContainerStyle={{ opacity: 0.5 }}
        selectedTextContainerStyle={{ opacity: 1 }}
        textCStyle={{ margin: 999 }}
      />,
    );
    const buttons = screen.UNSAFE_getAllByType(TouchableOpacity);
    const first = StyleSheet.flatten(buttons.find((option) => option.props.testID === 'first-option').props.style);
    const second = StyleSheet.flatten(buttons.find((option) => option.props.testID === 'second-option').props.style);

    expect(first.opacity).toBe(1);
    expect(second.opacity).toBe(0.5);
    expect(first.margin).not.toBe(999);
    expect(second.margin).not.toBe(999);
  });

  it('renders an indicator after layout', () => {
    render(<SwitchSelector options={options} initial={0} />);
    const layoutView = screen.UNSAFE_getAllByType(View).find((view) => view.props.onLayout);

    fireEvent(layoutView, 'layout', { nativeEvent: { layout: { width: 300 } } });

    const indicator = screen.UNSAFE_getAllByType(Animated.View)
      .find((view) => StyleSheet.flatten(view.props.style).width === 100);
    expect(indicator).toBeTruthy();
  });

  it('applies buttonStyle arrays to the animated indicator without affecting selection', () => {
    const onPress = jest.fn();
    const customStyles = StyleSheet.create({ shadow: { shadowOpacity: 0.5 } });
    render(
      <SwitchSelector
        options={options}
        initial={0}
        onPress={onPress}
        buttonStyle={[customStyles.shadow, { elevation: 4 }]}
      />,
    );
    const layoutView = screen.UNSAFE_getAllByType(View).find((view) => view.props.onLayout);
    fireEvent(layoutView, 'layout', { nativeEvent: { layout: { width: 300 } } });

    const indicator = screen.UNSAFE_getAllByType(Animated.View)
      .find((view) => StyleSheet.flatten(view.props.style).width === 100);
    expect(StyleSheet.flatten(indicator.props.style)).toEqual(expect.objectContaining({
      shadowOpacity: 0.5,
      elevation: 4,
      position: 'absolute',
    }));

    fireEvent.press(screen.getByTestId('second-option'));
    expect(onPress).toHaveBeenCalledWith('second');
    expect(Animated.timing).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ toValue: 1 / 3, useNativeDriver: true }),
    );
  });

  it('reverses animation positions in RTL', () => {
    const previousRTL = I18nManager.isRTL;
    I18nManager.isRTL = true;
    try {
      render(<SwitchSelector options={options} initial={0} onPress={jest.fn()} />);
      fireEvent.press(screen.getByTestId('second-option'));
      expect(Animated.timing).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ toValue: -1 / 3 }),
      );
    } finally {
      I18nManager.isRTL = previousRTL;
    }
  });
});
