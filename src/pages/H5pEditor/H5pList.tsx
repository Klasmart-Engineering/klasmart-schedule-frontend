import { Box, Button, List, ListItem, makeStyles, useMediaQuery, useTheme } from "@material-ui/core";
import React from "react";
import { useHistory } from "react-router-dom";
import { ContentTypeList } from "../../api/type";

const useStyles = makeStyles(() => ({
  listItem: {
    borderBottom: "1px solid #ececec",
    position: "relative",
    "& p,h3": {
      margin: "10px 0",
    },
    paddingLeft: 0,
  },
  itemButton: {
    position: "absolute",
    top: "50%",
    right: "20px",
    transform: "translateY(-50%)",
    zIndex: 100,
  },
  imgBox: {
    // marginRight: "20px",
    height: "70px",
    "& img": {
      height: "100%",
    },
    padding: "0 10px",
  },
}));

interface H5pListProps {
  contentTypeList: ContentTypeList;
  onChange: (value: string) => any;
}

export default function H5pList(props: H5pListProps) {
  const { contentTypeList, onChange } = props;
  const css = useStyles();
  const history = useHistory();
  const { breakpoints } = useTheme();
  const sm = useMediaQuery(breakpoints.down("sm"));

  const handleClick = (item: any) => {
    console.log(`${item.id}-${item.coreApiVersionNeeded.major}.${item.coreApiVersionNeeded.minor}`);
    onChange(`${item.id}-${item.coreApiVersionNeeded.major}.${item.coreApiVersionNeeded.minor}`);
  };

  const getDetails = (e: React.KeyboardEvent | React.MouseEvent, id: string) => {
    e.stopPropagation();
    history.push(`/h5pEditor?h5p_id=${id}`);
  };

  return (
    <div>
      <List component="nav" aria-label="secondary mailbox folders">
        {/* <ListItem selected button className={css.listItem}>
          <img src={item.img} alt=""/>
        </ListItem> */}
        {contentTypeList.map((item) => {
          return (
            <ListItem key={item.id} button className={css.listItem} onClick={() => handleClick(item)}>
              <Box className={css.imgBox} style={{ height: sm ? "50px" : "70px" }}>
                <img src={item.icon} alt="aaa" />
              </Box>
              <Box style={{ width: sm ? "40%" : "80%" }}>
                <h3>{item.title}</h3>
                <p>{item.summary}</p>
              </Box>
              <Box className={css.itemButton} style={{ right: sm ? "20px" : "50px" }}>
                <Button variant="contained" color="primary" onClick={(e) => getDetails(e, item.id)}>
                  Details
                </Button>
              </Box>
            </ListItem>
          );
        })}
      </List>
    </div>
  );
}
