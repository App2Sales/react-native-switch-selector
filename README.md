# SwitchSelector

Switch Selector to React Native. 

### SwitchSelector 

![SwitchSelector](/assets/ex1.gif)

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
import SwitchSelector from 'react-native-switch-selector'
```

```js
const options = [
    { label: '01:00', value: '1' },
    { label: '01:30', value: '1.5' },
    { label: '02:00', value: '2' }
];
```

```js
<SwitchSelector options={options} initial={0}>
```

### Props

|   Prop   |      Type     |  Default |     Required     | Note |
|----------|---------------|--------- |--------------|---|
| options |  array |   null  |      true    |  Items array to render. Each item has a label and a value |
| initial |    number   |   null    |       true       | Item selected in initial render |
| fontSize | number |    null    |        false      | Font size from labels. If null default fontSize of the app is used. |
| selectedColor | string |    '#fff'    |        false      | Color text of the item selected |
| buttonColor | string |    '#BCD635'    |        false      | Color bg of the item selected |
| textColor | string |    '#000'    |        false      | Color text of the not selecteds items |
| backgroundColor | string |    '#ffffff'    |        false      | Color bg of the component |
| borderColor | string |    '#c9c9c9'    |        false      | Border Color of the component |
