import { Accordion, AccordionDetails, AccordionSummary, Backdrop, Grid, IconButton, InputBase, makeStyles, Paper } from "@material-ui/core";
import { ArrowBack, ArrowForward, Close, ExpandMore, Search } from "@material-ui/icons";
import clsx from "clsx";
import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import { ContentTypeList } from "../../api/type";
import { reportMiss } from "../../locale/LocaleManager";

const useStyles = makeStyles((theme) => ({
  infoContainer: {
    paddingBottom: "20px",
    paddingLeft: "20px",
    paddingRight: "20px",
  },
  searchBox: {
    width: "100%",
    padding: "5px 20px 5px 20px",
    // paddingLeft: '20px',
    marginTop: "20px",
    border: "2px solid #eee",
    boxShadow: "none",
    borderRadius: "20px",
    position: "relative",
    marginBottom: "10px",
  },
  searchInput: {
    width: "90%",
    fontSize: "20px",
  },
  searchButton: {
    position: "absolute",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
  },
  backArrow: {
    cursor: "pointer",
  },
  imgBox: {
    position: "relative",
  },
  image: {
    width: "70%",
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    [theme.breakpoints.down("sm")]: {
      width: "200px",
    },
  },
  demo: {
    textDecoration: "none",
    display: "inline-block",
    padding: "8px 18px",
    backgroundColor: "#f3f3f3",
    borderRadius: "20px",
    fontWeight: 500,
    width: "auto",
    fontSize: "16px",
  },
  outerBox: {
    width: "100%",
    position: "relative",
  },
  navBox: {
    width: "90%",
    overflow: "hidden",
    padding: "40px 0",
    boxSizing: "content-box",
    marginLeft: "5%",
  },
  imagesContainer: {
    width: "200%",
    flexWrap: "nowrap",
    overflow: "hidden",
    transition: "0.5s",
  },
  itemImageBox: {
    // padding: '5px',
    "& img": {
      maxWidth: "95%",
      border: "1px solid #ced6e3",
    },
    width: "12.5%",
    cursor: "pointer",
  },
  arrowCommon: {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#fff",
    backgroundColor: "rgba(105,117,133,.8)",
    borderRadius: "50%",
    cursor: "pointer",
  },
  arrowPrev: {
    left: "10px",
    [theme.breakpoints.down("sm")]: {
      left: "-1%",
      width: "20px",
      height: "20px",
    },
  },
  arrowNext: {
    right: "10px",
    [theme.breakpoints.down("sm")]: {
      right: "-1%",
      width: "20px",
      height: "20px",
    },
  },
  license: {},
  sectionSummary: () => ({
    fontSize: 16,
    fontWeight: "bold",
    flexDirection: "row-reverse",
    backgroundColor: "rgb(243, 243, 243)",
    textIndent: 8,
    color: theme.palette.text.primary,
  }),
  licenseItem: {
    marginBottom: "10px",
  },
  dialogImage: {
    width: "100%",
  },
  arrowPrevDialog: {
    left: "-50px",
  },
  arrowNextDialog: {
    right: "50px",
  },
  dialogContainer: {
    position: "relative",
  },
  dialogPrev: {
    position: "absolute",
    top: "50%",
    left: "-50px",
    transform: "translateY(-50%)",
    zIndex: 666,
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  dialogImageBox: {
    position: "relative",
    textAlign: "center",
    width: "60%",

    [theme.breakpoints.down("md")]: {
      width: "80%",
    },
  },
  dialogCommonButton: {
    position: "absolute",
    width: "35px",
    height: "35px",
    borderRadius: "50%",
    backgroundColor: "rgba(132,143,158,.8)",
    cursor: "pointer",
  },
  closeButton: {
    right: "-50px",
    top: "-50px",
  },
  leftButton: {
    left: "-100px",
    top: "50%",
    transform: "translateY(-50)",
  },
  rightButton: {
    right: "-100px",
    top: "50%",
    transform: "translateY(-50)",
  },
  imageCount: {
    position: "absolute",
    textAlign: "center",
    left: "50%",
    bottom: "-50px",
    transform: "translateX(-50%)",
    fontSize: "18px",
  },
}));

interface H5pInfoProps {
  contentTypeList: ContentTypeList;
}

export default function H5pInfo(props: H5pInfoProps) {
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const h5p_id = query.get("h5p_id") || undefined;
  const { contentTypeList } = props;
  const h5pInfo = contentTypeList.filter((item) => item.id === h5p_id)[0];
  console.log(h5pInfo);
  const css = useStyles();
  const history = useHistory();
  const [leftPosition, setLeftPosition] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const goBack = () => {
    history.go(-1);
  };

  const prevImage = () => {
    if (leftPosition === 0) return;
    setLeftPosition(leftPosition + 25);
  };

  const nextImage = () => {
    if (leftPosition === -25 * (h5pInfo.screenshots.length - 4) || h5pInfo.screenshots.length <= 4) return;
    setLeftPosition(leftPosition - 25);
  };

  const getLicenseContent = () => {
    let result: any[] = [];
    const keys = Object.keys(h5pInfo.license.attributes);
    const values = Object.values(h5pInfo.license.attributes);
    result = keys
      .map((item, index) => {
        return {
          [item]: values[index],
        };
      })
      .filter((item1, index1) => item1[keys[index1]])
      .map((item2, index2) => {
        return Object.keys(item2)[0];
      });
    return result;
  };

  const handleClose = () => {
    setOpen(false);
  };

  const showDialog = (index: number) => {
    setCurrentIndex(index);
    setOpen(true);
  };

  const dialogPrev = () => {
    if (currentIndex === 0) return;
    setCurrentIndex(currentIndex - 1);
  };

  const dialogNext = () => {
    if (currentIndex === h5pInfo.screenshots.length - 1) return;
    setCurrentIndex(currentIndex + 1);
  };

  return (
    <div className={css.infoContainer}>
      <Grid container style={{ width: "98%" }}>
        <Paper className={css.searchBox}>
          <InputBase
            placeholder="Search for Content Types"
            inputProps={{ "aria-label": "search for Content Types" }}
            className={css.searchInput}
          />
          <IconButton className={css.searchButton} type="submit" aria-label="search">
            <Search />
          </IconButton>
        </Paper>
      </Grid>
      <div>
        <ArrowBack fontSize="large" className={css.backArrow} onClick={goBack} />
      </div>
      <Grid container>
        <Grid item xs={4} sm={3} md={3} lg={3} xl={3} className={css.imgBox}>
          <img src={h5pInfo.icon} alt="" className={css.image} />
        </Grid>
        <Grid item xs={8} sm={8} md={8} lg={8} xl={8}>
          <h2>{h5pInfo.title}</h2>
          <div>{h5pInfo.owner}</div>
          <p>{h5pInfo.description}</p>
          <a href={h5pInfo.example} className={css.demo} target="_blank" rel="noopener noreferrer">
            {reportMiss("Content Demo", "h5p_content_demo")}
          </a>
        </Grid>
      </Grid>
      <div className={css.outerBox}>
        <div className={css.navBox}>
          <Grid container className={css.imagesContainer} style={{ marginLeft: `${leftPosition}%` }}>
            {h5pInfo.screenshots.map((item, index) => {
              return (
                <Grid item key={item.url} className={css.itemImageBox} onClick={() => showDialog(index)}>
                  <img src={item.url} alt="" />
                </Grid>
              );
            })}
          </Grid>
        </div>
        <div>
          <ArrowBack
            fontSize="large"
            className={clsx(css.arrowPrev, css.arrowCommon)}
            onClick={prevImage}
            style={{ cursor: leftPosition === 0 ? "not-allowed" : "pointer" }}
          />
        </div>
        <div>
          <ArrowForward
            fontSize="large"
            className={clsx(css.arrowNext, css.arrowCommon)}
            onClick={nextImage}
            style={{
              cursor:
                leftPosition === -25 * (h5pInfo.screenshots.length - 4) || h5pInfo.screenshots.length <= 4 ? "not-allowed" : "pointer",
            }}
          />
        </div>
      </div>
      <div className={css.license}>
        <Accordion defaultExpanded={false}>
          <AccordionSummary expandIcon={<ExpandMore />} classes={{ root: css.sectionSummary }}>
            {reportMiss("License", "h5p_license")}
          </AccordionSummary>
          <AccordionDetails>
            <ul>
              {getLicenseContent().map((item) => {
                return (
                  <li key={item} className={css.licenseItem}>
                    {item}
                  </li>
                );
              })}
            </ul>
          </AccordionDetails>
        </Accordion>
      </div>
      <div>
        <Backdrop className={css.backdrop} open={open}>
          <div className={css.dialogImageBox}>
            <img src={h5pInfo.screenshots[currentIndex].url} alt="" className={css.dialogImage} />
            <div className={clsx(css.closeButton, css.dialogCommonButton)} onClick={handleClose}>
              <Close fontSize="large" />
            </div>
            <div
              className={clsx(css.leftButton, css.dialogCommonButton)}
              onClick={dialogPrev}
              style={{ cursor: currentIndex === 0 ? "not-allowed" : "pointer" }}
            >
              <ArrowBack fontSize="large" />
            </div>
            <div
              className={clsx(css.rightButton, css.dialogCommonButton)}
              onClick={dialogNext}
              style={{ cursor: currentIndex === h5pInfo.screenshots.length - 1 ? "not-allowed" : "pointer" }}
            >
              <ArrowForward fontSize="large" />
            </div>
            <p className={css.imageCount}>
              {currentIndex + 1} / {h5pInfo.screenshots.length}
            </p>
          </div>
        </Backdrop>
      </div>
    </div>
  );
}
