import rightArrow from "@assets/icons/rightArrow.svg";
import { Icon, Link, makeStyles } from "@material-ui/core";
import { CSSProperties } from "react";
import { Link as RouterLink } from "react-router-dom";

interface Props extends CSSProperties {
  to: string;
  text: string;
}
const useStyles = makeStyles(() => ({
  reportBottom: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "73%",
    height: "33px",
    margin: "0 auto",
    color: "#fff",
    boxSizing: "border-box",
    cursor: "pointer",
    fontWeight: "bold",
    "& > a": {
      width: "100%",
      color: "#fff",
      fontSize: 14,
      fontWeight: 600,
      padding: 7,
      paddingLeft: 14,
      paddingRight: 14,
      textDecoration: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      borderRadius: "10px",
      backgroundColor: "#6D8199",
      "&:hover": {
        backgroundColor: "#556577",
        textDecorationLine: "none",
      },
    },
  },
  rightIcon: {
    width: 10,
    height: 16,
  },
  rightIconImg: {
    width: 10,
    height: 11,
  },
}));

export default function BottomButton(props: Props) {
  const css = useStyles();
  const { text, to, ...style } = props;

  return (
    <div className={css.reportBottom} style={style}>
      <Link component={RouterLink} to={to}>
        {text}
        <Icon fontSize="inherit" classes={{ root: css.rightIcon }}>
          <img alt="" className={css.rightIconImg} src={rightArrow} />
        </Icon>
      </Link>
    </div>
  );
}
