import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
    Button,
    CircularProgress,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from '@mui/material';
import { Box } from '@mui/system';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { ERR_TOP_CENTER } from '../../../utils/snackbar-utils';
import StudentRow from './StudentRow';
import AddBoxIcon from '@mui/icons-material/AddBox';
import AddForm from './AddForm';
import studentsData from './datasource-en.json';

export default function StudentList() {
    const [students, setStudents] = useState(null);

    const [open, setOpen] = useState(false);

    const { enqueueSnackbar: eq } = useSnackbar();

    async function fetchStudents() {
        try {
            const response = await axios.get('/students');
            setTimeout(() => setStudents(response.data), 500);
        } catch (error) {
            setTimeout(() => setStudents(studentsData), 500);
            console.error(error);
            if (error.response) eq(JSON.stringify(error.response.data), ERR_TOP_CENTER);
        }
    }

    useEffect(() => {
        fetchStudents();
    }, []);

    const handleClose = () => {
        setOpen(false);
        fetchStudents();
    };

    return (
        <div>
            <Box py={1} textAlign="right">
                <Button variant="contained" color="success" startIcon={<AddBoxIcon />} onClick={() => setOpen(true)}>
                    Thêm SV
                </Button>

                <AddForm {...{ open, handleClose }} />
            </Box>
            {students === null && <CircularProgress sx={{ m: 2 }} size="1.5rem" />}

            {students !== null && students.length === 0 && (
                <Box p={2}>
                    <Typography variant="h6">Danh sách rỗng</Typography>
                </Box>
            )}

            {students !== null && students.length > 0 && (
                <TableContainer>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>#</TableCell>
                                <TableCell>Họ Tên</TableCell>
                                <TableCell>Năm sinh</TableCell>
                                <TableCell>Trường</TableCell>
                                <TableCell>Chuyên ngành</TableCell>
                                <TableCell>Sửa</TableCell>
                                <TableCell>Xóa</TableCell>
                            </TableRow>
                        </TableHead>

                        {students !== null && students.length > 0 && (
                            <TableBody>
                                {students.map((s, index) => (
                                    <StudentRow key={s.no} {...{ s, index, students, setStudents, fetchStudents }} />
                                ))}
                            </TableBody>
                        )}
                    </Table>
                </TableContainer>
            )}
        </div>
    );
}
