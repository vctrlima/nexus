import { HandleRefreshToken } from '@/domain/use-cases'
import { MissingParamError } from '@/presentation/errors'
import { badRequest, ok, serverError } from '@/presentation/helpers'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'

export class HandleRefreshTokenController implements Controller {
  constructor(private readonly handleRefreshToken: HandleRefreshToken) {}

  async handle(
    request: HttpRequest<HandleRefreshToken.Params>,
  ): Promise<HttpResponse<HandleRefreshToken.Model>> {
    try {
      if (!request.body) return badRequest(new MissingParamError('body'))
      const { refreshToken } = request.body
      if (!refreshToken) {
        return badRequest(new MissingParamError('refreshToken'))
      }
      const credentials = await this.handleRefreshToken.handle({ refreshToken })
      return ok(credentials)
    } catch (error) {
      return serverError(error)
    }
  }
}
