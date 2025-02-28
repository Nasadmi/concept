import { Link } from 'react-router'
import { NewMarkmap } from './NewMarkmap'
import { QMkmType } from '../types/markmap.interface'
import { HiStar, HiOutlineEye, HiOutlineEyeOff, HiUser } from 'react-icons/hi'
import { MdUpdate, MdCreateNewFolder } from 'react-icons/md'
import '../styles/Markmap.css'
import { MouseEvent } from 'react'
import { CMkmFunc } from '../types/markmap.interface'

export const Markmaps = ({ markmaps, query, cmkm }: { 
  markmaps: QMkmType[] | null, 
  query?: true,
  cmkm?: CMkmFunc
 }) => {

  const handleMouseEnter = (e: MouseEvent<HTMLAnchorElement>) => {
    const target = e.target as HTMLAnchorElement;
    target.style.backgroundPosition = `${Math.floor(Math.random() * (50 - 5 + 1)) + 5}px`
  }

  const handleMouseLeave = (e: MouseEvent<HTMLAnchorElement>) => {
    const target = e.target as HTMLAnchorElement;
    target.style.backgroundPosition = '0px'
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
                <Link to={`/markmap/${mkm.id}`} key={mkm.id} className='mkm-sec maven_pro' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
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
                </Link>
                ))
            }
          </>
      }
    </main>
  )
}