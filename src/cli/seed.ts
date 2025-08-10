import { NestFactory } from '@nestjs/core'
import { AppModule } from '../app.module'
import { Repository } from 'typeorm'
import { Permission } from '../modules/permission/entities/permission.entity'
import { getRepositoryToken } from '@nestjs/typeorm'
import { seedPermissions } from '../modules/permission/seed/permission.seed'

async function runSeed() {
  const app = await NestFactory.createApplicationContext(AppModule)

  try {
    const permissionRepository = app.get<Repository<Permission>>(
      getRepositoryToken(Permission),
    )

    await seedPermissions(permissionRepository)
  } catch (error) {
    console.error('❌ Error seeding:', error)
    process.exit(1)
  } finally {
    await app.close()
  }
}

runSeed()