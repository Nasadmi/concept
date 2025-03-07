import { Markmap } from "markmap-view";
import { transformer } from "../service/markmap.service";
import "markmap-toolbar/dist/style.css";
import { Toolbar } from "markmap-toolbar";
import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from "react";
import debounce from "just-debounce-it";
import highlight from 'highlight.js'
import 'highlight.js/styles/tokyo-night-dark.css';

declare global {
  interface Window {
    katex?: typeof import("katex");
  }
}

const renderToolBar = ({
  mm,
  wrapper,
}: {
  mm: Markmap;
  wrapper: HTMLElement;
}) => {
  while (wrapper.firstChild) wrapper.firstChild.remove();
  if (mm && wrapper) {
    const toolbar = new Toolbar();
    toolbar.attach(mm);
    toolbar.setItems([...Toolbar.defaultItems]);
    wrapper.append(toolbar.render());
  }
};

export function useMarkmaps({ setter }: { setter: Dispatch<SetStateAction<string | null>> }) {
  const [value, setValue] = useState('');
  const [saved, setSaved] = useState(true)
  const refSvg = useRef<SVGSVGElement | null>(null);
  const refMm = useRef<Markmap | null>(null);
  const refToolbar = useRef<HTMLDivElement | null>(null);
  const markmap = useRef<Markmap | null>(null);

  useEffect(() => {
    if (refMm.current || !refSvg.current) return;
    const mm = Markmap.create(refSvg.current);
    refMm.current = mm;
    markmap.current = mm;
  }, [refSvg]);

  useEffect(() => {
    const mm = refMm.current;
    if (!mm) return;
    const { root } = transformer.transform(value);
    mm.options.autoFit = true
    import("katex").then((katex) => {
      window.katex = katex;
      mm.setData(root);
    })
    const timeout = setTimeout(() => {
      document.querySelectorAll('.mkm-render pre code').forEach(block => {
        highlight.highlightElement(block as HTMLElement);
      })
    }, 500)
    return () => clearTimeout(timeout)
  }, [refMm.current, value]);

  const handleChange = (val: string) => {
    changeDebounced(val);
  };

  const changeDebounced = useCallback(
    debounce((val: string) => {
      setValue(val);
      setter(val);
    }, 200),
    [handleChange]
  );

  return {
    handleChange,
    refToolbar,
    refSvg,
    refMm,
    renderToolBar,
    markmap,
    value,
    setSaved,
    saved,
    setValue
  };
}

export function usePlaneMarkmap() {
  const [value, setValue] = useState('');

  const refSvg = useRef<SVGSVGElement | null>(null);
  const refMm = useRef<Markmap | null>(null);
  const refToolbar = useRef<HTMLDivElement | null>(null);
  const markmap = useRef<Markmap | null>(null);

  useEffect(() => {
    if (!refSvg.current || refMm.current) return;
    const mm = Markmap.create(refSvg.current);
    refMm.current = mm;
    markmap.current = mm;
  }, []);

  useEffect(() => {
    const mm = refMm.current;
    if (!mm) return;
    const { root } = transformer.transform(value);
    mm.options.autoFit = true;
    const timeout = setTimeout(() => {
      import("katex").then((katex) => {
        window.katex = katex;
        mm.setData(root);
        document.querySelectorAll('.mkm-render pre code').forEach(block => {
          highlight.highlightElement(block as HTMLElement);
        })
      })
    }, 100)
    return () => clearTimeout(timeout)
  }, [value]);

  return {
    refToolbar,
    refSvg,
    refMm,
    markmap,
    value,
    setValue,
  };
}