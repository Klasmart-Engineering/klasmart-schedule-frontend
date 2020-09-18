### 下列 api 接口被引用，需要替换

api.assessments.getAssessment = r
api.assessments.listAssessment = x
api.assessments.updateAssessment = r
api.bulk.deleteOutcomeBulk = x
api.bulkPublish.publishLearningOutcomesBulk = x
api.contents.approveContentReview = x
api.contents.createContent = r
api.contents.getContentById = r
api.contents.getLiveToken = getContentLiveToken
api.contents.lockContent = x
api.contents.publishContent = x
api.contents.rejectContentReview = x
api.contents.searchContents = r
api.contents.updateContent = r
api.contentsBulk.deleteContentBulk = x
api.contentsBulk.publishContentBulk = x
api.contentsResources.getContentResourceUploadPath = q
api.learningOutcomes.approveLearningOutcomes = z
api.learningOutcomes.createLearningOutcomes = z
api.learningOutcomes.deleteLearningOutcome = z
api.learningOutcomes.getLearningOutcomesById = z
api.learningOutcomes.lockLearningOutcomes = z
api.learningOutcomes.publishLearningOutcomes = z
api.learningOutcomes.rejectLearningOutcomes = z
api.learningOutcomes.searchLearningOutcomes = r
api.learningOutcomes.updateLearningOutcomes = x
api.schedules.createSchedule = addSchedule
api.schedules.deleteSchedule == deleteSchedule
api.schedules.getLiveToken = getScheduleLiveToken
api.schedules.getSchedulesById = getScheduleById
api.schedules.querySchedules = querySchedule
api.schedules.updateSchedule == updateSchedule
api.schedulesTimeView.schedulesTimeView = getScheduleTimeView

### 类型替换

CommonShort = j
Content = r
ContentIDListRequest = x
CreateContentRequest = r
CreateLearningOutComesRequest = z
CreateLearningOutcomesResponse = z
LearningOutcomes = z
OutcomesIDListRequest = x
Schedule = j
ScheduleCreate = EntityScheduleAddView
ScheduleDetailed = EntityScheduleDetailsView
ScheduleTimeView = EntityScheduleListView
