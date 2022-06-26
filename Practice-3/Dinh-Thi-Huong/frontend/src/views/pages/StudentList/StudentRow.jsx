/* eslint-disable no-underscore-dangle */
import { CircularProgress, IconButton, TableCell, TableRow } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useState } from 'react';
import axios from 'axios';
import { ERR_TOP_CENTER, SUCCESS_TOP_CENTER } from '../../../utils/snackbar-utils';
import { useSnackbar } from 'notistack';
import EditForm from './EditForm';

export default function StudentRow({ s, index, students, setStudents, fetchStudents }) {
    const [deleting, setDeleting] = useState(false);
    const { enqueueSnackbar } = useSnackbar();

    const [open, setOpen] = useState(false);

    const handleClose = () => {
        setOpen(false);
        fetchStudents();
    };

    async function hdDelete() {
        try {
            setDeleting(true);
            const response = await axios.delete(`/student?_id=${s._id}`);
            const newEms = students.filter((_, i) => i !== index);
            setStudents(newEms);
            enqueueSnackbar('Xóa nhân viên thành công!', SUCCESS_TOP_CENTER);
        } catch (error) {
            console.log(error);
            if (error.response) enqueueSnackbar(JSON.stringify(error.response.data), ERR_TOP_CENTER);
        }
    }

    return (
        <TableRow>
            <TableCell>{index + 1}</TableCell>
            <TableCell>{s.name}</TableCell>
            <TableCell>{s.birthYear}</TableCell>
            <TableCell>{s.school}</TableCell>
            <TableCell>{s.major}</TableCell>

            <TableCell>
                <IconButton onClick={() => setOpen(true)}>
                    <EditIcon />
                </IconButton>

                <EditForm {...{ s, open, handleClose }} />
            </TableCell>
            <TableCell>
                {deleting ? (
                    <CircularProgress color="primary" size="1.25rem" />
                ) : (
                    <IconButton onClick={() => hdDelete()}>
                        <DeleteIcon color="error" />
                    </IconButton>
                )}
            </TableCell>
        </TableRow>
    );
}
