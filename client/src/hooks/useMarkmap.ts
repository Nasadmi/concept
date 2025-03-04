import { Markmap } from "markmap-view";
import { transformer } from "../service/markmap.service";
import "markmap-toolbar/dist/style.css";
import { Toolbar } from "markmap-toolbar";
import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from "react";
import debounce from "just-debounce-it";

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
    mm.setData(root);
    mm.fit();
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

export function useMultipleMarkmap() {
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
    mm.setData(root);
    mm.fit();
  }, [value]);

  return {
    refToolbar,
    refSvg,
    refMm,
    markmap,
    value,
    setValue
  };
}