## Selectors

```css
* {}

#id { /* 100 */ }

.className { /* 10 */ }

div { /* 1 */ }

[type="text"] { /* точное совпадение */ }
[type*="text"] { /* содержит */ }
[type^="text"] { /* начинается с */ }
[type$="text"] { /* заканчивается на */ }

div p { /* потомок */ }

div > p { /* прямой потомок */ }

div + p { /* следующий сразу за первым */ }

div ~ p { /* все следующие за первым */ }

div:hover {}
div:active {}
div:focus {}
div:visited {}
div:first-child {}
div:last-child {}
div:nth-child {}
div:nth-of-type {}
div:not(selector) {}
div:checked {}
div:disabled {}
div:required {}

div::before {}
div::after {}
div::first-line {}
div::first-letter {}

```


