# Mars Weather App - HTML & CSS

[Live Demo](https://mars-weahter-app-toypiano.netlify.app/)

## Developing an App: User-oriented & cost-efficient workflow

1. Find useful (free) API (eg. weather, market info, stats, map,...)
2. How can that data make the user's life easier in doing...

- It should help the process that the users already have been doing.  
  You can't create "new thing" and make them to "learn" how to use it. (It is very inefficient in marketing perspective.)
- Or it can help the user achieve the same goal in more efficient way OR with better experience.

3. Create design concepts | sketch | mockups to better-achieve #2.
4. Code up the design to better-achieve #2.
5. Code up the functionality to better-achieve #2.

## Memo

- HTML markup should be done in a way that it can be (though not as easily) understood and digested without any CSS.

## Refs

- [Inclusively Hidden](https://www.scottohara.me/blog/2017/04/14/inclusively-hidden.html) by Scott Ohara

  ```scss
  .sr-only:not(:focus):not(:active) {
    overflow: hidden; // remove scroll, remove overflown
    white-space: nowrap; // prevent wrapping (might create height)

    // clip only applies to abs-positioned elements (abs|fixed)
    position: absolute; // for clip to work
    clip: rect(0 0 0 0); // clips instead of removing by hidden
    clip-path: inset(50%); // works same as above, but more browser support

    // clip fallback
    height: 1px; // almost-remove (but don't)
    width: 1px;
  }
  ```

## Sass Comments: `//` or `/* */`

The comments made with `//` inside `.sass. file will not transpile into css file, so if you want the comment to persist into css file, use original syntax (`/\* \*/`).

## Grid `minmax()` vs `fit-content()`

- `minmax(min, max)` is more likely to occupy the max space given because the grid's default behavior is to stretch out. It doesn't really care about the width of grid-item's content.
- `fit-content(max)` only takes as much space as grid-item's content width, including its padding & margin. If the content is wider than the specified max value, it will wrap to respect the grid line.

```css
.container {
  margin: 1em auto;
  display: grid;
  gap: 1em;
  grid-template-columns: minmax(100px, 200px) fit-content(200px) minmax(100px, 200px);
}
```

The grid-item in the middle will be as wide as its content until it reaches 200px while other two `minmax` item will always be 200px wide (if the screen size allows them).

## Grid min-content | max-content

- `min-content` takes the minimum space its content can squeezed into. In grid-column, this is usually a longest word in the text.
- `max-content` takes the maximum space its content can stretch out. In grid-column, this is usually the whole text in one line. **This can cause overflow-X.**

## Grid `fr` vs `auto`

- The size of `auto` is computed by grid considering the width of the container and the width of the content.
- `fr` takes any "remaining space" and distributes them across "fr-ed" grid item.
- So if you use `auto` and `fr` together, `auto` item will stretch as if there are no `fr` items, then `fr` items will take whatever space is left.

```css
.container.fr-auto-fr {
  grid-template-columns: 1fr auto 1fr;
}
```

In the example above, `1fr` would be the same as `min-content` until all the content in the middle item can fit in one single line.

## CSS <s>clip</s> -> clip-path

- `clip` only works in abs-positioned elements, and is being deprecated.

  ```css
  .box {
    background: url(image-path) no-repeat center;
    background-size: cover;
    width: 400px;
    height: 400px;
    position: absolute;
    /* clips 100px from all top, right, bottom, left side */
    clip: rect(100px 300px 300px 100px);
  }
  ```

  - To use % unit, clipped element must be nested inside width-defined element.

- `clip-path` has more shapes & doesn't require abs-positioning.
  ```css
  .box {
    background: url(image-path) no-repeat center;
    background-size: cover;
    width: 400px;
    height: 400px;
    /* works same as above */
    clip: inset(25%);
  }
  ```

## Quartz Clock with CSS

Using css variable, you can update clock needle very easily.

```scss
&__direction {
  /* If you want circle | square this makes it easier to adjust the value in one place. */
  --size: 6rem; // circle diameter
  width: var(--size);
  height: var(--size);
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.5);
  display: grid;
  // when centering with grid:
  place-items: center; // this will put arrow 1.5rem from the top
}

&__arrow {
  /* update custom props with js to update the direction */
  --direction: 0deg;
  --size: 1rem;
  // height: 3rem;
  height: calc(
    var(--size) * 3
  ); // You can't use scss variable inside css functions (calc)
  width: var(--size);
  background: var(--cl-accent-dark);
  // first point, second point, third point, ...
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  transform: translateY(-50%) // 50% of 3rem = 1.5rem to the top
    rotate(var(--direction));
  transform-origin: bottom center;
}
```

## Pill-shaped Border

`border-radius: 50%` will give oval-shape and that is most-likely not what you want.

```scss
  &__toggle {
    cursor: pointer;
    width: 4em;
    border: 2px solid var(--cl-gray);
    background: transparent;
    padding: 0;
    margin: 0 1em;
    border-radius: 100vmax; // can be replace by any arbitrary large unit(999999px)
    // circular toggle-switch
    &::after {
      content: "";
      display: block;
      background: var(--cl-gray);
      height: 1rem;
      width: 1rem;
      border-radius: 50%;
      margin: 3px;
    }
  }
}
```

<br><br>

# Mars Weather App - Fetching Data & Updating DOM with JS

## Fetch and transform the data

- Fetch from the API endpoint, specifying your API key in the URL string.
- Parse response as JSON into JS Object
- That object contains data entries in key:value format.
  - Transform it intro an array with data entries Object containing properties inside each data entry value.
  - The data entry key will also be transformed into one of the property values.

## Prep DOM selectors

```html
<p class="item__price--large">Price: $<span data-current-price></span></p>
```

```js
const currentPriceElement = document.querySelector('[data-current-price]']);
```

## Connect the data to the DOM node

```js
currentPriceElement.innerText = selectedItem.price;
```

- Sometime you need to update CSS variable instead of text node.

```js
windDirectionArrow.style.setProperty(
  '--direction', // name of "CSS custom property"
  selectedSol.windDirectionDegrees + 'deg' // value
);
```

## Format the data to achieve the design goal

1. Make it easier to understand for the users.
2. Maximize 1. Then make it look nice and pleasing to the eye.
3. Implement the most basic formatting like rounding/ flooring first.
4. Introduce complex conversions gradually (temperature, speed, currency, date, etc...)

### `Date.prototype.toLocaleDateString()`

- Pass `undefined` as the first argument to use browser default locale

```js
// UTC y2k DOOM
const date = new Date(Date.UTC(1999, 11, 31, 23, 59, 59));

