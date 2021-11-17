import { makeStyles } from "@material-ui/core";
import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
const useStyles = makeStyles((theme) => ({
  assetsContent: {
    height: "100%",
    width: "90%",
    overflowY: "scroll",
    overflowX: "hidden",
  },
  pageCon: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    backgroundColor: "rgb(82, 86, 89)",
    "& .react-pdf__Page__canvas": {
      marginTop: 10,
      maxWidth: "100%",
      height: "auto !important",
    },
  },
}));
interface file {
  src: string | undefined;
}

export default function AssetPdf(props: file) {
  const css = useStyles();
  const [numPages, setNumPages] = useState<number>(0);
  function onDocumentLoadSuccess(pdf: any) {
    setNumPages(pdf.numPages);
  }
  return (
    <div className={css.assetsContent}>
      <Document file={props.src} onLoadSuccess={onDocumentLoadSuccess}>
        {/* <Page pageNumber={1}/> */}
        {Array.from(new Array(numPages), (el, index) => (
          <Page className={css.pageCon} key={`page_${index + 1}`} pageNumber={index + 1} />
        ))}
      </Document>
    </div>
  );
  // return <embed  className={css.assetsContent} src={`${props.src}#toolbar=0`} />;
}
