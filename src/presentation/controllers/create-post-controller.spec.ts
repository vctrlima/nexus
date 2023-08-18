import { CreatePost, FindPostById } from '@/domain/use-cases'
import { created, serverError } from '@/presentation/helpers'
import { HttpRequest } from '@/presentation/protocols'
import { faker } from '@faker-js/faker'
import { CreatePostController } from './create-post-controller'

const createPostMock = (): CreatePost => ({
  create: jest.fn(),
})

const findPostByIdMock = (): FindPostById => ({
  find: jest.fn(),
})

describe('CreatePostController', () => {
  let createPost: CreatePost
  let findPostById: FindPostById
  let createPostController: CreatePostController

  beforeEach(() => {
    createPost = createPostMock()
    findPostById = findPostByIdMock()
    createPostController = new CreatePostController(createPost, findPostById)
  })

  it('should create a new post and return 201 Created', async () => {
    const createParams: CreatePost.Params = {
      title: faker.lorem.words(),
      content: faker.lorem.words(),
      published: false,
      author: { id: faker.string.uuid() },
    }
    const createdPost = { id: 'abc123' }
    jest
      .spyOn(createPost, 'create')
      .mockImplementationOnce(async () => createdPost)
    const foundPost: FindPostById.Model = {
      id: faker.string.uuid(),
      title: faker.lorem.words(),
      content: faker.lorem.words(),
      published: false,
      author: {
        id: faker.string.uuid(),
        email: faker.internet.email(),
        name: faker.person.fullName(),
      },
    }
    jest
      .spyOn(findPostById, 'find')
      .mockImplementationOnce(async () => foundPost)
    const request: HttpRequest<CreatePost.Params> = {
      body: createParams,
    }

    const response = await createPostController.handle(request)

    expect(createPost.create).toHaveBeenCalledWith(createParams)
    expect(findPostById.find).toHaveBeenCalledWith(createdPost.id)
    expect(response).toEqual(created(foundPost))
  })

  it('should return 500 if an error occurs', async () => {
    const createParams: CreatePost.Params = {
      title: faker.lorem.words(),
      content: faker.lorem.words(),
      published: false,
      author: { id: faker.string.uuid() },
    }
    jest
      .spyOn(createPost, 'create')
      .mockRejectedValueOnce(async () => new Error('Error creating post'))
    const request: HttpRequest<CreatePost.Params> = {
      body: createParams,
    }

    const response = await createPostController.handle(request)

    expect(response).toEqual(serverError(new Error('Error creating post')))
  })
})