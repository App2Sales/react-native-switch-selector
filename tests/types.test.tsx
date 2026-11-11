import * as React from 'react';
import { StyleSheet, Text } from 'react-native';
import SwitchSelector, {
  ISwitchSelectorOption,
  ISwitchSelectorProps,
} from 'react-native-switch-selector';

const styles = StyleSheet.create({
  container: { flex: 1 },
  text: { fontSize: 16 },
  image: { width: 20, height: 20 },
});

const options: ISwitchSelectorOption[] = [
  { label: 'One', value: 1, imageIcon: 123 },
  { label: 'Two', value: 'two', imageIcon: { uri: 'https://example.com/icon.png' } },
  { label: 'Three', value: 3, imageIcon: 'legacy-string-source' },
  { label: 'Four', value: 4, customIcon: <Text>Icon</Text> },
  { label: 'Five', value: 5, customIcon: (selected) => <Text>{selected ? 'Yes' : 'No'}</Text> },
];

const props: ISwitchSelectorProps = {
  options,
  borderWidth: 2,
  textStyle: [styles.text, { color: 'black' }],
  textContainerStyle: [styles.container, { padding: 4 }],
  selectedTextContainerStyle: styles.container,
  textCStyle: styles.text,
  imageStyle: [styles.image, { opacity: 0.5 }],
  style: styles.container,
  onPress: (value) => { void value; },
};

const valid = <SwitchSelector {...props} />;
const optionalCallback = <SwitchSelector options={options} />;
const nullCallback = <SwitchSelector options={options} onPress={null} />;
const legacyCallback = <SwitchSelector options={options} onPress={(value: string) => { void value; }} />;
const legacyContainerStyle = <SwitchSelector options={options} selectedTextContainerStyle={styles.text} />;
// @ts-expect-error value is an option index, not an option value
const invalidValue = <SwitchSelector options={options} value="two" />;
// @ts-expect-error options must contain labels and supported values
const invalidOptions = <SwitchSelector options={[{ label: 'Invalid', value: false }]} />;

void [valid, optionalCallback, nullCallback, legacyCallback, legacyContainerStyle, invalidValue, invalidOptions];
