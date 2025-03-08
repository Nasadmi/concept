import { useEffect, useState } from 'react'
import { MkmType } from '../types/markmap.interface'
import { Link, redirect, useParams } from 'react-router'
import { fetchingMarkmap } from '../service/fetch.service'
import { usePlaneMarkmap } from '../hooks/useMarkmap'
import { decodeBase64 } from '../service/md.service'
import { HiStar, HiLogout } from 'react-icons/hi'
import '../styles/Viewer.css'
import { getCookie } from '../service/cookie.service'
import { toast } from '../service/alert.service'

export const Viewer = () => {
  const params = useParams();
  const bearer = getCookie('bearer')
  const [mkm, setMkm] = useState<Pick<MkmType, 'code' | 'name' | 'stars' | 'created_at' | 'updated_at' | 'user' | 'id'> & { starred: boolean } | null>(null);
  const [starred, setStarred] = useState<boolean>(false)
  const markmap = usePlaneMarkmap();
  const [katexLoaded, setKatexLoaded] = useState<boolean>(false);

  if (!params.id || !bearer) {
    redirect('/');
  }

  useEffect(() => {
    fetchingMarkmap({
      url: `view/${params.id}`,
      bearer
    }).then(response => response.json())
      .then((res) => {
        if (res.statusCode) {
          return;
        }
        console.log(res)
        setStarred(res.starred)
        setMkm(res);
      });
  }, [params, bearer]);

  useEffect(() => {
    if (!window.katex) {
      import("katex").then((katex) => {
        window.katex = katex;
        setKatexLoaded(true);
      });
    } else {
      setKatexLoaded(true) 
  }}, []);

  useEffect(() => {
    if (!mkm || !katexLoaded) return;
    markmap.setValue(`---\ntitle: ${mkm.name}\nmarkmap:\n  colorFreezeLevel: 2\n  maxWidth: 450\n---\n\n${mkm.code === '_' ? '' : decodeBase64(mkm.code || '')}`);
  }, [mkm, markmap]);

  useEffect(() => {
    if (markmap.markmap.current && markmap.refToolbar.current) {
      markmap.renderToolBar({
        mm: markmap.markmap.current,
        wrapper: markmap.refToolbar.current,
      });
      document.querySelector("#root > div.mkm-toolbar > div > a")?.setAttribute('target', '_blank')
    }
  }, [markmap]);

  const handleAddStars = () => {
    if (!mkm) return;
    fetchingMarkmap({
      url: `star/${mkm.id}`,
      bearer,
      method: 'POST'
    }).then((response) => response.json())
    .then((res) => {
      if (res.statusCode !== 200) return;
      setStarred(true);
      toast.fire({
        title: 'Added to favorites',
        position: 'bottom-right',
        icon: 'success'
      })
    })
  }

  const handleRemoveStars = () => {
    if (!mkm) return;
    fetchingMarkmap({
      url: `star/${mkm.id}`,
      bearer,
      method: 'DELETE'
    }).then((response) => response.json())
    .then((res) => {
      if (res.statusCode !== 200) return;
      setStarred(false);
      toast.fire({
        title: 'Removed from favorites',
        position: 'bottom-right',
        icon: 'success'
      })
    })
  }

  return (
    mkm &&
    <>
      <div className='view-info ubuntu'>
        <div className="desc">
          <h1>Title: {mkm.name}</h1>
          <h2>Author: {mkm.user.username}</h2>
          <h3>Stars: {mkm.stars}</h3>
          <h3>Creation date: {mkm.created_at.split('T')[0]}</h3>
          <h3>Last update: {mkm.updated_at.split('T')[0]}</h3>
        </div>
        <div className="view-utils">
          <button onClick={!starred ? handleAddStars : handleRemoveStars} className={`${starred ? 'starred' : ''}`}>
            <HiStar />
          </button>
          <Link to={'/'}>
            <HiLogout />
          </Link>
        </div>
      </div>
      <svg ref={markmap.refSvg} width='100%' className='mkm-render viewer'/>
      <div className="mkm-toolbar" ref={markmap.refToolbar}></div>
    </>
  );
};