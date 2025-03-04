import { useState, useEffect, useRef } from 'react';
import "../styles/EditorHelp.css";
import CodeMirror from '@uiw/react-codemirror'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { tokyoNightStorm } from '@uiw/codemirror-theme-tokyo-night-storm';
import { tokyoNightDay } from '@uiw/codemirror-theme-tokyo-night-day';
import { useMultipleMarkmap } from '../hooks/useMarkmap';

export const EditorHelp = () => {
  const rootElement = useRef(document.documentElement)
  const [light, setLight] = useState<boolean>(false)
  const titleExample = useMultipleMarkmap();
  const linkExample = useMultipleMarkmap();

  useEffect(() => {
    titleExample.setValue('# Title (Section) \n## Subtitle\n### Third title\n\n# Title (Another section)\n\n<!--Max (#) is 6-->')
    linkExample.setValue('## Links\n - [Website](https://markmap.js.org/) \n - [coc-markmap](https://github.com/gera2ld/coc-markmap) for Neovim')

    if (!rootElement.current) return;

    const config = { attributes: true, attributeFilter: ['class'] };

    let light = false; 

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          const target = mutation.target as HTMLElement;
          light = target.classList.contains('light');
        }
      });

      setLight(light);
    });

    observer.observe(rootElement.current, config);
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <main className="editor-help">
      <h1 className="title maven_pro">
        How to create a mind map using markdown?
      </h1>
      <ol className="links">
        <li>
          <a href="#editor-help-title">Title</a>
        </li>
        <li>
          <a href="#editor-help-links">Links</a>
        </li>
        <li>
          Lists
          <ul>
            <li>Unordered lists</li>
            <li>Ordered lists</li>
            <li>Checkboxes</li>
          </ul>
        </li>
        <li>
          Typographic variations
          <ul>
            <li>Strong</li>
            <li>Crossed out</li>
            <li>Italic</li>
            <li>Highlight</li>
            <li>Strong italic</li>
          </ul>
        </li>
        <li>Inline code</li>
        <li>Mathematical formulas (Katex)</li>
        <li>Blocks</li>
        <li>Tables</li>
        <li>Images</li>
      </ol>
      <section id="editor-help-title">
        <h1 className='title-sec'>Title</h1>
        <div className='example'>
        <CodeMirror 
              value={titleExample.value}
              height='300px'
              width='350px'
              theme={light ? tokyoNightDay : tokyoNightStorm}
              extensions={[markdown({ base: markdownLanguage, codeLanguages: languages })]}
              className='maven_pro'
              readOnly
            />
          <svg ref={titleExample.refSvg} width='100%'></svg>
        </div>
      </section>
      <section id="editor-help-links">
        <h1 className='title-sec'>Links</h1>
        <div className='example'>
        <CodeMirror 
              value={linkExample.value}
              height='300px'
              width='450px'
              theme={light ? tokyoNightDay : tokyoNightStorm}
              extensions={[markdown({ base: markdownLanguage, codeLanguages: languages })]}
              className='maven_pro'
              readOnly
            />
          <svg ref={linkExample.refSvg} width='100%'></svg>
        </div>
      </section>
    </main>
  );
};
