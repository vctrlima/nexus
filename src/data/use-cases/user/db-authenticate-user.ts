import { Encrypter, HashComparer } from '@/data/protocols/cryptography'
import { UserRepository } from '@/data/protocols/db'
import { AuthenticateUser, CreateRefreshToken } from '@/domain/use-cases'
import { uuidV4 } from '@/helpers/string'
import env from '@/main/config/env'
import { AccessDeniedError } from '@/presentation/errors'

export class DbAuthenticateUser implements AuthenticateUser {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly createRefreshToken: CreateRefreshToken,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
  ) {}

  async auth(params: AuthenticateUser.Params): Promise<AuthenticateUser.Model> {
    const user = await this.userRepository.findByEmail(params.email)
    if (!user) throw new AccessDeniedError()
    const isValid = await this.hashComparer.compare(
      params.password,
      user.password,
    )
    if (!isValid || !user.id) throw new AccessDeniedError()
    const accessToken = await this.encrypter.encrypt({
      plainText: user.id,
      secret: env.jwtAccessTokenSecret,
    })
    const jti = uuidV4()
    const refreshToken = await this.encrypter.encrypt({
      plainText: user.id,
      secret: env.jwtRefreshTokenSecret,
      expiresIn: '7d',
      jti,
    })
    await this.createRefreshToken.create({
      jti,
      refreshToken,
      userId: user.id,
    })
    return {
      accessToken,
      refreshToken,
      user: { id: user.id, email: user.email, name: user.name },
    }
  }
}