// request a weekday along with a long date
const options = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};
console.log(date.toLocaleDateString('kor', options));
// → "2000년 1월 1일 토요일" Korea will have its dooms day at 9AM on New Year (morning-calmly).

// an application may want to use UTC and make that visible
options.timeZone = 'UTC';
options.timeZoneName = 'short'; // long will be REALLY long
console.log(date.toLocaleDateString(undefined, options));
// → "Friday, December 31, 1999, UTC"
```

## HTML Template element

You can insert html template for data hydration inside `<template data-ny-template></template>`.
Contents inside template element will not be rendered on page load.  
You can clone the template content and hydrate them with data, then push it into a container div.

```js
function displayPreviousSols(sols) {
  previousSolContainer.innerHTML = ''; // cleanup before populating
  sols.forEach((solData, index) => {
    // clones template content and assign it to solContainer
    const solContainer = previousSolTemplate.content.cloneNode(true); // true: deep clone
    // populate data into cloned element
    solContainer.querySelector('[data-sol]').innerText = solData.sol;
    solContainer.querySelector('[data-date]').innerText = displayDate(
      solData.date
    );
    solContainer.querySelector(
      '[data-temp-high]'
    ).innerText = displayTemperature(solData.maxTemp);
    solContainer.querySelector(
      '[data-temp-low]'
    ).innerText = displayTemperature(solData.minTemp);
    // click handler on 'More Info'
    solContainer
      .querySelector('[data-select-button]')
      .addEventListener('click', () => {
        // update selectedSolIndex with solData index
        selectedSolIndex = index;
        // re-render main
        displaySelectedSol(sols); // selects displaying sol entry with global: selectedSolIndex
      });

    // push populated element into container
    previousSolContainer.appendChild(solContainer);
  });
}
```
