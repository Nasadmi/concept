import { useState, useEffect, useRef, useCallback } from "react";
import "../styles/EditorHelp.css";
import CodeMirror from "@uiw/react-codemirror";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { tokyoNightStorm } from "@uiw/codemirror-theme-tokyo-night-storm";
import { tokyoNightDay } from "@uiw/codemirror-theme-tokyo-night-day";
import { EditorView } from '@uiw/react-codemirror';
import { usePlaneMarkmap } from "../hooks/useMarkmap";
import { MKM_EXAMPLES } from '../consts';

export const EditorHelp = () => {
  const rootElement = useRef(document.documentElement);
  const [light, setLight] = useState<boolean>(false);
  const [code, setCode] = useState<string>(MKM_EXAMPLES[MKM_EXAMPLES.length-1].code)
  const example = usePlaneMarkmap();

  const changeExample = useCallback((tag: string) => {
    const exCode = MKM_EXAMPLES.find(({ ex }) => ex === tag)?.code
    if (!exCode) return;
    example.setValue(exCode)
    setCode(exCode)
  }, [example])

  useEffect(() => {
    example.setValue(MKM_EXAMPLES[MKM_EXAMPLES.length-1].code)

    window.addEventListener('hashchange', () => {
      const arr = window.location.hash.split('-');
      changeExample(arr[arr.length - 1])
    })

    if (!rootElement.current) return;

    const config = { attributes: true, attributeFilter: ["class"] };

    let light = false;

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class"
        ) {
          const target = mutation.target as HTMLElement;
          light = target.classList.contains("light");
        }
      });

      setLight(light);
    });

    observer.observe(rootElement.current, config);
    return () => {
      observer.disconnect();
      window.removeEventListener('hashchange', () => changeExample(''))
    };
  }, [changeExample, example]);

  return (
    <main className="editor-help">
      <h1 className="title maven_pro">
        How to create a mind map using markdown?
      </h1>
      <section>
        <ol className="links">
          <li>
            <a href="#editor-help-config">Configuration</a>
          </li>
          <li>
            <a href="#editor-help-title">Title</a>
          </li>
          <li>
            <a href="#editor-help-links">Links</a>
          </li>
          <li>
            <a href="#editor-help-lists">Lists</a>
          </li>
          <li>
            <a href="#editor-help-type">Typographic variations</a>
          </li>
          <li>
            <a href="#editor-help-code">Inline code</a>
          </li>
          <li>
            <a href="#editor-help-katex">Mathematical formulas</a>
          </li>
          <li>
            <a href="#editor-help-table">Tables</a>
          </li>
          <li>
            <a href="#editor-help-img">Images</a>
          </li>
        </ol>
        <article className='code'>
          <CodeMirror 
            value={code}
            height='450px'
            width='420px'
            theme={light ? tokyoNightDay : tokyoNightStorm}
            extensions={[markdown({ base: markdownLanguage, codeLanguages: languages }), EditorView.lineWrapping]}
            className='maven_pro'
            readOnly
          />
          <svg ref={example.refSvg} width='100%' height='450px' className='mkm-render'></svg>
        </article>
      </section>
    </main>
  );
};
