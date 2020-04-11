# Turning a design from desktop only to mobile friendly

https://youtu.be/_kF3k0vDMNA

## Workflow

1. Set @media with `min-width` at break-point(900px)
2. copy rules that apply only to desktop inside media query

- Start from the parent(body) and work your way down the tree.
- fixed vertical height, hidden overflow, grid display, big margins, and etc...
- CSS custom properties for font-sizes that are too big for small screen
- separators / borders, grid-item settings (orders, layout, alignments,...)

3. modify or remove original rules that you copied in 2.
4. When you find yourself adding new rules to the original rules, instead of removing that in `min-width` media query, add them into a `max-width` media query nested inside original selector.

- Refer to `.unit` section in `main.scss`

5. Check "in-between" screen size around 600px. If the layout looks too funny, create another `@media (min-width: 600px)` and in there, re-arrange components with grid.

- smaller, tighter

# Memo

- You cannot use Sass variable inside media query, but you can use CSS custom properties.
