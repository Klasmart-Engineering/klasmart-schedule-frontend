import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import Tooltip from '@material-ui/core/Tooltip';
import PropTypes from 'prop-types';
import {makeStyles, withStyles} from '@material-ui/core/styles';
import {
    Share,
    RemoveCircle,
    SaveAlt,
    Visibility,
    DoneOutlined,
    CloseOutlined,
    PublishOutlined,
    DeleteOutlineOutlined
} from '@material-ui/icons';
import {useLocation} from "react-router";

interface Data {
    type: string,
    name: string,
    developmental: string,
    skills: string,
    age: string,
    settings: string,
    status: string,
    created: string,
    action: string
}

function createData(
    type: string,
    name: string,
    developmental: string,
    skills: string,
    age: string,
    settings: string,
    status: string,
    created: string,
    action: string
): Data {
    return { type, name, developmental, skills, age, settings, status, created, action };
}

const useStatus = () => {
    const {search} = useLocation();
    return (new URLSearchParams(search)).get('status') || 'content';
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

// @ts-ignore
const StyledTableCell = withStyles((theme: any) => ({
    head: {
        backgroundColor: '#F2F5F7',
        color: '#666666'
    },
    body: {
        fontSize: 14
    },
}))(TableCell);

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key,
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array: Data[], comparator: (a: any, b: any) => number) {
    const stabilizedThis = array.map((el, index) => [el, index] as [Data, number]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
    id: string;
    numeric: boolean;
    disablePadding: boolean;
    label: string;
}

const headCells:HeadCell[] = [
    {id: 'type', numeric: false, disablePadding: true, label: 'Content Type'},
    {id: 'name', numeric: false, disablePadding: false, label: 'Content Name'},
    {id: 'developmental', numeric: false, disablePadding: false, label: 'Developmental Category'},
    {id: 'skills', numeric: false, disablePadding: false, label: 'Skills Category'},
    {id: 'age', numeric: false, disablePadding: false, label: 'Age'},
    {id: 'settings', numeric: false, disablePadding: false, label: 'Visibility Settings'},
    {id: 'status', numeric: false, disablePadding: false, label: 'Public Status'},
    {id: 'created', numeric: false, disablePadding: false, label: 'Created On'},
    {id: 'action', numeric: false, disablePadding: false, label: 'Action'},
];

interface EnhancedTableProps {
    classes: ReturnType<typeof useStyles>;
    numSelected: number;
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    order: Order;
    orderBy: string;
    rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount } = props;
    return (
        <TableHead>
            <TableRow>
                <StyledTableCell padding="checkbox">
                    <Checkbox
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{'aria-label': 'select all desserts'}}
                    />
                </StyledTableCell>
                {headCells.map((headCell) => (
                    <StyledTableCell
                        key={headCell.id}
                        align="center"
                        padding={headCell.disablePadding ? 'none' : 'default'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        {headCell.label}
                    </StyledTableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    classes: PropTypes.object.isRequired,
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

// @ts-ignore
const useStyles = makeStyles((theme) => ({
    root: {
        width: '88%',
        margin: '0 auto'
    },
    paper: {
        width: '100%',
        marginBottom: theme.spacing(2),
    },
    table: {
        minWidth: 750,
    },
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
    },
}));

export default function TableList() {
    const classes = useStyles();
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [selected, setSelected] = React.useState<string[]>([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(8);
    const status = useStatus()
    const [state, setState] = React.useState({
        rows: [
            createData('Lesson Plan', 'All Activities', 'Communication and Language', 'Listening and attention', '12-18 Month', 'Private', 'Published', '06/13/2020 10:58:20', '操作'),
            createData('Lesson Plan', 'Video', 'Communication and Language', 'Listening and attention', '12-18 Month', 'Private', 'Published', '06/13/2020 10:58:20', '操作'),
            createData('Lesson Plan', 'Ordering', 'Communication and Language', 'Listening and attention', '12-18 Month', 'Private', 'Published', '06/13/2020 10:58:20', '操作'),
            createData('Lesson Plan', 'Book', 'Communication and Language', 'Listening and attention', '12-18 Month', 'Private', 'Published', '06/13/2020 10:58:20', '操作'),
            createData('Lesson Plan', 'Matching', 'Communication and Language', 'Listening and attention', '12-18 Month', 'Private', 'Published', '06/13/2020 10:58:20', '操作'),
            createData('Lesson Plan', 'Song', 'Communication and Language', 'Listening and attention', '12-18 Month', 'Private', 'Published', '06/13/2020 10:58:20', '操作'),
            createData('Lesson Plan', 'Sticker', 'Communication and Language', 'Listening and attention', '12-18 Month', 'Private', 'Published', '06/13/2020 10:58:20', '操作'),
            createData('Lesson Plan', 'Pdf', 'Communication and Language', 'Listening and attention', '12-18 Month', 'Private', 'Published', '06/13/2020 10:58:20', '操作'),
            createData('Lesson Plan', 'Images', 'Communication and Language', 'Listening and attention', '12-18 Month', 'Private', 'Published', '06/13/2020 10:58:20', '操作')
        ]
    });

    const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof Data) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelecteds = state.rows.map((n) => n.name);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event: React.MouseEvent<unknown>, name: string) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected: string[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const removeData = (index: number) => {
        setState((prevState: any) => {
            const data = prevState.rows;
            data.splice(index, 1);
            return {...prevState, data};
        });
    }

    const isSelected = (name: string) => selected.indexOf(name) !== -1;

    const editTemplate = (index: number) => {
        switch (status) {
            case 'content' :
                return (
                    <TableCell align="center">
                        <Tooltip title="Share"><Share style={{
                            color: '#000000',
                            fontSize: '18px',
                            marginLeft: '8px',
                            cursor: 'pointer'
                        }}/></Tooltip>
                        <Tooltip title="Save"><SaveAlt style={{
                            color: '#000000',
                            fontSize: '18px',
                            marginLeft: '8px',
                            cursor: 'pointer'
                        }}/></Tooltip>
                        <Tooltip title="Delete"><RemoveCircle
                            style={{color: '#D32F2F', fontSize: '18px', marginLeft: '8px', cursor: 'pointer'}}
                            onClick={(event) => removeData(index)}/></Tooltip>
                    </TableCell>
                )
            case 'pending' :
                return (
                    <TableCell align="center">
                        <Tooltip title="Done"><DoneOutlined style={{
                            color: '#76C279',
                            fontSize: '18px',
                            marginLeft: '8px',
                            cursor: 'pointer'
                        }}/></Tooltip>
                        <Tooltip title="Close"><CloseOutlined
                            style={{color: '#D74040', fontSize: '18px', marginLeft: '8px', cursor: 'pointer'}}
                            onClick={(event) => removeData(index)}/></Tooltip>
                    </TableCell>
                )
            case 'archived' :
                return (
                    <TableCell align="center">
                        <Tooltip title="Publish"><PublishOutlined style={{
                            color: '#2585D9',
                            fontSize: '18px',
                            marginLeft: '8px',
                            cursor: 'pointer'
                        }}/></Tooltip>
                        <Tooltip title="Delete"><DeleteOutlineOutlined
                            style={{color: '#D74040', fontSize: '18px', marginLeft: '8px', cursor: 'pointer'}}
                            onClick={(event) => removeData(index)}/>
                        </Tooltip>
                    </TableCell>
                )
            default:
                return (
                    <TableCell align="center">
                        <Tooltip title="Share"><Share style={{
                            color: '#000000',
                            fontSize: '18px',
                            marginLeft: '8px',
                            cursor: 'pointer'
                        }}/></Tooltip>
                        <Tooltip title="Save"><SaveAlt style={{
                            color: '#000000',
                            fontSize: '18px',
                            marginLeft: '8px',
                            cursor: 'pointer'
                        }}/></Tooltip>
                        <Tooltip title="Delete"><RemoveCircle
                            style={{color: '#D32F2F', fontSize: '18px', marginLeft: '8px', cursor: 'pointer'}}
                            onClick={(event) => removeData(index)}/></Tooltip>
                    </TableCell>
                )
        }
    };

    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                <TableContainer>
                    <Table
                        className={classes.table}
                        aria-labelledby="tableTitle"
                        size={dense ? 'small' : 'medium'}
                        aria-label="enhanced table"
                    >
                        <EnhancedTableHead
                            classes={classes}
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={state.rows.length}
                        />
                        <TableBody>
                            {stableSort(state.rows, getComparator(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row: any, index: number) => {
                                    const isItemSelected = isSelected(row.name);
                                    const labelId = `enhanced-table-checkbox-${index}`;
                                    return (
                                        <TableRow
                                            hover
                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            key={row.name}
                                            selected={isItemSelected}
                                        >
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    checked={isItemSelected}
                                                    inputProps={{'aria-labelledby': labelId}}
                                                    onClick={(event) => handleClick(event, row.name)}
                                                />
                                            </TableCell>
                                            <TableCell component="th" id={labelId} scope="row" padding="none"
                                                       align="center">
                                                {row.type} <Tooltip title="Preview"><Visibility
                                                style={{color: '#0E78D5', fontSize: '16px'}}/></Tooltip>
                                            </TableCell>
                                            <TableCell align="center">{row.name}</TableCell>
                                            <TableCell align="center">{row.developmental}</TableCell>
                                            <TableCell align="center">{row.skills}</TableCell>
                                            <TableCell align="center">{row.age}</TableCell>
                                            <TableCell align="center">{row.settings}</TableCell>
                                            <TableCell align="center">{row.status}</TableCell>
                                            <TableCell align="center">{row.created}</TableCell>
                                            {editTemplate(index)}
                                        </TableRow>
                                    );
                                })}
                            <TableRow>
                                <TableCell colSpan={10}/>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[8, 10, 25]}
                    component="div"
                    count={state.rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                />
            </Paper>
        </div>
    );
}
