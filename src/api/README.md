### 下列 api 接口被引用，需要替换

api.assessments.getAssessment == api.assessments.getAssessment
api.assessments.listAssessment = api.assessments.listAssessment
api.assessments.updateAssessment == api.assessments.updateAssessment
api.bulk.deleteOutcomeBulk = api.bulk.deleteOutcomeBulk
api.bulkPublish.publishLearningOutcomesBulk = api.bulkPublish.publishLearningOutcomesBulk
api.contents.approveContentReview = api.contents.approveContentReview
api.contents.createContent == api.contents.createContent
api.contents.getContentById == api.contents.getContentById
api.contents.getLiveToken = getContentLiveToken
api.contents.lockContent == api.contents.lockContent
api.contents.publishContent == api.contents.publishContent
api.contents.rejectContentReview == api.contents.rejectContentReview
api.contents.searchContents == api.contents.searchContents
api.contents.updateContent == api.contents.updateContent
api.contentsBulk.deleteContentBulk == api.contentsBulk.deleteContentBulk
api.contentsBulk.publishContentBulk == api.contentsBulk.publishContentBulk
api.contentsResources.getContentResourceUploadPath = api.contentsResources.getContentResourceUploadPath
api.learningOutcomes.approveLearningOutcomes == api.learningOutcomes.approveLearningOutcomes
api.learningOutcomes.createLearningOutcomes == api.learningOutcomes.createLearningOutcomes
api.learningOutcomes.deleteLearningOutcome == api.learningOutcomes.deleteLearningOutcome
api.learningOutcomes.getLearningOutcomesById == api.learningOutcomes.getLearningOutcomesById
api.learningOutcomes.lockLearningOutcomes == api.learningOutcomes.lockLearningOutcomes
api.learningOutcomes.publishLearningOutcomes == api.learningOutcomes.publishLearningOutcomes
api.learningOutcomes.rejectLearningOutcomes == api.learningOutcomes.rejectLearningOutcomes
api.learningOutcomes.searchLearningOutcomes = api.learningOutcomes.searchLearningOutcomes
api.learningOutcomes.updateLearningOutcomes == api.learningOutcomes.updateLearningOutcomes
api.schedules.createSchedule = addSchedule
api.schedules.deleteSchedule == deleteSchedule
api.schedules.getLiveToken = getScheduleLiveToken
api.schedules.getSchedulesById = getScheduleById
api.schedules.querySchedules = querySchedule
api.schedules.updateSchedule == updateSchedule
api.schedulesTimeView.schedulesTimeView = getScheduleTimeView

### 类型替换

CommonShort = j
Content = EntityContentInfoWithDetails
ContentIDListRequest = r
CreateContentRequest = EntityCreateContentRequest
CreateLearningOutComesRequest = ApiOutcomeCreateView
CreateLearningOutcomesResponse = ApiOutcomeCreateResponse
LearningOutcomes = ApiOutcomeView
OutcomesIDListRequest = r
Schedule = j
ScheduleCreate = EntityScheduleAddView
ScheduleDetailed = EntityScheduleDetailsView
ScheduleTimeView = EntityScheduleListView
