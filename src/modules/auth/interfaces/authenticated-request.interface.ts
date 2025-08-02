import { FastifyRequest } from 'fastify'
import { JwtPayload } from '../types'

export interface AuthenticatedRequest extends FastifyRequest {
  user: JwtPayload
}
