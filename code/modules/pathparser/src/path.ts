import { TwoIds } from "@dbpath/dal";

export interface TableInPath {
  table: string
  fullTable?: string
  fields?: string[ ]
}
export interface LinkInPath {
  previousLink?: LinkInPath
  idEquals: TwoIds[]
}

export type PathItem = LinkInPath| TableInPath;