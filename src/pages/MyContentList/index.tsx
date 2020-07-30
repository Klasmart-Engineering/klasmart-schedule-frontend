import React from 'react';
import {Redirect, useLocation} from 'react-router-dom';
import CardList from './CardList';
import TableList from './TableList';
import {makeStyles, withStyles} from '@material-ui/core/styles';
import {Grid} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import {
    ViewQuiltOutlined,
    ViewListOutlined,
    PermMediaOutlined,
    HourglassEmptyOutlined,
    ArchiveOutlined,
    PublishOutlined,
    DescriptionOutlined,
    Search,
    MoreHoriz
} from '@material-ui/icons';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import InputBase from '@material-ui/core/InputBase';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import {Link} from 'react-router-dom';
import Hidden from '@material-ui/core/Hidden';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import LayoutBox from '../../components/LayoutBox';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import InputAdornment from "@material-ui/core/InputAdornment";
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

const useLayout = () => {
    const {search} = useLocation();
    return (new URLSearchParams(search)).get('layout') || 'card';
}

const useStatus = () => {
    const {search} = useLocation();
    return (new URLSearchParams(search)).get('status') || 'content';
}

const usePath = () => {
    return `/my-content-list?layout=${useLayout()}`
}

// @ts-ignore
const BootstrapInput = withStyles((theme) => ({
    root: {
        'label + &': {
            marginTop: theme.spacing(3),
        },
    },
    input: {
        borderRadius: 4,
        position: 'relative',
        backgroundColor: theme.palette.background.paper,
        border: '1px solid #ced4da',
        fontSize: 16,
        padding: '10px 26px 10px 12px',
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        // Use the system font instead of the default Roboto font.
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        '&:focus': {
            borderRadius: 4,
            borderColor: '#80bdff',
            boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
        },
    },
}))(InputBase);

// @ts-ignore
const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        marginBottom: '20px'
    },
    createBtn: {
        width: '125px',
        borderRadius: '23px',
        height: '48px',
        backgroundColor: '#0E78D5'
    },
    nav: {
        cursor: 'pointer'
    },
    navIcon: {
        fontSize: '18px',
        marginRight: '3px'
    },
    navTitle: {
        fontSize: '16px',
        fontWeight: 'bold'
    },
    searchBtn: {
        width: '111px',
        height: '40px',
        backgroundColor: '#0E78D5',
        marginLeft: '20px'
    },
    formControl: {
        minWidth: 136,
        marginLeft: '20px'
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
    switch: {
        marginRight: '22px'
    },
    navigation: {
        padding: '20px 0px 10px 0px'
    },
    searchText: {
        width: '34%'
    },
    actives: {
        color: '#0E78D5'
    },
    tabMb: {
        textAlign: 'right',
        position: 'relative'
    },
    switchBtn: {
        width: '60px',
        height: '40px'
    }
}));

const handleSubmit = (path: string) => {
    console.log(path)
}

function SelectTemplate(props: any) {
    const classes = useStyles();
    const [value, setValue] = React.useState('');
    const [state, setState] = React.useState({
        value: 30
    });
    const layout = useLayout();
    const handleChange = (event: any) => {
        setValue(event.target.value);
    };
    return (
        <div className={classes.root}>
            <LayoutBox holderMin={40} holderBase={202} mainBase={1517}>
                <Hidden only={['xs', 'sm']}>
                    <Grid container spacing={3} style={{marginTop: '6px'}}>
                        <Grid item md={10} lg={8} xl={8}>
                            <TextField
                                id="outlined-multiline-flexible"
                                className={classes.searchText}
                                label="Search"
                                multiline
                                rowsMax={4}
                                onChange={handleChange}
                                variant="outlined"
                                size="small"
                            />
                            <Button variant="contained" color="primary" className={classes.searchBtn}>
                                <Search/> Search
                            </Button>
                            <FormControl variant="outlined" className={classes.formControl}>
                                <NativeSelect
                                    id="demo-customized-select-native"
                                    value={state.value}
                                    onChange={handleChange}
                                    input={<BootstrapInput/>}
                                >
                                    <option value={10}>Remove</option>
                                    <option value={20}>Share</option>
                                    <option value={30}>Download</option>
                                </NativeSelect>
                            </FormControl>
                        </Grid>
                        <Grid
                            container
                            direction="row"
                            justify="flex-end"
                            alignItems="center"
                            item md={2} lg={4} xl={4}>
                            <ButtonGroup aria-label="outlined primary button group" className={classes.switch}>
                                <Button variant="contained" style={{
                                    backgroundColor: layout === 'card' ? '#FFFF' : '#0E78D5',
                                    color: layout === 'card' ? 'black' : '#FFFF'
                                }} className={classes.switchBtn} href='#/my-content-list?layout=list'>
                                    <Tooltip title="List"><ViewListOutlined/></Tooltip>
                                </Button>
                                <Button variant="contained" style={{
                                    backgroundColor: layout === 'card' ? '#0E78D5' : '#FFFF',
                                    color: layout === 'card' ? '#FFFF' : 'black'
                                }} className={classes.switchBtn} href='#/my-content-card?layout=card'>
                                    <Tooltip title="Card"><ViewQuiltOutlined/></Tooltip>
                                </Button>
                            </ButtonGroup>
                        </Grid>
                    </Grid>
                </Hidden>
            </LayoutBox>
            <SelectTemplateMb/>
        </div>
    );
}

