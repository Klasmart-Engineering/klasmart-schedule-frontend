import { makeStyles } from "@material-ui/core";
import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import ReportPagination from "../../ReportPagination/ReportPagination";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
const ROWSPERPAGE = 100;
const useStyles = makeStyles((theme) => ({
  assetsContent: {
    height: "calc(100% - 32px)",
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
  const [page, setPage] = useState(1);
  const [numPages, setNumPages] = useState<number>(1);
  function onDocumentLoadSuccess(pdf: any) {
    setNumPages(pdf.numPages);
  }
  const num = numPages < 100 ? numPages : (page - 1) * ROWSPERPAGE + ROWSPERPAGE > numPages ? numPages - (page - 1) * ROWSPERPAGE : 100;
  return (
    <>
      <div className={css.assetsContent}>
        <Document file={props.src} onLoadSuccess={onDocumentLoadSuccess}>
          {Array.from(new Array(num), (el, index) => (
            <Page
              className={css.pageCon}
              key={`page_${index + 1 + (page - 1) * ROWSPERPAGE}`}
              pageNumber={index + 1 + (page - 1) * ROWSPERPAGE}
            />
          ))}
        </Document>
      </div>
      {numPages > ROWSPERPAGE && (
        <ReportPagination page={page} count={numPages} rowsPerPage={ROWSPERPAGE} onChangePage={(page) => setPage(page)} />
      )}
    </>
  );
}
