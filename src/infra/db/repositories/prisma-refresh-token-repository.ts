import { RefreshTokenRepository } from '@/data/protocols/db'
import { RefreshToken } from '@/domain/entities'
import { CreateRefreshToken } from '@/domain/use-cases'
import { ServerError } from '@/presentation/errors'
import { PrismaClient } from '@prisma/client'

export class PrismaRefreshTokenRepository implements RefreshTokenRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(params: CreateRefreshToken.Params): Promise<RefreshToken> {
    const { id, hashedToken, revoked } = await this.prisma.refreshToken.create({
      data: {
        id: params.jti,
        hashedToken: params.refreshToken,
        userId: params.userId,
      },
    })
    return new RefreshToken({ id, hashedToken, revoked })
  }

  async findById(id: string): Promise<RefreshToken> {
    const refreshToken = await this.prisma.refreshToken.findUnique({
      where: { id },
      include: { user: true },
    })
    if (!refreshToken) throw new ServerError('Refresh Token not found')
    return new RefreshToken({
      id: refreshToken.id,
      hashedToken: refreshToken.hashedToken,
      revoked: refreshToken.revoked,
      user: refreshToken.user,
    })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.refreshToken.delete({ where: { id } })
  }

  async revokeByUserId(userId: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { userId },
      data: { revoked: true },
    })
  }
}
