import { HiPlusCircle } from 'react-icons/hi'
import '../styles/NewMarkmap.css'
import { alert, toast } from '../service/alert.service'

export const NewMarkmap = () => {
  const handleClick = () => {
    alert.fire({
      title: 'Create Markmap',
      html: 
        <form id='new-mkm-form'>
          <div>
            <label htmlFor="new-mkm-name">Name</label>
            <input type="text" name="new-mkm-name" id="new-mkm-name" className='ubuntu' />
          </div>
          <div>
            <label htmlFor="new-mkm-public">Public</label>
            <input type="checkbox" name="new-mkm-public" id="new-mkm-public" />
          </div>
        </form>,
      showConfirmButton: true,
      confirmButtonText: 'Create',
      showCancelButton: true,
      background: 'var(--block-bg)',
      color: 'var(--text)',
      preConfirm: () => {
        const name = (document.getElementById('new-mkm-name') as HTMLInputElement).value
        const checkPublic = (document.getElementById('new-mkm-public') as HTMLInputElement).checked

        if (!name) {
          toast.fire({
            title: 'Name is required',
            icon: 'error'
          })

          return false;
        }

        return { name, checkPublic }
      }
    }).then((result) => {
      if (!result.isConfirmed) return;

      console.log(result.value)
    })
  }

  return (
    <>
      <button id='new-markmap' className='ubuntu' onClick={handleClick}>
        <HiPlusCircle size={35} />
        Create New Markmap
      </button>
      
    </>
  )
}