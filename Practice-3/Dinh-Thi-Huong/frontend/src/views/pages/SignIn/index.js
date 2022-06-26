import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useTheme } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { setLocalToken, setRemember, setSessionToken } from '../../../utils/mng-token';

export default function SignIn() {
    const [state, setState] = useState({
        email: '',
        password: '',
        remember: true
    });
    const [errors, setErrors] = useState(null);
    const navigate = useNavigate();
    const theme = useTheme();

    const hdSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/acc/signin', { email: state.email, password: state.password });
            const body = response.data;
            if (state.remember) {
                setLocalToken(body.token);
                setRemember(true);
            } else {
                setSessionToken(body.token);
                setRemember(false);
            }
            navigate('/');
        } catch (error) {
            setErrors(error.response.data);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Avatar sx={{ margin: 1, backgroundColor: theme.palette.primary.main }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h4">
                    Đăng nhập
                </Typography>
                <form
                    style={{
                        width: '100%', // Fix IE 11 issue.
                        marginTop: 24
                    }}
                    noValidate
                >
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={state.email}
                        onChange={(e) => {
                            setState({ ...state, email: e.target.value });
                            setErrors({ ...errors, email: null });
                        }}
                        error={Boolean(errors?.email)}
                        helperText={errors?.email}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Mật khẩu"
                        type="password"
                        id="password"
                        autoComplete="password"
                        value={state.password}
                        onChange={(e) => {
                            setState({ ...state, password: e.target.value });
                            setErrors({ ...errors, password: null });
                        }}
                        error={Boolean(errors?.password)}
                        helperText={errors?.password}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={state.remember}
                                onChange={(e) => setState({ ...state, remember: !state.remember })}
                                color="primary"
                            />
                        }
                        label="Nhớ đăng nhập"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        style={{ margin: '24px 0 16px' }}
                        onClick={hdSubmit}
                    >
                        Đăng nhập
                    </Button>
                    <Box textAlign="right">
                        <Link component={RouterLink} to="/sign-up">
                            Chưa có tài khoản? Đăng kí
                        </Link>
                    </Box>
                </form>
            </Box>
            <Box mt={6}>{/* <Copyright /> */}</Box>
        </Container>
    );
}
