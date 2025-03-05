import { useParams, Link } from 'react-router'
import { getCookie } from '../service/cookie.service';
import { useEffect, useState, useRef } from 'react';
import { MkmType } from '../types/markmap.interface';
import { fetchingMarkmap } from '../service/fetch.service';
import CodeMirror from '@uiw/react-codemirror';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { tokyoNightStorm } from '@uiw/codemirror-theme-tokyo-night-storm'
import { tokyoNightDay } from '@uiw/codemirror-theme-tokyo-night-day'
import { languages } from '@codemirror/language-data';
import { useMarkmaps } from '../hooks/useMarkmap';
import '../styles/Editor.css'
import { decodeBase64, encodeBase64 } from '../service/md.service';
import { ThemeSelector } from './Theme';
import { IoSaveSharp, IoSaveOutline, IoHelpOutline } from 'react-icons/io5';
import { HiHome } from 'react-icons/hi';
import { alert, toast } from '../service/alert.service';

export const Editor = () => {
  const stored = sessionStorage.getItem('editMkm')
  const params = useParams();
  const bearer = getCookie('bearer');
  const [mkm, setMkm] = useState<Pick<MkmType, 'name' | 'code'> & { pub: string } | null>(JSON.parse(!stored ? '' : stored))
  const [code, setCode] = useState<string | null>(null);
  const [config, setConfig] = useState<string | null>(null);
  const { handleChange, refSvg, refToolbar, renderToolBar, markmap, setSaved, saved, value } = useMarkmaps({ setter: setCode });
  const [light, setLight] = useState<boolean>(false)
  const rootElement = useRef(document.documentElement)
  
  if (!params.id || !bearer) {
    window.location.replace('/');
  }

  useEffect(() => {
    if (mkm) {
      const decoded = decodeBase64(mkm.code || '')
      handleChange(decoded);
      setCode(decoded)
      setConfig(`---\ntitle: ${mkm.name} \nmarkmap:\n  colorFreezeLevel: 2\n  maxWidth: 450\n---\n<!--Privacy: ${Number(mkm.pub) === 0 ? 'Private' : 'Public'}-->\n\n`)
      return;
    }
  }, [bearer, params, mkm])

  if (markmap.current && refToolbar.current) {
    renderToolBar({
      mm: markmap.current,
      wrapper: refToolbar.current,
    })
    document.querySelector("#root > main > div.mkm-toolbar > div > a")?.setAttribute('target', '_blank')
  }

  useEffect(() => {
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

  useEffect(() => {
    if (!code || !mkm?.code || !config) return;

    const arr = code.split('---');

    const header = `${value.split('-->')[0]}-->`.trim();

    if (!arr[arr.length - 1]?.includes('-->')) {
      setSaved(true);
      return;
    }

    const cleanCode = arr[arr.length - 1].split('-->')[1].trim()

    if (cleanCode === decodeBase64(mkm.code.trim()) && header.trim() === `${config.split('-->')[0]}-->`.trim()) {
      setSaved(true);
    } else {
      setSaved(false);
    }
  }, [code, value]);

  const handleSaved = () => {
    try {
      if (!code) return;
      if (saved) return;

      let title: string | undefined = undefined;
      let pub: string | undefined = undefined;
      const expTitle = RegExp("\\b" + 'title' + '\\b', 'i')
      const expPub = RegExp("\\b" + 'Privacy' + '\\b', 'i')
      const arr = code.split('---')
      
      const cleanCode = arr[arr.length - 1].split('-->')[1].replace(/(\r?\n){1,2}/, '')
      title = arr?.find((title) => title.match(expTitle))?.split('\n').find((title => title.match(expTitle)))?.split(':')[1].trim();
      pub = arr?.find((pub) => pub.match(expPub))?.split('\n').find(pub => pub.match(expPub))?.split('--')[1].split(':')[1].trim();
      const encodedCode = encodeBase64(cleanCode)

      console.log(cleanCode);

      if (!title || !pub) {
        toast.fire({
          text: 'Privacy or title has been removed, please re-add',
          icon: 'warning'
        })

        return;
      };

      if (pub !== 'Private' && pub !== 'Public') {
        toast.fire({
          text: 'Privacy value has to be Public or Private',
          icon: 'warning'
        })

        return;
      }

      fetchingMarkmap({
        url: `${params.id}`,
        bearer,
        method: 'PUT',
        data: { name: title, public: pub === 'Private' ? 0 : 1, code: encodedCode }
      }).then((response) => response.clone().json())
      .then((res) => {
        if (res.statusCode !== 200) {
          return;
        };

        setSaved(true);
        setMkm({ name: title, pub: pub === 'Private' ? '0' : '1', code: encodedCode })
        sessionStorage.setItem('editMkm', JSON.stringify({ name: title, pub: pub === 'Private' ? 0 : 1, encodedCode }))
        toast.fire({
          title: 'Changes saved',
          icon: 'info',
          position: 'bottom-left',
          timer: 1500,
        })
      })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_err) {
      toast.fire({
        text: 'Something went wrong, please check your code',
        icon: 'error'
      })
    }
  }

  return (
    <>
      {
        mkm !== null && 
          <main className='editor-main'>
            <CodeMirror 
              value={`${config}${mkm.code === '_' ? '' : decodeBase64(mkm.code || '')}`}
              height='100vh'
              width='750px'
              theme={light ? tokyoNightDay : tokyoNightStorm}
              extensions={[markdown({ base: markdownLanguage, codeLanguages: languages })]}
              className='maven_pro'
              onChange={handleChange}
              autoFocus
            />
            <svg ref={refSvg} width='100%' height='300px' className='mkm-render'></svg>
            <div className="mkm-toolbar" ref={refToolbar}></div>
            <ul className='util-editor'>
              <li>
                <ThemeSelector styles={{
                  height: '32px',
                }}/>
              </li>
              <li>
                <button className={`util-btn ${saved ? 'saved' : 'save'}`} onClick={handleSaved}>
                  { saved ? <IoSaveOutline /> : <IoSaveSharp /> }
                </button>
              </li>
              <li>
                <Link to='/help' className='util-btn help' target='_blank'>
                  <IoHelpOutline />
                </Link>
              </li>
              <li>
                <Link to='/' onClick={(e) => {
                  e.preventDefault();
                  if (!saved) {
                    alert.fire({
                      title: 'Changes not saved',
                      text: 'Do you want to save changes',
                      icon: 'warning',
                      showConfirmButton: true,
                      showCancelButton: true,
                      background: 'var(--bg)',
                      color: 'var(--text)'
                    }).then((result) => {
                      if (result.isConfirmed) {
                        handleSaved()
                        sessionStorage.removeItem('loadedMkm')
                        sessionStorage.removeItem('foundedMkm')
                      } else {
                        sessionStorage.removeItem('loadedMkm')
                        sessionStorage.removeItem('foundedMkm')
                      }
                      window.location.href = '/'
                    })
                  } else {
                    sessionStorage.removeItem('loadedMkm')
                    sessionStorage.removeItem('foundedMkm')
                    window.location.href = '/'
                  }
                }}>
                  <HiHome />
                </Link>
              </li>
            </ul>
          </main>
      }
    </>
  )
}