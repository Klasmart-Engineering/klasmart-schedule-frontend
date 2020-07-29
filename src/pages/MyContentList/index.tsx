import React from 'react';
import { useLocation } from 'react-router-dom';
import CardList from './CardList';
import TableList from './TableList';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import {Grid} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import {ViewQuiltOutlined, ViewListOutlined, PermMediaOutlined, HourglassEmptyOutlined, ArchiveOutlined, PublishOutlined, DescriptionOutlined, Search} from '@material-ui/icons';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import InputBase from '@material-ui/core/InputBase';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { Link } from 'react-router-dom';

const useLayout = () => {
  const { search } = useLocation();
  return (new URLSearchParams(search)).get('layout') || 'card';
}

const useStatus = () => {
  const { search } = useLocation();
  return (new URLSearchParams(search)).get('status') || 'content';
}

const usePath = () => {
  const { search, pathname } = useLocation();
  return pathname + search
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
    borderRadius: '23px',
    height: '40px',
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
    fontSize: '14px',
    fontWeight: 'bold'
  },
  searchBtn: {
    height: '40px',
    backgroundColor: '#0E78D5',
    marginLeft: '20px'
  },
  formControl: {
    minWidth: 120,
    marginLeft: '20px'
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  switch: {
    marginRight: '22px'
  },
  navigation: {
    padding: '30px 80px 0px 80px'
  },
  searchText: {
    width: '260px'
  },
  actives: {
    color: '#0E78D5'
  }
}));

const handleSubmit = (path:string)=> {
  console.log(path)
}

function SelectTemplate(props:any) {
  const classes = useStyles();
  const [value, setValue] = React.useState('');
  const [state, setState] = React.useState({
    value: 30
  });
  const layout = useLayout();
  const handleChange = (event:any) => {
    setValue(event.target.value);
  };
  return (
      <div className={classes.root}>
        <Grid container spacing={3}>
          <Grid item xs={8}>
            <TextField
                id="outlined-multiline-flexible"
                className={classes.searchText}
                label="Search"
                multiline
                rowsMax={4}
                value={value}
                onChange={handleChange}
                variant="outlined"
                size="small"
            />
            <Button variant="contained" color="primary" className={classes.searchBtn}>
              <Search /> Search
            </Button>
            <FormControl variant="outlined" className={classes.formControl}>
              <NativeSelect
                  id="demo-customized-select-native"
                  value={state.value}
                  onChange={handleChange}
                  input={<BootstrapInput />}
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
              item xs={4}>
            <ButtonGroup aria-label="outlined primary button group" className={classes.switch}>
                <Button variant="contained" color={layout === 'card' ? 'default' : 'primary'} href='#/my-content-list?layout=list'><ViewListOutlined /></Button>
                <Button variant="contained" color={layout === 'card' ? 'primary' : 'default'} href='#/my-content-card?layout=card'><ViewQuiltOutlined /></Button>
            </ButtonGroup>
          </Grid>
        </Grid>
      </div>
  );
}

function SecondaryMenu(props:any) {
  const classes = useStyles();
  const status = useStatus()
  const path = usePath()
  return (
      <div className={classes.root}>
        <Grid container spacing={3}>
          <Grid item xs={8}>
            <Button variant="contained" color="primary" className={classes.createBtn}>
              Create +
            </Button>
          </Grid>
          <Grid
              container
              direction="row"
              justify="space-evenly"
              alignItems="center"
              item xs={4}>
              <div className={`${classes.nav} ${status === 'content' ?classes.actives :'' }`}><DescriptionOutlined className={classes.navIcon} /> <span className={classes.navTitle}>My Content</span></div>
              <div className={`${classes.nav} ${status === 'assets' ?classes.actives :'' }`}><PermMediaOutlined className={classes.navIcon} /> <span className={classes.navTitle}>Assets</span></div>
              <div className={`${classes.nav} ${status === 'publishes' ?classes.actives :'' }`}><PublishOutlined className={classes.navIcon} /> <span className={classes.navTitle}>Published</span></div>
              <div className={`${classes.nav} ${status === 'pending' ?classes.actives :'' }`}><HourglassEmptyOutlined className={classes.navIcon} /> <span className={classes.navTitle}>Pending</span></div>
              <div className={`${classes.nav} ${status === 'archived' ?classes.actives :'' }`}><ArchiveOutlined className={classes.navIcon} /> <span className={classes.navTitle}>Archived</span></div>
          </Grid>
        </Grid>
      </div>
  );
}

export default function MyContentList() {
  const layout = useLayout();
  const classes = useStyles();
  return (
      <div>
        <div className={classes.navigation}>
          <SecondaryMenu />
          <SelectTemplate />
        </div>
        {layout === 'card' ? <CardList /> : <TableList />}
      </div>
  )
}
