
export interface Paging{
  page?: number,
  pageSize?: number,
}

export interface TwoIds {
  fromId: string,
  toId: string
}

export interface TwoIdsArray {
twoIds: TwoIds[]
}


export interface TableInPath {
  schema?: string
  table: string
  pk: string[]
  fields?: string[ ]
}
export interface LinkInPath extends TableInPath {
  previousLink: PathItem
  idEquals: TwoIds[]
}

export type PathItem = LinkInPath | TableInPath;

export function isLinkInPath ( p: PathItem ): p is LinkInPath {
  return (p as LinkInPath).previousLink !== undefined
}
export function isTableInPath ( p: PathItem ): p is TableInPath {
  return !isLinkInPath ( p )
}
