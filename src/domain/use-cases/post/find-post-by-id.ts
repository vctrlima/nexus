import { Post } from '@/domain/entities'

export interface FindPostById {
  find: (id: FindPostById.Params) => Promise<FindPostById.Model>
}

export namespace FindPostById {
  export type Params = string
  export type Model = Post
}