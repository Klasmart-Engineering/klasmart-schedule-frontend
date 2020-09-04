export enum ContentType {
  image = 6,
  video = 5,
  audio = 4,
  doc = 3,
  plan = 2,
  material = 1,
}


export enum PublishStatus {
  published = 'published',
  pending = 'pending',
  draft = 'draft',
  rejected = 'rejected',
  archive = 'archive',
  assets = 'assets',
}

export enum Author {
  self = '{self}',
}

export enum OrderBy {
  id = "id",
  _id = "-id",
  created_at = "created_at",
  _created_at = "-created_at",
  updated_at = "updated_at",
  _updated_at = "-updated_at",
  content_name =  "content_name",
  _content_name = "-content_name",
}