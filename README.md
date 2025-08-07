<<<<<<< HEAD
# Inventory Management System (Development Code)

## Project Overview
This is a full-stack inventory management application featuring a Next.js/React frontend and a Node.js/Express backend with a PostgreSQL database (managed via Prisma ORM). The project supports Docker and can be deployed on cloud platforms or run locally.

---

## Prerequisites

- **Node.js** (v18+ recommended)
- **npm** (comes with Node.js)
- **Docker & Docker Compose** (for containerized setup, optional)
- **PostgreSQL** (if not using Docker)
- **Git**

---

## 1. Clone the Repository

```sh
git clone https://github.com/navdeep809/kidwalksapparells-inventory.git
cd kidwalksapparells-inventory
```

---

## 2. Environment Setup

### Client
1. Go to the client directory:
   ```sh
   cd client
   ```
2. Copy or create a `.env` file:
   ```sh
   cp .env.example .env
   # Or manually create .env and set:
   # NEXT_PUBLIC_API_BASE_URL="http://localhost:5001"
   ```

### Server
1. Go to the server directory:
   ```sh
   cd ../server
   ```
2. Copy or create a `.env` file for the backend (set your database URL and JWT secret):
   ```sh
   cp .env.example .env
   # Or manually create .env and set:
   # DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
   # JWT_SECRET=your-secret
   ```

---

## 3. Install Dependencies

### Client
```sh
cd client
npm install
```

### Server
```sh
cd ../server
npm install
```

---

## 4. Database Setup

### Using Docker Desktop (Recommended for Local Development)
1. Make sure Docker Desktop is installed and running on your machine: https://www.docker.com/products/docker-desktop/
2. From the project root, run:
   ```sh
   docker-compose up --build
   ```
   This will build and start the database, backend, and frontend containers automatically.
3. Open Docker Desktop to monitor containers and logs if needed.
4. Access the app at:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5001

---

### Using Docker CLI Only
1. From the project root, run:
   ```sh
   docker-compose up --build
   ```
   This will start the database, backend, and frontend containers.

### Without Docker
1. Ensure PostgreSQL is running and your `.env` is configured.
2. Run migrations and seed the database:
   ```sh
   cd server
   npx prisma migrate deploy
   npx prisma db seed
   ```

---

## 5. Running the Application

### With Docker Compose
```sh
docker-compose up --build
```
Frontend: http://localhost:3000  
Backend API: http://localhost:5001

### Without Docker
#### Start Backend
```sh
cd server
npm start
```
#### Start Frontend
```sh
cd client
npm run dev
```
Frontend: http://localhost:3000

---

## 6. Default Seeded Users

After seeding, you can log in with:

- **Admin:**
  - Email: `admin1@example.com` / Password: `adminpass`
  - Email: `admin2@example.com` / Password: `adminpass`
- **Sales:**
  - Email: `sales1@example.com` / Password: `salespass`
  - Email: `sales2@example.com` / Password: `salespass`
  - Email: `sales3@example.com` / Password: `salespass`

---

## 7. Useful Commands

- Run migrations: `npx prisma migrate deploy`
- Seed database: `npx prisma db seed`
- Open Prisma Studio: `npx prisma studio`
- Start backend: `npm start` (in server)
- Start frontend: `npm run dev` (in client)
- Start all with Docker: `docker-compose up --build`

---

## 8. Cloud Deployment on AWS (VPC, RDS, EC2, Security Groups)

### 1. Create a VPC
- Go to AWS VPC Dashboard > Create VPC.
- Name: e.g., `project-vpc`
- IPv4 CIDR: `10.0.0.0/16`
- Leave other settings as default.

### 2. Create Subnets
- **Public Subnet:**
  - Name: e.g., `public-subnet-1`
  - VPC: your VPC
  - AZ: e.g., `us-east-1a`
  - CIDR: `10.0.1.0/24`
- **Private Subnet:**
  - Name: e.g., `private-subnet-1`
  - VPC: your VPC
  - AZ: same as above
  - CIDR: `10.0.2.0/24`

### 3. Create and Attach Internet Gateway
- Create Internet Gateway (e.g., `project-igw`)
- Attach to your VPC
- Edit public subnet's route table: add route `0.0.0.0/0` → your IGW

### 4. Create Security Groups
- **App SG:**
  - Name: e.g., `app-sg`, VPC: your VPC
  - Inbound: Allow HTTP (80), HTTPS (443), 3000, 5001 from your IP or 0.0.0.0/0 (dev only)
  - Outbound: Allow all
- **DB SG:**
  - Name: e.g., `db-sg`, VPC: your VPC
  - Inbound: Allow PostgreSQL (5432) from `app-sg`
  - Outbound: Allow all

### 5. Create RDS PostgreSQL Instance
- Go to RDS > Create database > PostgreSQL
- Standard Create
- DB instance identifier: e.g., `project-db`
- Set master username and password
- VPC: your VPC
- Subnet group: select private subnet
- Public access: No
- VPC security group: `db-sg`
- Port: 5432

### 6. Launch EC2 Instance for App
- Launch EC2 in the public subnet
- Security group: `app-sg`
- Install Docker, Node.js, and Git
- Clone your repo and set up environment variables

### 7. Connect Everything
- In your server `.env`, set `DATABASE_URL` to the RDS endpoint:
  ```
  DATABASE_URL=postgresql://master:password@<rds-endpoint>:5432/postgres
  ```
- Open ports 3000/5001 in `app-sg` for web access (dev only)

### 8. Deploy the Application
- SSH into your EC2 instance
- Follow the README steps to install dependencies and run Docker Compose or start the app
- The app will connect to RDS in the private subnet

---

## 9. Troubleshooting

- If you get permission errors, check file/folder ownership and use `sudo` if needed.
- If ports are in use, stop other services or change the port in `.env` files.
- For database errors, ensure your `DATABASE_URL` is correct and the database is running.

---

## 10. License

MIT
=======
# kidwalksapparells-inventory
>>>>>>> 082c452bdeffc1d3557bebbd3b69a0b9e0cdef7c
