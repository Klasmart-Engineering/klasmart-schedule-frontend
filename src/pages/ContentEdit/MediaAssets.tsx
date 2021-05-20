import { Box, makeStyles, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import React, { useCallback } from "react";
import { useDrag } from "react-dnd";
import { useParams } from "react-router-dom";
import { EntityContentInfoWithDetails } from "../../api/api.auto";
import { apiIsEnableNewH5p } from "../../api/extra";
import { ContentFileType } from "../../api/type";
import { SearchcmsList, SearchItems } from "../../components/SearchcmsList";
import { Thumbnail } from "../../components/Thumbnail";
import { comingsoonTip, resultsTip } from "../../components/TipImages";
import { d } from "../../locale/LocaleManager";

const useStyles = makeStyles(({ breakpoints }) => ({
  mediaAssets: {
    minHeight: 900,
    [breakpoints.down("sm")]: {
      minHeight: 698,
    },
  },
  assetImage: {
    width: 104,
    height: 64,
  },
  tableContainer: {
    marginTop: 5,
    maxHeight: 700,
    marginBottom: 20,
  },
  table: {
    minWidth: 700 - 162,
  },
  tableHead: {
    backgroundColor: "#F2F5F7",
  },
  cellThumnbnail: {
    width: 135,
  },
  cellAction: {
    width: 162,
  },
  pagination: {
    marginBottom: 20,
  },
  paginationUl: {
    justifyContent: "center",
  },
  emptyContainer: {
    textAlign: "center",
  },
}));

interface Asset {
  status: string;
  type: string;
  name: string;
  img: string;
  fileType: string;
  developmental: string;
  skills: string;
  age: string;
  created: string;
  author: string;
}

interface mockAsset {
  type: string;
  name: string;
  developmental: string;
  img: string;
  fileType: string;
  skills: string;
  age: string;
  settings: string;
  status: string;
  created: string;
  author: string;
  action: string;
}

interface DraggableItemProps {
  type: string;
  item: EntityContentInfoWithDetails;
  lesson?: "assets" | "material" | "plan";
  permission: boolean;
}
function DraggableImage(props: DraggableItemProps) {
  const { type, item, lesson, permission } = props;
  const css = useStyles();
  const [, dragRef] = useDrag({ item: { type, data: item }, canDrag: () => permission });
  const contentType =
    lesson === "material"
      ? item.content_type && Number(item.content_type * 10 + (item.data && (JSON.parse(item.data).file_type || 1)))
      : item.content_type;
  return <Thumbnail key={item.id} ref={dragRef} className={css.assetImage} alt="pic" id={item.thumbnail} type={contentType} />;
}

export interface MediaAssetsProps {
  list: EntityContentInfoWithDetails[];
  total: number;
  amountPerPage?: number;
  comingsoon?: boolean;
  value?: string;
  onSearch: (query: SearchItems) => any;
  onChangePage: (page: number) => any;
  mediaPage: number;
  isShare?: string;
  permission: boolean;
}
export default function MediaAssets(props: MediaAssetsProps) {
  const { lesson } = useParams();
  const css = useStyles();
  const { list, comingsoon, value, onSearch, total, onChangePage, mediaPage, isShare, permission } = props;
  const amountPerPage = props.amountPerPage ?? 10;
  const handChangePage = useCallback(
    (event: object, page: number) => {
      onChangePage(page);
    },
    [onChangePage]
  );
  const rows = list?.map((item, idx) => {
    const fileType: ContentFileType = item.data && JSON.parse(item.data)?.file_type;
    const dragType = apiIsEnableNewH5p() && lesson === "material" ? `LIBRARY_ITEM_FILE_TYPE_${fileType}` : "LIBRARY_ITEM";
    return (
      <TableRow key={idx}>
        <TableCell className={css.cellThumnbnail}>
          <DraggableImage type={dragType} item={item} lesson={lesson} permission={permission} />
        </TableCell>
        <TableCell>{item.name}</TableCell>
        <TableCell>{item.author_name}</TableCell>
        {/* <TableCell className={css.cellAction}>
        <Button color="primary" variant="contained">
          Select
        </Button>
      </TableCell> */}
      </TableRow>
    );
  });
  const table = (
    <>
      <TableContainer className={css.tableContainer}>
        <Table className={css.table} stickyHeader>
          <TableHead className={css.tableHead}>
            <TableRow>
              <TableCell className={css.cellThumnbnail}>{d("Thumbnail").t("library_label_thumbnail")}</TableCell>
              <TableCell>
                {lesson === "plan" ? d("Material Name").t("library_label_material_name") : d("Asset Name").t("library_label_asset_name")}
              </TableCell>
              <TableCell>{d("Author").t("library_label_author")}</TableCell>
              {/* <TableCell className={css.cellAction}>{d("Actions").t('assess_label_actions')}</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>{rows}</TableBody>
        </Table>
      </TableContainer>
      <Pagination
        page={mediaPage}
        className={css.pagination}
        classes={{ ul: css.paginationUl }}
        onChange={handChangePage}
        count={Math.ceil(total / amountPerPage)}
        color="primary"
      />
    </>
  );
  return (
    <Box className={css.mediaAssets} display="flex" flexDirection="column" alignItems="center">
      {comingsoon && lesson !== "plan" ? (
        comingsoonTip
      ) : (
        <Box width="100%">
          <SearchcmsList searchType="searchMedia" onSearch={onSearch} value={value} lesson={lesson} isShare={isShare} />
          {list.length > 0 ? table : resultsTip}
        </Box>
      )}
    </Box>
  );
}
