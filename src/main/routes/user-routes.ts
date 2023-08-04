import { adaptRoute } from '@/main/adapters'
import {
  makeCreateUserController,
  makeFindUserByIdController,
} from '@/main/factories/controllers'
import { Router } from 'express'

export default (router: Router) => {
  router.post('/user', adaptRoute(makeCreateUserController()))
  router.get('/user/:id', adaptRoute(makeFindUserByIdController()))
}
