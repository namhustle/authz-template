import { Repository } from 'typeorm'
import { Permission } from '../entities/permission.entity'

export const PERMISSION_SEEDS = [
  { name: 'CREATE:ROLE', description: 'Permission to create roles' },
  { name: 'GET:ROLE', description: 'Permission to view roles' },
  { name: 'UPDATE:ROLE', description: 'Permission to update roles' },
  { name: 'DELETE:ROLE', description: 'Permission to delete roles' },
]

export async function seedPermissions(
  permissionRepository: Repository<Permission>,
): Promise<void> {
  console.log('🌱 Starting permissions seeding...')

  for (const permissionData of PERMISSION_SEEDS) {
    const existingPermission = await permissionRepository.findOne({
      where: { name: permissionData.name },
    })

    if (!existingPermission) {
      const permission = permissionRepository.create(permissionData)
      await permissionRepository.save(permission)
      console.log(`✅ Created permission: ${permissionData.name}`)
    } else {
      console.log(`⚠️  Permission already exists: ${permissionData.name}`)
    }
  }

  console.log('✅ Permissions seeding completed!')
}
