import { useContext } from 'react';
import SnackbarContext from '../contexts/SnackbarContext';

const useSnackbar = () => useContext(SnackbarContext);

export default useSnackbar;