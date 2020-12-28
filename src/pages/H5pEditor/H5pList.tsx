import { Box, Button, List, ListItem, makeStyles } from "@material-ui/core";
import React from "react";
import { ContentTypeList } from "../../api/type";

const useStyles = makeStyles(() => ({
  listItem: {
    borderBottom: "1px solid #ececec",
    position: "relative",
    "& p,h3": {
      margin: "10px 0",
    },
  },
  itemButton: {
    position: "absolute",
    top: "50%",
    right: "50px",
    transform: "translateY(-50%)",
    zIndex: 100,
  },
  imgBox: {
    marginRight: "20px",
    height: "70px",
    "& img": {
      height: "100%",
    },
  },
}));

interface H5pListProps {
  contentTypeList: ContentTypeList;
  onChange: (value: string) => any;
}

export default function H5pList(props: H5pListProps) {
  const { contentTypeList, onChange } = props;
  const css = useStyles();
  console.log(contentTypeList);

  const handleClick = (item: any) => {
    console.log(`${item.id}-${item.coreApiVersionNeeded.major}.${item.coreApiVersionNeeded.minor}`);
    onChange(`${item.id}-${item.coreApiVersionNeeded.major}.${item.coreApiVersionNeeded.minor}`);
  };

  const getDetails = (e: any) => {
    e.stopPropagation();
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
              <Box className={css.imgBox}>
                <img src={item.icon} alt="aaa" />
              </Box>
              <Box>
                <h3>{item.title}</h3>
                <p>{item.summary}</p>
              </Box>
              <Box className={css.itemButton}>
                <Button variant="contained" color="primary" onClick={(e) => getDetails(e)}>
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
