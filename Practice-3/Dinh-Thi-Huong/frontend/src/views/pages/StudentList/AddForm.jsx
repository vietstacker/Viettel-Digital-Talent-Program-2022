/* eslint-disable no-underscore-dangle */
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from 'react';
import { Grid, CircularProgress } from '@mui/material';
import { Box } from '@mui/system';
import { ERR_TOP_CENTER, SUCCESS_TOP_CENTER } from '../../../utils/snackbar-utils';
import { useSnackbar } from 'notistack';
import axios from 'axios';

export default function AddForm({ open, handleClose }) {
    // should wrap all variable to one state object
    // then, the onChange can be generalization (e.target.value, e.target.name)
    const [name, setName] = useState('');
    const [birthYear, setBirthYear] = useState(2000);
    const [school, setSchool] = useState('');
    const [major, setMajor] = useState('');

    const [creating, setCreating] = useState(false);

    const { enqueueSnackbar } = useSnackbar();

    async function hdAddStudent() {
        try {
            setCreating(true);
            const response = await axios.post('/student', {
                name,
                birthYear,
                school,
                major
            });
            enqueueSnackbar('Tạo thành công!', SUCCESS_TOP_CENTER);
        } catch (error) {
            console.log(error);
            if (error.response) enqueueSnackbar(JSON.stringify(error.response.data), ERR_TOP_CENTER);
        } finally {
            setCreating(false);
            handleClose();
        }
    }

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
            <DialogTitle sx={{ fontSize: '1rem' }}>Thêm sinh viên</DialogTitle>
            <DialogContent>
                <Box pt={2}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={3}>
                            <TextField label="Họ tên" value={name} onChange={(e) => setName(e.target.value)} />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <TextField label="Năm sinh" type="number" value={birthYear} onChange={(e) => setBirthYear(e.target.value)} />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <TextField label="Trường" value={school} onChange={(e) => setSchool(e.target.value)} />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <TextField label="Chuyên ngành" value={major} onChange={(e) => setMajor(e.target.value)} />
                        </Grid>
                    </Grid>
                </Box>
            </DialogContent>
            <DialogActions>
                <Box p={1}>
                    <Button onClick={handleClose}>Hủy</Button>
                    <Button variant="contained" onClick={() => hdAddStudent()} disabled={creating}>
                        {creating ? <CircularProgress size="1rem" /> : 'Gửi'}
                    </Button>
                </Box>
            </DialogActions>
        </Dialog>
    );
}
