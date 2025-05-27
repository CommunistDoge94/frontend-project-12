import { useDispatch } from 'react-redux';
import { openModal, closeModal } from '../slices/modalSlice';

export const useModal = () => {
  const dispatch = useDispatch();

  return {
    openModal: (type, extra = null) => dispatch(openModal({ type, extra })),
    closeModal: () => dispatch(closeModal()),
  };
};
