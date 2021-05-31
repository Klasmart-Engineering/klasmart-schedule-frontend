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
  },
  pdfCon: {
    "& .react-pdf__Page__canvas": {
      width: "99.9% !important",
      height: "aut0 !important",
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
    console.log(pdf);
  }
  return (
    <div className={css.assetsContent}>
      <Document file={props.src} onLoadSuccess={onDocumentLoadSuccess}>
        {/* <Page pageNumber={1}/> */}
        {Array.from(new Array(numPages), (el, index) => (
          <Page className={css.pdfCon} key={`page_${index + 1}`} pageNumber={index + 1} />
        ))}
      </Document>
    </div>
  );
  // return <embed  className={css.assetsContent} src={`${props.src}#toolbar=0`} />;
}
