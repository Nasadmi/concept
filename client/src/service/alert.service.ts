import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2'

export const alert = withReactContent(Swal)

export const toast = alert.mixin({
  toast: true,
  position: "bottom-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
  background: 'var(--block-bg)',
  color: 'var(--text)',
});