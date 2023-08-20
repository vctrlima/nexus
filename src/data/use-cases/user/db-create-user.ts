import { Hasher } from '@/data/protocols/cryptography'
import { UserRepository } from '@/data/protocols/db'
import { CreateUser } from '@/domain/use-cases'

export class DbCreateUser implements CreateUser {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hasher: Hasher,
  ) {}

  async create(params: CreateUser.Params): Promise<CreateUser.Model> {
    params.password = await this.hasher.hash(params.password)
    return await this.userRepository.create(params)
  }
}
