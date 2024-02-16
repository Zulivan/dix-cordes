import express, { Express, Request, Response } from 'express'
import http from 'http'
import auth from './routes/auth'
import user from './routes/user'
import conversations from './routes/conversations'
import contacts from './routes/contacts'
import ChatServer from '../chatServer'

export interface APIResponse extends Response {
  apiStatus: (data: any, statusCode?: number) => Response
}

export interface APIInterface extends Express {
  response: APIResponse
}

class APIServer {
  public app: APIInterface

  constructor() {
    this.app = express() as APIInterface
    this.init()
  }

  public defineSocket(socket: ChatServer): void {
    conversations.socket = socket
    user.socket = socket
  }

  private init(): void {
    this.setUses()

    this.app.response.apiStatus = function (
      data: any,
      statusCode: number = 200,
    ): Response {
      return this.status(200).send({
        status: statusCode,
        error: statusCode !== 200,
        output: data,
      })
    }

    this.app.get('/', (req: Request, res: Response) => {
      res.send('Dix-cordes API v1.0')
    })
  }

  private setUses(): void {
    this.app.use(express.json())

    this.app.use(function (req: Request, res: Response, next: Function) {
      res.setHeader('Access-Control-Allow-Origin', '*')
      res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, OPTIONS, PUT, PATCH, DELETE',
      )
      res.setHeader(
        'Access-Control-Allow-Headers',
        'Authorization,X-Requested-With,content-type',
      )
      res.setHeader('Access-Control-Allow-Credentials', 'true')
      next()
    })

    this.app.use('/auth', auth)
    this.app.use('/user', user.router)
    this.app.use('/contacts', contacts)
    this.app.use('/conversations', conversations.router)
  }
}

export default APIServer
