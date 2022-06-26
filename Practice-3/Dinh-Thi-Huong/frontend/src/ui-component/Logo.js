// material-ui
import { useTheme } from '@mui/material/styles';

import logo from '../assets/images/logo/logo.png';

const Logo = () => {
    const theme = useTheme();

    return <img src={logo} alt="" width={48} />;
};

export default Logo;
