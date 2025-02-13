import { Link } from 'react-router'
import { MkmType } from '../types/markmap.interface'
import { HiStar, HiOutlineEye, HiOutlineEyeOff, HiSave, HiCloudUpload } from 'react-icons/hi'
import '../styles/MyMarkmap.css'
import { MouseEvent } from 'react'

export const MyMarkmaps = ({ markmaps }: { markmaps: Pick<MkmType, 'created_at' | 'updated_at' | 'id' | 'name' | 'public' | 'stars'>[] | null }) => {
  const handleMouseEnter = (e: MouseEvent<HTMLAnchorElement>) => {
    const target = e.target as HTMLAnchorElement;
    target.style.backgroundPosition = `${Math.floor(Math.random() * (50 - 5 + 1)) + 5}%`
  }

  const handleMouseLeave = (e: MouseEvent<HTMLAnchorElement>) => {
    const target = e.target as HTMLAnchorElement;
    target.style.backgroundPosition = '0'
  }

  return (
    <main className='mkm-main'>
      {
        !markmaps ?
          <></> :
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
                      mkm.public === 0 ? 
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
                    <HiSave /><span className='text'>{mkm.created_at.toString().split('T')[0]}</span>
                  </li>
                  <li>
                    <HiCloudUpload /><span className='text'>{mkm.updated_at.toString().split('T')[0]}</span>
                  </li>
                </ul>
              </div>
            </Link>
            ))
      }
    </main>
  )
}