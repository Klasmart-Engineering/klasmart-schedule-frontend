import LayoutBox from "../../components/LayoutBox";
import Hidden from "@material-ui/core/Hidden";
import {Grid, withStyles} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import {Link, Redirect, useLocation} from "react-router-dom";
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
import React from "react";
import AppBar from "@material-ui/core/AppBar/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Popper from "@material-ui/core/Popper/Popper";
import Grow from "@material-ui/core/Grow/Grow";
import Paper from "@material-ui/core/Paper/Paper";
import ClickAwayListener from "@material-ui/core/ClickAwayListener/ClickAwayListener";
import MenuList from "@material-ui/core/MenuList/MenuList";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormControl from "@material-ui/core/FormControl";
import NativeSelect from "@material-ui/core/NativeSelect/NativeSelect";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Tooltip from "@material-ui/core/Tooltip/Tooltip";
import {makeStyles} from "@material-ui/core/styles";
import InputBase from "@material-ui/core/InputBase/InputBase";

const useQuery = () => {
    const {search} = useLocation();
    const  query = new URLSearchParams(search)
    const layout =  query.get('layout') || 'card';
    const status = query.get('status') || 'content';
    return {layout, status}
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
        cursor: 'pointer',
        fontWeight: 'bold',
        marginRight: '3px'
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


interface TabPanelProps {
    children?: React.ReactNode;
    index: any;
    value: any;
}

function TabPanel(props: TabPanelProps) {
    const {children, value, index} = props;
    return (
        <div>
            {value === index && (
                <Typography>{children}</Typography>
            )}
        </div>
    );
}

function SecondaryMenu() {
    const classes = useStyles();
    const { status, layout } = useQuery()
    const path = `/#/my-content-list?layout=${layout}`
    return (
        <div className={classes.root}>
            <LayoutBox holderMin={40} holderBase={202} mainBase={1517}>
                <Hidden only={['xs', 'sm']}>
                    <Grid container spacing={3}>
                        <Grid item md={3} lg={5} xl={7}>
                            <Button variant="contained" color="primary" className={classes.createBtn}>
                                Create +
                            </Button>
                        </Grid>
                        <Grid
                            container
                            direction="row"
                            justify="space-evenly"
                            alignItems="center"
                            item md={9} lg={7} xl={5}>
                            <Button
                                href={`${path}&status=content`}
                                className={`${classes.nav} ${status === 'content' ? classes.actives : ''}`}
                                startIcon={<DescriptionOutlined />}
                            >
                                My Content
                            </Button>
                            <Button
                                href={`${path}&status=assets`}
                                className={`${classes.nav} ${status === 'assets' ? classes.actives : ''}`}
                                startIcon={<PermMediaOutlined />}
                            >
                                Assets
                            </Button>
                            <Button
                                href={`${path}&status=published`}
                                className={`${classes.nav} ${status === 'published' ? classes.actives : ''}`}
                                startIcon={<PublishOutlined />}
                            >
                                Published
                            </Button>
                            <Button
                                href={`${path}&status=pending`}
                                className={`${classes.nav} ${status === 'pending' ? classes.actives : ''}`}
                                startIcon={<HourglassEmptyOutlined />}
                            >
                                Pending
                            </Button>
                            <Button
                                href={`${path}&status=archived`}
                                className={`${classes.nav} ${status === 'archived' ? classes.actives : ''}`}
                                startIcon={<ArchiveOutlined />}
                            >
                                Archived
                            </Button>
                        </Grid>
                    </Grid>
                </Hidden>
            </LayoutBox>
            <SecondaryMenuMb/>
        </div>
    );
}

function SecondaryMenuMb() {
    const classes = useStyles();
    const { layout } = useQuery()
    const path = `/my-content-list?layout=${layout}`
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
                            <Redirect to={`${path}&status=content`}/>
                        </TabPanel>
                        <TabPanel value={value} index={1}>
                            <Redirect to={`${path}&status=assets`}/>
                        </TabPanel>
                        <TabPanel value={value} index={2}>
                            <Redirect to={`${path}&status=published`}/>
                        </TabPanel>
                        <TabPanel value={value} index={3}>
                            <Redirect to={`${path}&status=pending`}/>
                        </TabPanel>
                        <TabPanel value={value} index={4}>
                            <Redirect to={`${path}&status=archived`}/>
                        </TabPanel>
                    </Grid>
                </Grid>
            </Hidden>
        </div>
    );
}

function SelectTemplateMb() {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef<HTMLButtonElement>(null);
    const [value, setValue] = React.useState('');
    const { layout } = useQuery()
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

function SelectTemplate() {
    const classes = useStyles();
    const [value, setValue] = React.useState('');
    const [state, setState] = React.useState({
        value: 30
    });
    const { layout } = useQuery()
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

export default function ActionBar() {
    const classes = useStyles();
    return (
        <div className={classes.navigation}>
            <SecondaryMenu/>
            <SelectTemplate/>
        </div>
    );
};