function SelectTemplateMb(props: any) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef<HTMLButtonElement>(null);
    const [value, setValue] = React.useState('');
    const [state, setState] = React.useState({
        value: 30
    });
    const layout = useLayout();
    const handleChange = (event: any) => {
        setValue(event.target.value);
    };
    const renderUserMessage = () => {
        if (layout === 'card') {
            return (
                <Link to='/my-content-list?layout=list' style={{color: 'black'}}>
                    <ViewListOutlined style={{fontSize: '40px', marginTop: '8px'}}/>
                </Link>
            )
        } else {
            return (
                <Link to='/my-content-list?layout=card' style={{color: 'black'}}>
                    <ViewQuiltOutlined style={{fontSize: '40px', marginTop: '8px'}}/>
                </Link>
            )
        }
    }

    const handleClose = (event: React.MouseEvent<EventTarget>) => {
        if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
            return;
        }

        setOpen(false);
    };

    function handleListKeyDown(event: React.KeyboardEvent) {
        if (event.key === 'Tab') {
            event.preventDefault();
            setOpen(false);
        }
    }

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };
    return (
        <div className={classes.root}>
            <LayoutBox holderMin={40} holderBase={202} mainBase={1517}>
                <Hidden only={['md', 'lg', 'xl']}>
                    <Grid container spacing={3}>
                        <Grid item xs={8} sm={8}>
                            <Button variant="contained" color="primary" className={classes.createBtn}>
                                Create +
                            </Button>
                        </Grid>
                        <Grid item xs={4} sm={4} className={classes.tabMb}>
                            {renderUserMessage()}
                            <MoreHoriz style={{fontSize: '40px'}} onClick={handleToggle}/>
                            <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal
                                    style={{position: 'absolute', top: 30, right: 0, zIndex: 999}}>
                                {({TransitionProps, placement}) => (
                                    <Grow
                                        {...TransitionProps}
                                        style={{transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom'}}
                                    >
                                        <Paper>
                                            <ClickAwayListener onClickAway={handleClose}>
                                                <MenuList autoFocusItem={open} id="menu-list-grow"
                                                          onKeyDown={handleListKeyDown}>
                                                    <MenuItem onClick={handleClose}>Profile</MenuItem>
                                                    <MenuItem onClick={handleClose}>My account</MenuItem>
                                                    <MenuItem onClick={handleClose}>Logout</MenuItem>
                                                </MenuList>
                                            </ClickAwayListener>
                                        </Paper>
                                    </Grow>
                                )}
                            </Popper>
                        </Grid>
                        <Grid item xs={12} sm={12} style={{textAlign: 'center'}}>
                            <TextField
                                id="outlined-multiline-flexible"
                                style={{width: '100%'}}
                                label="Search"
                                multiline
                                rowsMax={4}
                                value={value}
                                onChange={handleChange}
                                variant="outlined"
                                size="small"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Search/>
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Grid>
                    </Grid>
                </Hidden>
            </LayoutBox>
        </div>
    );
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: any;
    value: any;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index } = props;
    return (
        <div>
            {value === index && (
                <Typography>{children}</Typography>
            )}
        </div>
    );
}

