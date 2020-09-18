### 下列 api 接口被引用，需要替换

api.assessments.getAssessment == api.assessments.getAssessment
api.assessments.listAssessment = x
api.assessments.updateAssessment == api.assessments.updateAssessment
api.bulk.deleteOutcomeBulk = x
api.bulkPublish.publishLearningOutcomesBulk = x
api.contents.approveContentReview = x
api.contents.createContent == api.contents.createContent
api.contents.getContentById == api.contents.getContentById
api.contents.getLiveToken = j
api.contents.lockContent = x
api.contents.publishContent = x
api.contents.rejectContentReview = x
api.contents.searchContents == api.contents.searchContents
api.contents.updateContent == api.contents.updateContent
api.contentsBulk.deleteContentBulk = x
api.contentsBulk.publishContentBulk = x
api.contentsResources.getContentResourceUploadPath = api.contentsResources.getContentResourceUploadPath
api.learningOutcomes.approveLearningOutcomes = z
api.learningOutcomes.createLearningOutcomes = z
api.learningOutcomes.deleteLearningOutcome = z
api.learningOutcomes.getLearningOutcomesById = z
api.learningOutcomes.lockLearningOutcomes = z
api.learningOutcomes.publishLearningOutcomes = z
api.learningOutcomes.rejectLearningOutcomes = z
api.learningOutcomes.searchLearningOutcomes == api.learningOutcomes.searchLearningOutcomes
api.learningOutcomes.updateLearningOutcomes = x
api.schedules.createSchedule = j
api.schedules.deleteSchedule = j
api.schedules.getLiveToken = j
api.schedules.getSchedulesById = j
api.schedules.querySchedules = j
api.schedules.updateSchedule = j
api.schedulesTimeView.schedulesTimeView = j

### 类型替换

CommonShort = j
Content = EntityContentInfoWithDetails
ContentIDListRequest = x
CreateContentRequest = EntityCreateContentRequest
CreateLearningOutComesRequest = z
CreateLearningOutcomesResponse = z
LearningOutcomes = z
OutcomesIDListRequest = x
Schedule = j
ScheduleCreate = j
ScheduleDetailed = j
ScheduleTimeView = j
