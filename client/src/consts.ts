export const SERVER_URL = 'http://localhost:3000'

export const MKM_EXAMPLES: { ex: string, code: string }[] = [
  {
    ex: 'title',
    code: '# Title (Section) \n## Subtitle\n### Third title\n\n# Title (Another section)\n\n<!--Max (#) is 6-->'
  },
  {
    ex: 'links',
    code: '# Links\n - [Website](https://markmap.js.org/) \n - [coc-markmap](https://github.com/gera2ld/coc-markmap) for Neovim'
  },
  {
    ex: 'lists',
    code: '# List\n## Unordered List\n- Element 1\n- Element 2\n- Element 3\n## Ordered List\n1. Element 1\n2. Element 2\n3. Element 3\n## Checkbox\n- [ ] Element 1 (No checked)\n- [x] Element 2 (Checked)'
  },
  {
    ex: 'type',
    code: '# Typography variations\n- **Strong**\n- ~~Deleted~~\n- *Italic*\n- ==Highlight==\n- ***Strong Italic***'
  },
  {
    ex: 'code',
    code: '# Inline code\n```js\nconsole.log("Hello JavaScript")\n```'
  },
  {
    ex: 'katex',
    code: '# Mathematical formulas\n- $$ ax²+bx+c=0 $$\n- [More about Katex format](https://katex.org/docs/supported.html)'
  },
  {
    ex: 'table',
    code: '# Tables\n| Products | Price |\n| - | - |\n| Apple | 4 |\n| Banana | 2 |'
  },
  {
    ex: 'img',
    code: '# Images\n![Text if the image not found](https://markmap.js.org/favicon.png)'
  },
  {
    ex: 'config',
    code: '---\ntitle: Title <!-- Change markmap title --> \nmarkmap:\n  colorFreezeLevel: 2\n  maxWidth: 450\n---\n<!--Privacy: Privacy type-->\n<!-- Change the privacy: Public or Private -->'
  }
]