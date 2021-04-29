export enum Regulation {
  // 编辑模式下input初始化规则, 计算时只考虑contentDetail
  ByMilestoneDetail = "ByMilestoneDetail",
  // 新建模式下input初始化规则, 计算时需要同时考虑 contentDetail 和 下拉列表数量
  ByMilestoneDetailAndOptionCount = "ByMilestoneDetailAndOptionCount",
  // 用户修改 program 或 developmental 引起的其他input初始化规则, 计算时只考虑 下拉列表数量
  ByOptionCount = "ByOptionCount",
}
