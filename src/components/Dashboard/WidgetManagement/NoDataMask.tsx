import { createStyles, makeStyles } from "@mui/styles";
import React from "react";
import { Button } from "@material-ui/core";
import clsx from "clsx";

interface LightProps {
  className: string;
}
export function Light({ className }: LightProps) {
  return (
    <svg className={className} width="15" height="21" viewBox="0 0 15 21" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M14.9856 7.0753C14.9783 6.68911 14.9203 6.30292 14.8333 5.92402C14.6086 4.88932 14.1881 3.94206 13.5646 3.09682C12.5134 1.66864 11.1286 0.714095 9.41767 0.255038C9.06242 0.160312 8.69993 0.094733 8.33019 0.0582999C8.19244 0.0437267 8.04744 0.0364401 7.90969 0.0218669C7.88794 0.0218669 7.85894 0.0145803 7.83719 0.0072937C7.62695 0.0072937 7.40945 0.0072937 7.1992 0.0072937C7.17021 0.0145803 7.14121 0.0218669 7.11221 0.0218669C6.94546 0.0364401 6.78596 0.0437267 6.61921 0.0655866C6.32922 0.0874464 6.03197 0.145739 5.74198 0.218605C4.437 0.539216 3.29877 1.16586 2.32729 2.09855C1.27605 3.11139 0.580065 4.33554 0.23207 5.75643C0.145072 6.09161 0.0943228 6.42679 0.0580734 6.76927C0.0435736 6.87856 0.0435736 6.99515 0.0363237 7.10445C0.0363237 7.16274 0.0290739 7.21375 0.00732422 7.26475C0.00732422 7.44692 0.00732422 7.6218 0.00732422 7.80396C0.0290739 7.85497 0.0363237 7.90598 0.0363237 7.95698C0.130572 9.53089 0.659813 10.9372 1.62405 12.1759C2.50128 13.3054 3.31327 14.4785 4.03826 15.7099C4.05276 15.7318 4.29925 16.4022 4.31375 16.424C6.60471 16.424 8.38093 16.424 10.6719 16.424C10.6864 16.3949 10.9909 15.7318 11.0054 15.7026C11.5491 14.7845 12.1364 13.8883 12.7671 13.0285C12.9701 12.7443 13.1876 12.4674 13.3979 12.1905C14.0141 11.4035 14.4636 10.5292 14.7391 9.56003C14.8406 9.20299 14.9131 8.83866 14.9566 8.46704C14.9783 8.30674 14.9928 8.15372 14.9928 7.99341C14.9928 7.96427 15.0001 7.93512 15.0073 7.89869C15.0073 7.65094 15.0073 7.4032 15.0073 7.15545C14.9928 7.13359 14.9856 7.10445 14.9856 7.0753Z"
        fill="#FFE551"
      />
      <path
        d="M9.2219 21H5.7782C5.19096 21 4.68347 20.5847 4.56748 20.009L3.88599 15.4767H11.1431L10.4326 20.009C10.3166 20.5847 9.80914 21 9.2219 21Z"
        fill="#CCCCCC"
      />
    </svg>
  );
}

/** style **/
const useStyles = makeStyles(() =>
  createStyles({
    noDataContent: {
      position: `absolute`,
      width: `100%`,
      height: `calc(100% - 40px)`,
      bottom: 0,
      left: 0,
      // background: "rgba(0, 0, 0, 0.05)",
      borderRadius: `12px`,
      overflow: `hidden`,
    },
    noData: {
      boxSizing: "border-box",
      position: "absolute",
      bottom: 0,
      right: 0,
      width: 343,
      height: 100,
      background: "#FFFFFF",
      borderRadius: "40px 0px 12px 0",
      padding: "28px 30px",
      boxShadow: "0 0 12px #D4D4D4",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      "& .noDataLabel": {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      },
      "& .noDataText": {
        fontSize: 16,
        wordBreak: "break-word",
      },
      "& .noDataIcon": {
        width: 18,
        marginRight: 12,
        flex: "none",
      },
      "& .noDataBtn": {
        background: "#5A86EE",
        boxShadow: "none",
        borderRadius: 8,
        color: "#FFFFFF",
        height: 40,
        boxSizing: "border-box",
        marginTop: 10,
        fontSize: 14,
        textTransform: "none",
        wordBreak: "break-word",
        maxWidth: "100%",
        "&:hover": {
          background: "rgb(22, 33, 59)",
          boxShadow: "none",
        },
      },
    },
  })
);

interface NoDataMaskProps {
  text: string | React.ReactNode;
  noDataClassName?: string;
  noDataStyle?: React.CSSProperties;
  btnText?: string;
  onClickBtn?: React.MouseEventHandler<HTMLButtonElement>;
}
export default function NoDataMask({ text, noDataStyle, noDataClassName, btnText, onClickBtn }: NoDataMaskProps) {
  const classes = useStyles();

  return (
    <div className={classes.noDataContent}>
      <div className={clsx(classes.noData, noDataClassName)} style={noDataStyle}>
        <div className={"noDataLabel"}>
          <Light className={"noDataIcon"} />
          <div className={"noDataText"}>{text}</div>
        </div>
        {btnText && (
          <Button className="noDataBtn" variant="contained" onClick={onClickBtn}>
            {btnText}
          </Button>
        )}
      </div>
    </div>
  );
}
