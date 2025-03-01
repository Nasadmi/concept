import { Link } from 'react-router'
import { NewMarkmap } from './NewMarkmap'
import { QMkmType } from '../types/markmap.interface'
import { HiStar, HiOutlineEye, HiOutlineEyeOff, HiUser, HiPencil, HiTrash, HiBookOpen } from 'react-icons/hi'
import { MdUpdate, MdCreateNewFolder } from 'react-icons/md'
import '../styles/Markmap.css'
import { MouseEvent } from 'react'
import { CMkmFunc } from '../types/markmap.interface'
import { alert } from '../service/alert.service'

export const Markmaps = ({ markmaps, query, cmkm, dmkm }: { 
  markmaps: QMkmType[] | null, 
  query?: true,
  cmkm?: CMkmFunc,
  dmkm?: (id: string) => void,
 }) => {

  const handleMouseEnter = (e: MouseEvent<HTMLAnchorElement>) => {
    const target = e.target as HTMLAnchorElement;
    target.style.backgroundPosition = `${Math.floor(Math.random() * (50 - 5 + 1)) + 5}px`
  }

  const handleMouseLeave = (e: MouseEvent<HTMLAnchorElement>) => {
    const target = e.target as HTMLAnchorElement;
    target.style.backgroundPosition = '0px'
  }

  const DeleteMkm = (id: string, name: string) => {
    alert.fire({
      title: `Are you sure to delete "${name}"`,
      icon: 'warning',
      showConfirmButton: true,
      showCancelButton: true,
      color: 'var(--text)',
      background: 'var(--bg)',
    }).then((res) => {
      if (!res.isConfirmed) {
        return;
      }

      if (!dmkm) {
        return;
      }
  
      dmkm(id);
    })
  }

  return (
    <main className='mkm-main'>
      {
        !markmaps ?
          <></> :
          <>
            {
              !query && <NewMarkmap exec={cmkm}/>
            }
            {
              markmaps.map((mkm) => (
                <section key={mkm.id} className='mkm-sec maven_pro' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} style={{
                  height: `${!query ? '' : ''}`,
                }}>
                  <h1 className='title ubuntu'>{mkm.name}</h1>
                  <div className='list-main'>
                    <ul className='social'>
                      <li>
                        <HiStar /><span className='text'>{mkm.stars}</span>
                      </li>
                      <li>
                        {
                          query ?
                          <>
                            <HiUser/>
                            <span className='text'>{mkm.user.username}</span>
                          </>
                          :
                          Number(mkm.public) === 0 ? 
                          <>
                            <HiOutlineEyeOff />
                            <span className='text'>Private</span>
                          </>
                          : 
                          <>
                            <HiOutlineEye />
                            <span className='text'>Public</span>
                          </>
                        }
                      </li>
                    </ul>
                    <ul className='date'>
                      <li>
                        <MdCreateNewFolder /><span className='text'>{mkm.created_at.toString().split('T')[0]}</span>
                      </li>
                      <li>
                        <MdUpdate /><span className='text'>{mkm.updated_at.toString().split('T')[0]}</span>
                      </li>
                    </ul>
                  </div>
                  {
                    !query &&
                      <ul className="mkm-utils">
                        <li>
                          <Link to={`/view/${mkm.id}`} className='utils-view'>
                            <HiBookOpen />
                          </Link>
                        </li>
                        <li>
                          <Link to={`/edit/${mkm.id}`} className='utils-edit'>
                            <HiPencil />
                          </Link>
                        </li>
                        <li>
                          <button className='utils-delete' onClick={() => { DeleteMkm(mkm.id, mkm.name) }}>
                            <HiTrash />
                          </button>
                        </li>
                      </ul>
                    }
                </section>
                ))
            }
          </>
      }
    </main>
  )
}