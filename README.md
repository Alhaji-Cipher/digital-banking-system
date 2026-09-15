# 🏦 Digital Banking System

A comprehensive backend system for digital banking with customer onboarding, account management, and core banking operations. Built with NestJS, TypeORM, and MySQL.

## 📋 Table of Contents

- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [Nibss by Phoenix Integration](#nibss-by-phoenix-integration)

## ✨ Features

### 1. Customer Onboarding
- BVN/NIN verification via Nibss by Phoenix API
- Customer profile creation and management
- Data validation and security

### 2. Account Management
- Account creation after successful onboarding
- Maximum one account per customer
- Initial balance: ₦15,000
- Account balance inquiry

### 3. Core Banking Operations
- **Name Enquiry**: Verify recipient details before transfers
- **Intra-Bank Transfers**: Transfer between accounts in the same bank
- **Inter-Bank Transfers**: Transfer to accounts in other banks
- **Transaction History**: View personal transaction records with data privacy
- **Transaction Status Check**: Track transaction status in real-time

### 4. Security & Privacy
- JWT-based authentication
- Role-based access control
- Data isolation (customers can only view their own data)
- Bcrypt password hashing

## 🚀 Requirements

- Node.js 16+ 
- MySQL 8.0+
- npm or yarn

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Alhaji-Cipher/digital-banking-system.git
   cd digital-banking-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables** (see Configuration section)

## ⚙️ Configuration

Edit the `.env` file with your configuration:

```env
# Application
NODE_ENV=development
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_NAME=digital_banking_system

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRATION=3600

# Nibss by Phoenix API
NIBSS_API_BASE_URL=https://nibssbyphoenix.onrender.com/api
NIBSS_API_KEY=your_api_key_here
NIBSS_BANK_CODE=your_bank_code_here
NIBSS_EMAIL=your_email@example.com
NIBSS_BANK_NAME=Your Bank Name
```

### Getting Nibss API Credentials

1. Visit: https://nibssbyphoenix.onrender.com/api/docs/#/
2. Call the onboarding endpoint with your email and bank name
3. Receive API credentials via email
4. Add credentials to `.env` file

## ▶️ Running the Application

### Development Mode
```bash
npm run start:dev
```

### Production Mode
```bash
npm run build
npm run start:prod
```

### Running Tests
```bash
npm run test
npm run test:watch
npm run test:cov
```

## 📚 API Documentation

Once the application is running, visit:
- **Swagger UI**: `http://localhost:3000/api/docs`
- **ReDoc**: `http://localhost:3000/api/redoc`

### Key Endpoints

#### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login and get JWT token
- `POST /auth/refresh` - Refresh JWT token

#### Customers
- `POST /customers/onboard/bvn` - Onboard with BVN
- `POST /customers/onboard/nin` - Onboard with NIN
- `GET /customers/profile` - Get customer profile
- `PUT /customers/profile` - Update customer profile

#### Accounts
- `POST /accounts` - Create a bank account
- `GET /accounts/:id` - Get account details
- `GET /accounts/balance` - Check account balance

#### Transactions
- `POST /transactions/intra-bank` - Intra-bank transfer
- `POST /transactions/inter-bank` - Inter-bank transfer
- `GET /transactions/name-enquiry` - Verify recipient details
- `GET /transactions/history` - Get transaction history
- `GET /transactions/:id/status` - Check transaction status

## 📁 Project Structure

```
src/
├── auth/
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.module.ts
│   ├── jwt.strategy.ts
│   └── dto/
├── customers/
│   ├── customers.controller.ts
│   ├── customers.service.ts
│   ├── customers.module.ts
│   ├── entities/
│   └── dto/
├── accounts/
│   ├── accounts.controller.ts
│   ├── accounts.service.ts
│   ├── accounts.module.ts
│   ├── entities/
│   └── dto/
├── transactions/
│   ├── transactions.controller.ts
│   ├── transactions.service.ts
│   ├── transactions.module.ts
│   ├── entities/
│   └── dto/
├── integrations/
│   └── nibss/
│       ├── nibss.service.ts
│       ├── nibss.module.ts
│       └── dto/
├── common/
│   ├── decorators/
│   ├── filters/
│   ├── guards/
│   ├── interceptors/
│   └── constants/
├── app.module.ts
└── main.ts
```

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### Customers Table
```sql
CREATE TABLE customers (
  id UUID PRIMARY KEY,
  user_id UUID UNIQUE NOT NULL,
  bvn VARCHAR(11),
  nin VARCHAR(11),
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone_number VARCHAR(20),
  date_of_birth DATE,
  address VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(100),
  country VARCHAR(100),
  verification_status ENUM('PENDING', 'VERIFIED', 'REJECTED'),
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Accounts Table
```sql
CREATE TABLE accounts (
  id UUID PRIMARY KEY,
  customer_id UUID UNIQUE NOT NULL,
  account_number VARCHAR(20) UNIQUE NOT NULL,
  account_type ENUM('SAVINGS', 'CURRENT'),
  balance DECIMAL(15, 2),
  currency VARCHAR(3),
  status ENUM('ACTIVE', 'INACTIVE', 'CLOSED'),
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id)
);
```

### Transactions Table
```sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY,
  from_account_id UUID NOT NULL,
  to_account_number VARCHAR(20),
  to_bank_code VARCHAR(10),
  amount DECIMAL(15, 2),
  transaction_type ENUM('INTRA_BANK_TRANSFER', 'INTER_BANK_TRANSFER', 'DEPOSIT', 'WITHDRAWAL'),
  status ENUM('PENDING', 'SUCCESS', 'FAILED', 'REVERSED'),
  description VARCHAR(255),
  reference VARCHAR(50) UNIQUE,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  FOREIGN KEY (from_account_id) REFERENCES accounts(id)
);
```

## 🔗 Nibss by Phoenix Integration

This system integrates with Nibss by Phoenix API for:

1. **Onboarding**: BVN/NIN verification
2. **Name Enquiry**: Verify recipient account details
3. **Fund Transfer**: Execute inter-bank transfers
4. **Transaction Status**: Check transaction status with Nibss

### API Documentation
- **Base URL**: https://nibssbyphoenix.onrender.com/api
- **Swagger**: https://nibssbyphoenix.onrender.com/api/docs/#/

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 Support

For questions or issues, please open a GitHub issue or contact the maintainers.

---

**Made with ❤️ by Alhaji-Cipher**
