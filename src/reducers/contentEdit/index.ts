import { GetProgramsAndSubjectsDocument, GetProgramsAndSubjectsQuery, GetProgramsAndSubjectsQueryVariables } from "@api/api-ko.auto";
import { apiWaitForOrganizationOfPage } from "@api/extra";
import { gqlapi } from "@api/index";
import { LoadingMetaPayload } from "@reducers/middleware/loadingMiddleware";
import { AsyncTrunkReturned } from "@reducers/type";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { grepActiveQueryResult, orderByASC } from "@utilities/dataUtilities";

interface IState {}

/*
interface RootState {
  contentEdit: IState;
}
*/

const initialState: IState = {};

export const getOptions = createAsyncThunk<[], LoadingMetaPayload>("contentEdit/getOptions", async ({ metaLoading }) => {
  const organization_id = (await apiWaitForOrganizationOfPage()) as string;
  const resp = await gqlapi.query<GetProgramsAndSubjectsQuery, GetProgramsAndSubjectsQueryVariables>({
    query: GetProgramsAndSubjectsDocument,
    variables: {
      organization_id,
    },
  });

  const data = grepActiveQueryResult<GetProgramsAndSubjectsQuery>(resp);

  const program =
    data.programsConnection?.edges?.map((item) => ({
      id: item?.node?.id || undefined,
      name: item?.node?.name || undefined,
    })) || [];

  console.log(orderByASC(program, "name"));

  return [];
});

const { reducer } = createSlice({
  name: "contentEdit",
  initialState,
  reducers: {},
  extraReducers: {
    [getOptions.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getOptions>>) => {
      console.log(payload);
    },
  },
});

export default reducer;
