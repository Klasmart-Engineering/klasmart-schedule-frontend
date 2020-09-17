### 下列类型被引用

src/models/ModelContentDetailForm.ts:import { Content, CreateContentRequest } from "../api/api";
src/models/ModelLessonPlan.ts:import { Content } from "../api/api";
src/models/ModelOutcomeDetailForm.ts:import { LearningOutcomes } from "../api/api";
src/pages/OutcomeEdit/OutcomeForm.tsx:import { LearningOutcomes } from "../../api/api";
src/pages/Schedule/ScheduleEdit.tsx:import { CommonShort, ScheduleCreate } from "../../api/api";
src/pages/Schedule/SearchList.tsx:import { Schedule } from "../../api/api";
src/pages/OutcomeList/types/index.ts:import { OutcomesIDListRequest } from "../../../api/api";
src/pages/OutcomeList/OutcomeTable.tsx:import { LearningOutcomes } from "../../api/api";
src/pages/OutcomeList/TableList.bak:import { LearningOutcomes } from "../../api/api";
src/pages/AssesmentList/types/index.ts:import { OutcomesIDListRequest } from "../../../api/api";
src/pages/MyContentList/types/index.ts:import { ContentIDListRequest } from "../../../api/api";
src/pages/MyContentList/ContentCardList.tsx:import { Content } from "../../api/api";
src/pages/ContentEdit/index.tsx:import { LearningOutcomes } from "../../api/api";
src/pages/ContentEdit/Details.tsx:import { Content } from "../../api/api";
src/pages/ContentEdit/Outcomes.tsx:import { LearningOutcomes } from "../../api/api";
src/pages/ContentEdit/ContentHeader.tsx:import { Content } from "../../api/api";
src/pages/ContentEdit/AssetDetails.tsx:import { Content } from "../../api/api";
src/pages/ContentEdit/MediaAssets.tsx:import { Content } from "../../api/api";
src/pages/ContentEdit/MediaAssetsEdit.tsx:import { Content } from "../../api/api";
src/pages/ContentPreview/index.tsx:import { Content } from "../../api/api";
src/pages/ContentPreview/ContentPreviewHeader.tsx:import { Content } from "../../api/api";
src/pages/ContentPreview/LeaningOutcomes.tsx:import { LearningOutcomes } from "../../api/api";
src/pages/ContentPreview/Detail.tsx:import { Content } from "../../api/api";
src/reducers/schedule.ts:import { Schedule, ScheduleCreate, ScheduleDetailed, ScheduleTimeView } from "../api/api";
src/reducers/content.ts:import { Content, ContentIDListRequest, CreateContentRequest, LearningOutcomes } from "../api/api";
src/reducers/outcome.ts:import { CreateLearningOutComesRequest, CreateLearningOutcomesResponse, LearningOutcomes, OutcomesIDListRequest } from "../api/api";


### 下列api接口被引用，需要替换
api.assessments.getAssessment =
api.assessments.listAssessment =
api.assessments.updateAssessment =
api.bulk.deleteOutcomeBulk =
api.bulkPublish.publishLearningOutcomesBulk =
api.contents.approveContentReview =
api.contents.createContent =
api.contents.getContentById =
api.contents.getLiveToken =
api.contents.lockContent =
api.contents.publishContent =
api.contents.rejectContentReview =
api.contents.searchContents =
api.contents.updateContent =
api.contentsBulk.deleteContentBulk =
api.contentsBulk.publishContentBulk =
api.contentsResources.getContentResourceUploadPath =
api.learningOutcomes.approveLearningOutcomes =
api.learningOutcomes.createLearningOutcomes =
api.learningOutcomes.deleteLearningOutcome =
api.learningOutcomes.getLearningOutcomesById =
api.learningOutcomes.lockLearningOutcomes =
api.learningOutcomes.publishLearningOutcomes =
api.learningOutcomes.rejectLearningOutcomes =
api.learningOutcomes.searchLearningOutcomes =
api.learningOutcomes.updateLearningOutcomes =
api.schedules.createSchedule =
api.schedules.deleteSchedule =
api.schedules.getLiveToken =
api.schedules.getSchedulesById =
api.schedules.querySchedules =
api.schedules.updateSchedule =
api.schedulesTimeView.schedulesTimeView =


### 类型替换
CommonShort = 
Content = 
ContentIDListRequest = 
CreateContentRequest = 
CreateLearningOutComesRequest = 
CreateLearningOutcomesResponse = 
LearningOutcomes = 
OutcomesIDListRequest = 
Schedule = 
ScheduleCreate = 
ScheduleDetailed = 
ScheduleTimeView = 