import React, { ReactNode } from "react";
import {
  makeStyles,
  Box,
  Typography,
  IconButton,
  TextField,
  MenuItem,
  useTheme,
  useMediaQuery,
  Paper,
} from "@material-ui/core";
import { ArrowBackIosOutlined, Search } from "@material-ui/icons";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
  title: {
    marginRight: "auto",
    fontSize: 18,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchField: {
    flexGrow: 2,
    flexShrink: 0.5,
  },
  fieldset: {
    minWidth: 110,
    "&:not(:first-child)": {
      marginLeft: 16,
    },
  },
}));

export function MediaAssetsLibraryHeader() {
  const css = useStyles();
  return (
    <Box px={3} py={2.5}>
      <Box display="flex">
        <Typography className={css.title} variant="h6">
          Media Assets Library
        </Typography>
        <IconButton size="small">
          <ArrowBackIosOutlined fontSize="small" />
        </IconButton>
      </Box>
      <Box display="flex" pt={2.5}>
        <TextField
          fullWidth
          size="small"
          className={clsx(css.fieldset, css.searchField)}
          placeholder="Search"
          InputProps={{ startAdornment: <Search className={css.searchIcon} /> }}
        />
        <TextField
          fullWidth
          size="small"
          className={css.fieldset}
          select
          label="Type"
        >
          <MenuItem>Organization</MenuItem>
          <MenuItem>School</MenuItem>
        </TextField>
        <TextField
          fullWidth
          size="small"
          className={css.fieldset}
          select
          label="Category"
        >
          <MenuItem>Organization</MenuItem>
          <MenuItem>School</MenuItem>
        </TextField>
      </Box>
    </Box>
  );
}

interface MediaAssetsLibraryProps {
  children: ReactNode;
}
export function MediaAssetsLibrary(props: MediaAssetsLibraryProps) {
  const { breakpoints } = useTheme();
  const sm = useMediaQuery(breakpoints.down("sm"));
  return <Paper elevation={sm ? 0 : 3}>{props.children}</Paper>;
}