function SecondaryMenu(props: any) {
    const classes = useStyles();
    const status = useStatus()
    return (
        <div className={classes.root}>
            <LayoutBox holderMin={40} holderBase={202} mainBase={1517}>
                <Hidden only={['xs', 'sm']}>
                    <Grid container spacing={3}>
                        <Grid item md={5} lg={6} xl={7}>
                            <Button variant="contained" color="primary" className={classes.createBtn}>
                                Create +
                            </Button>
                        </Grid>
                        <Grid
                            container
                            direction="row"
                            justify="space-evenly"
                            alignItems="center"
                            item md={7} lg={6} xl={5}>
                            <Link to={`${usePath()}&status=content`} style={{color: 'black', textDecoration: 'none'}}>
                                <div className={`${classes.nav} ${status === 'content' ? classes.actives : ''}`}>
                                    <DescriptionOutlined className={classes.navIcon}/> <span
                                    className={classes.navTitle}>My Content</span></div>
                            </Link>
                            <Link to={`${usePath()}&status=assets`} style={{color: 'black', textDecoration: 'none'}}>
                                <div className={`${classes.nav} ${status === 'assets' ? classes.actives : ''}`}>
                                    <PermMediaOutlined className={classes.navIcon}/> <span
                                    className={classes.navTitle}>Assets</span></div>
                            </Link>
                            <Link to={`${usePath()}&status=published`} style={{color: 'black', textDecoration: 'none'}}>
                                <div className={`${classes.nav} ${status === 'published' ? classes.actives : ''}`}>
                                    <PublishOutlined className={classes.navIcon}/> <span
                                    className={classes.navTitle}>Published</span></div>
                            </Link>
                            <Link to={`${usePath()}&status=pending`} style={{color: 'black', textDecoration: 'none'}}>
                                <div className={`${classes.nav} ${status === 'pending' ? classes.actives : ''}`}>
                                    <HourglassEmptyOutlined className={classes.navIcon}/> <span
                                    className={classes.navTitle}>Pending</span></div>
                            </Link>
                            <Link to={`${usePath()}&status=archived`} style={{color: 'black', textDecoration: 'none'}}>
                                <div className={`${classes.nav} ${status === 'archived' ? classes.actives : ''}`}>
                                    <ArchiveOutlined className={classes.navIcon}/> <span
                                    className={classes.navTitle}>Archived</span></div>
                            </Link>
                        </Grid>
                    </Grid>
                </Hidden>
            </LayoutBox>
            <SecondaryMenuMb/>
        </div>
    );
}

function SecondaryMenuMb(props: any) {
    const classes = useStyles();
    const status = useStatus()
    const usePaths = usePath()
    const [value, setValue] = React.useState(0);
    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setValue(newValue);
    };
    return (
        <div className={classes.root}>
            <Hidden only={['md', 'lg', 'xl']}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={12}>
                        <AppBar position="static" color="inherit">
                            <Tabs
                                value={value}
                                onChange={handleChange}
                                variant="scrollable"
                                scrollButtons="on"
                                indicatorColor="primary"
                                textColor="primary"
                                aria-label="scrollable force tabs example"
                            >
                                    <Tab label="My Content"/>
                                    <Tab label="Assets"/>
                                    <Tab label="Published"/>
                                    <Tab label="Pending"/>
                                    <Tab label="Archived"/>
                            </Tabs>
                        </AppBar>
                        <TabPanel value={value} index={0}>
                            <Redirect to={`${usePath()}&status=content`} />
                        </TabPanel>
                        <TabPanel value={value} index={1}>
                            <Redirect to={`${usePath()}&status=assets`} />
                        </TabPanel>
                        <TabPanel value={value} index={2}>
                            <Redirect to={`${usePath()}&status=published`} />
                        </TabPanel>
                        <TabPanel value={value} index={3}>
                            <Redirect to={`${usePath()}&status=pending`} />
                        </TabPanel>
                        <TabPanel value={value} index={4}>
                            <Redirect to={`${usePath()}&status=archived`} />
                        </TabPanel>
                    </Grid>
                </Grid>
            </Hidden>
        </div>
    );
}

export default function MyContentList() {
    const layout = useLayout();
    const classes = useStyles();
    return (
        <div>
            <div className={classes.navigation}>
                <SecondaryMenu/>
                <SelectTemplate/>
            </div>
            {layout === 'card' ? <CardList/> : <TableList/>}
        </div>
    )
}
