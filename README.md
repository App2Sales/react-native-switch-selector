# SwitchSelector

Switch Selector to React Native.

[![npm version](https://badge.fury.io/js/react-native-switch-selector.svg)](https://badge.fury.io/js/react-native-switch-selector)
[![downloads](https://img.shields.io/npm/dm/react-native-switch-selector.svg)](https://www.npmjs.com/package/react-native-switch-selector)

### SwitchSelector

![SwitchSelector](./assets/ex1.gif)


### SwitchSelector - Custom Example

![SwitchSelector](./assets/ex2.gif)

### Installing

```Shell
yarn add react-native-switch-selector
```

or

```Shell
npm i react-native-switch-selector --save
```

### Usage

```js
import SwitchSelector from 'react-native-switch-selector';
```

```js
const options = [
    { label: '01:00', value: '1' },
    { label: '01:30', value: '1.5' },
    { label: '02:00', value: '2' }
];
```

```js
<SwitchSelector options={options} initial={0} onPress={value => console.log(`Call onPress with value: ${value}`)} />
```

### Props

|   Prop   |      Type     |  Default |     Required     | Note |
|----------|---------------|--------- |--------------|---|
| options |  array |   null  |      true    |  Items array to render. Each item has a label and a value and optionals icons |
| options[].label |  string |   null  |      true    |  Label from each item |
| options[].value |  string |   null  |      true    |  Value from each item |
| options[].customIcon |  Jsx element ou Function |   null  |      false    |  Optional custom icon from each item |
| options[].imageIcon |  string |   null  |      false    |  Source from a image icon form each item. Has the same color then label in render |
| options[].activeColor |  string |   null  |      false    |  Color from each item when is selected |
| initial |    number   |   0    |       true       | Item selected in initial render |
| onPress |    function   |   console.log    |       true       | Callback function called after change value. |
| fontSize | number |    null    |        false      | Font size from labels. If null default fontSize of the app is used. |
| selectedColor | string |    '#fff'    |        false      | Color text of the item selected |
| buttonColor | string |    '#BCD635'    |        false      | Color bg of the item selected |
| textColor | string |    '#000'    |        false      | Color text of the not selecteds items |
| backgroundColor | string |    '#ffffff'    |        false      | Color bg of the component |
| borderColor | string |    '#c9c9c9'    |        false      | Border Color of the component |
| hasPadding | bool |    false    |        false      | Indicate if item has padding |
| animationDuration | number | 250 | false | Duration of the animation |

### Authors

 - Lucas Santana Carneiro - [jkdrangel](https://github.com/jkdrangel)
 - Cássio Silva de Sá Santos - [ssscassio](https://github.com/ssscassio)
 - [Contributors](https://github.com/App2Sales/react-native-switch-selector/graphs/contributors)

### Contribute
Contributions are always welcome! Create a new Pull Request
