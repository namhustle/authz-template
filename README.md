# NestJS Authorization Template

A comprehensive NestJS template implementing Role-Based Access Control (RBAC) with JWT authentication. This project provides a solid foundation for building secure applications with fine-grained permission management.

## 🎯 Purpose

This template serves as a starting point for applications requiring:
- **JWT-based authentication** with access and refresh tokens
- **Role-Based Access Control (RBAC)** system
- **Permission-based authorization** with decorators
- **Account type restrictions** (Admin/User)
- **PostgreSQL database** integration with TypeORM
- **Docker containerization** for easy deployment
- **Swagger API documentation**

## 🏗️ Project Structure

```
src/
├── cli/                    # CLI scripts (seeding)
├── common/                 # Shared utilities and DTOs
├── modules/
│   ├── account/           # User account management
│   ├── auth/              # Authentication & authorization
│   │   ├── decorators/    # Custom decorators (@RequiredPermissions, @RequiredAccountTypes)
│   │   ├── guards/        # Authorization guards
│   │   └── strategies/    # Passport strategies (JWT, Local)
│   ├── database/          # Database configuration
│   ├── permission/        # Permission management
│   └── role/              # Role management
└── swagger/               # API documentation setup
```

## 🚀 Features

### Authentication & Authorization
- **JWT Authentication** with access and refresh tokens
- **Local Strategy** for username/password login
- **Global Guards** for automatic route protection
- **Public Route Decorator** to bypass authentication

### RBAC System
- **Accounts** with different types (Admin, User)
- **Roles** with associated permissions
- **Permissions** for fine-grained access control
- **Many-to-many** relationships between accounts and roles

### Security Features
- **Password hashing** with bcrypt
- **CORS configuration**
- **Helmet** for security headers (production)
- **CSRF protection**
- **Request compression**

## 🛠️ Installation

### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- PostgreSQL (if running locally)

### Local Development

1. **Clone the repository**
```bash
git clone <repository-url>
cd authz-template
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment setup**
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
# Application
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL=postgres://username:password@localhost:5432/authz

# JWT Secrets
JWT_ACCESS_SECRET=your_super_secret_access_key
JWT_REFRESH_SECRET=your_super_secret_refresh_key
ACCESS_TOKEN_EXPIRES_IN=4h
REFRESH_TOKEN_EXPIRES_IN=7d
```

4. **Start development server**
```bash
npm run start:dev
```

## 🐳 Docker Installation

### Using Docker Compose (Recommended)

1. **Start the application**
```bash
docker-compose up -d
```

This will start:
- **PostgreSQL database** on port 5432
- **NestJS API** on port 3000

2. **View logs**
```bash
docker-compose logs -f authz_api
```

3. **Stop the application**
```bash
docker-compose down
```

### Using Docker only

1. **Build the image**
```bash
docker build -t authz-template .
```

2. **Run the container**
```bash
docker run -p 3000:3000 \
  -e DATABASE_URL=postgres://user:pass@host:5432/db \
  -e JWT_ACCESS_SECRET=your_access_secret \
  -e JWT_REFRESH_SECRET=your_refresh_secret \
  authz-template
```

## 🌱 Seeding Data

Run the seed script to populate initial permissions:

```bash
# Local development
npm run seed

# Docker environment
docker-compose exec authz_api npm run seed
```

The seed script creates default permissions:
- `CREATE:ROLE` - Permission to create roles
- `GET:ROLE` - Permission to view roles  
- `UPDATE:ROLE` - Permission to update roles
- `DELETE:ROLE` - Permission to delete roles

## 📚 API Documentation

Once the application is running, access the Swagger documentation at:
- **Local**: http://localhost:3000/docs
- **Docker**: http://localhost:3000/docs

## 🔐 Using Authorization Decorators

### @RequiredAccountTypes Decorator

Restricts access based on account type:

```typescript
import { Controller, Get } from '@nestjs/common';
import { RequiredAccountTypes } from '../auth/decorators';
import { AccountType } from '../account/enums/account.enum';

@Controller('admin')
export class AdminController {
  
  @Get('dashboard')
  @RequiredAccountTypes(AccountType.ADMIN)
  async getDashboard() {
    // Only accessible by ADMIN accounts
    return { message: 'Admin dashboard data' };
  }
  
  @Get('users-and-admins')
  @RequiredAccountTypes(AccountType.USER, AccountType.ADMIN)
  async getMultipleTypes() {
    // Accessible by both USER and ADMIN accounts
    return { message: 'Data for users and admins' };
  }
}
```

### @RequiredPermissions Decorator

Restricts access based on specific permissions:

```typescript
import { Controller, Post, Get, Put, Delete } from '@nestjs/common';
import { RequiredPermissions } from '../auth/decorators';

@Controller('roles')
export class RoleController {
  
  @Post()
  @RequiredPermissions('CREATE:ROLE')
  async createRole(@Body() createRoleDto: CreateRoleDto) {
    // Only users with CREATE:ROLE permission can access
    return this.roleService.create(createRoleDto);
  }
  
  @Get()
  @RequiredPermissions('GET:ROLE')
  async getRoles() {
    // Only users with GET:ROLE permission can access
    return this.roleService.findAll();
  }
  
  @Put(':id')
  @RequiredPermissions('UPDATE:ROLE')
  async updateRole(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    // Only users with UPDATE:ROLE permission can access
    return this.roleService.update(id, updateRoleDto);
  }
  
  @Delete(':id')
  @RequiredPermissions('DELETE:ROLE')
  async deleteRole(@Param('id') id: string) {
    // Only users with DELETE:ROLE permission can access
    return this.roleService.remove(id);
  }
  
  @Get('public-info')
  @RequiredPermissions('GET:ROLE', 'VIEW:PUBLIC_DATA')
  async getPublicInfo() {
    // User must have BOTH permissions to access
    return this.roleService.getPublicInfo();
  }
}
```

### @Public Decorator

Bypasses all authentication and authorization:

```typescript
import { Controller, Post } from '@nestjs/common';
import { Public } from '../auth/decorators';

@Controller('auth')
export class AuthController {
  
  @Post('login')
  @Public()
  async login(@Body() loginDto: LoginDto) {
    // Accessible without authentication
    return this.authService.login(loginDto);
  }
  
  @Post('register')
  @Public()
  async register(@Body() registerDto: RegisterDto) {
    // Accessible without authentication
    return this.authService.register(registerDto);
  }
}
```

## 🔑 Authorization Flow

1. **Authentication**: User logs in with username/password
2. **JWT Generation**: System generates access and refresh tokens
3. **Request Authorization**: Each request includes JWT in Authorization header
4. **Guard Execution**: Guards check in order:
   - `JwtAuthGuard`: Validates JWT token
   - `RequiredAccountTypeGuard`: Checks account type restrictions
   - `RequiredPermissionGuard`: Validates required permissions
5. **Access Decision**: Request proceeds if all guards pass

### Permission Hierarchy

- **ADMIN accounts**: Automatically bypass permission checks
- **USER accounts**: Must have explicit permissions through roles
- **Permissions**: Checked against user's roles and their associated permissions

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests  
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📝 Available Scripts

```bash
npm run build          # Build the application
npm run start          # Start production server
npm run start:dev      # Start development server with watch mode
npm run start:debug    # Start with debug mode
npm run lint           # Run ESLint
npm run format         # Format code with Prettier
npm run seed           # Run database seeding
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the UNLICENSED License.
