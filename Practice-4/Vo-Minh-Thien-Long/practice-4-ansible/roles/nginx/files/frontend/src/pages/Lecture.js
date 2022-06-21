import {filter} from 'lodash';
import {useEffect, useState} from 'react';
// material
import {
    Card,
    Container,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TablePagination,
    TableRow,
    Typography,
} from '@mui/material';
// components
import Page from '../components/Page';
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import SearchNotFound from '../components/SearchNotFound';
import {LectureListHead, LectureListToolbar} from '../sections/@dashboard/lecture';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    {id: 'order', label: 'Buổi', alignRight: false},
    {id: 'name', label: 'Nội dung', alignRight: false},
    {id: 'date', label: 'Ngày', alignRight: false},
    {id: 'time', label: 'Giờ bắt đầu', alignRight: true},
    {id: 'mentors', label: 'Phụ trách', alignRight: true},
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    if (query) {
        return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
    }
    return stabilizedThis.map((el) => el[0]);
}

export default function Lecture() {
    const [lectureList, setLectureList] = useState([]);

    const [page, setPage] = useState(0);

    const [order, setOrder] = useState('desc');

    const [selected, setSelected] = useState([]);

    const [orderBy, setOrderBy] = useState('order');

    const [filterName, setFilterName] = useState('');

    const [rowsPerPage, setRowsPerPage] = useState(5);

    useEffect(() => {
        const fetchLectures = async () => {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/lectures`);
            const result = await response.json();
            setLectureList(result?.lectures.map(lecture => ({
                ...lecture,
                date: new Date(lecture.started_at),
                time: new Date(lecture.started_at).toLocaleTimeString('vi-VN', {timeZone: 'Asia/Ho_Chi_Minh'}),
            })) || []);
        }
        fetchLectures().then();
    }, [setLectureList])

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = lectureList.map((n) => n.name);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleFilterByName = (event) => {
        setFilterName(event.target.value);
    };

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - lectureList.length) : 0;

    const filteredUsers = applySortFilter(lectureList, getComparator(order, orderBy), filterName);

    const isUserNotFound = filteredUsers.length === 0;

    return (
        <Page title="Bài giảng">
            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Lịch học Giai đoạn 1
                    </Typography>
                </Stack>

                <Card>
                    <LectureListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName}/>

                    <Scrollbar>
                        <TableContainer sx={{minWidth: 800, px: 4}}>
                            <Table>
                                <LectureListHead
                                    order={order}
                                    orderBy={orderBy}
                                    headLabel={TABLE_HEAD}
                                    rowCount={lectureList.length}
                                    numSelected={selected.length}
                                    onRequestSort={handleRequestSort}
                                    onSelectAllClick={handleSelectAllClick}
                                />
                                <TableBody>
                                    {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                        const {order, name, date, time, mentors} = row;
                                        const isItemSelected = selected.indexOf(name) !== -1;

                                        return (
                                            <TableRow
                                                hover
                                                key={order}
                                                tabIndex={-1}
                                                role="checkbox"
                                                selected={isItemSelected}
                                                aria-checked={isItemSelected}
                                            >
                                                <TableCell align="left">{order}</TableCell>
                                                <TableCell align="left">{name}</TableCell>
                                                <TableCell align="left">{date.toLocaleDateString('vi-VN', {timeZone: 'Asia/Ho_Chi_Minh'})}</TableCell>
                                                <TableCell align="right">{time}</TableCell>
                                                <TableCell align="right">
                                                    {mentors.slice(0, 3).map((mentor, i) => (
                                                        <Label key={i} variant="ghost" color={(mentor.startsWith('KOL') && 'error') || 'info'} sx={i > 0 && {ml: 1}}>
                                                            {mentor}
                                                        </Label>
                                                    ))}
                                                    {mentors.length > 3 && <Label variant="ghost" sx={{ml: 1}}>
                                                        ...
                                                    </Label>}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                    {emptyRows > 0 && (
                                        <TableRow style={{ height: 53 * emptyRows }}>
                                            <TableCell colSpan={6} />
                                        </TableRow>
                                    )}
                                </TableBody>

                                {isUserNotFound && (
                                    <TableBody>
                                        <TableRow>
                                            <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                                                <SearchNotFound searchQuery={filterName} />
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                )}
                            </Table>
                        </TableContainer>
                    </Scrollbar>

                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={lectureList.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        labelDisplayedRows={({from, to, count}) => `${from}-${to} trên ${count} trang`}
                        labelRowsPerPage="Số hàng trên trang"
                    />
                </Card>
            </Container>
        </Page>
    );
}
