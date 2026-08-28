site is live at https://rojgarsetunet.vercel.app/


# 🌾 RojgarSetu | Full-Stack Labor Marketplace Platform
> **Connecting Daily Wage Workers & Employers Directly | Zero Middlemen | Fair Wages**
RojgarSetu (KaamConnect) is a production-ready full-stack web platform built with **ASP.NET Core 8 Web API**, **Entity Framework Core**, **SQL Server**, and **React**. It eliminates traditional physical labor stand-by points (chowks) by enabling employers to hire skilled workers directly and allowing daily wage laborers to set availability and find work in their immediate vicinity.
---
## 🚀 Tech Stack
### **Backend & Database**
- **Framework**: ASP.NET Core 8.0 Web API (C#)
- **ORM**: Entity Framework Core 8
- **Database**: Microsoft SQL Server / SQL LocalDB / InMemory DB
- **API Documentation**: Swagger UI / OpenAPI (`http://localhost:5000/swagger`)
### **Frontend**
- **Library**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router DOM v6
### **DevOps & Deployment**
- **Containerization**: Docker (Multi-stage build)
- **Frontend Hosting**: Vercel
- **Backend Hosting**: Render / Azure App Service
---
## ✨ Key Features
1. **Role-Based Access Control**:
   - **Customer / Employer**: Post job requirements, search workers by skill/city, hire candidates, and rate workers post-job completion.
   - **Labourer / Worker**: Toggle daily availability, browse open jobs matching skills & location, and track assigned work.
2. **Full Job Lifecycle Workflow**:
   - Status updates: `Open` ➔ `Assigned` (In Progress) ➔ `Completed` ➔ `Reviewed`.
3. **Dynamic Rating & Review System**:
   - Employers rate workers (1–5 stars) and submit feedback upon job completion.
   - Overall worker ratings and total completed jobs update dynamically in SQL Server.
4. **Real-Time Daily Availability Toggle**:
   - Workers toggle active work status with one click, updating visibility across the platform in real time.
5. **Multi-Criteria Search & Filtering**:
   - Search by location/city, skill category (Painter, Plumber, Electrician, Carpenter, Mason, etc.), and wage range.
---
## 📁 Project Structure
ROJGARSETU/ ├── backend/ │ └── RojgarSetu.Api/ │ ├── Controllers/ # AuthController, JobsController, LabourersController, ReviewsController │ ├── Data/ # ApplicationDbContext, DbInitializer (Auto-Seeding) │ ├── DTOs/ # Data Transfer Objects │ ├── Models/ # User, UserSkill, Job, JobApplication, Review │ ├── Program.cs # Middleware, CORS, EF Core registration │ └── appsettings.json ├── src/ │ ├── components/ # JobCard, LabourerCard, Navbar, Footer │ ├── context/ # AuthContext, DataContext │ ├── pages/ # Home, Login, Register, Dashboards, PostJob, BrowseLabourers │ └── services/ # api.js (Central REST API client) ├── Dockerfile # Production Docker image build ├── vercel.json # SPA rewrites config for Vercel ├── vite.config.js └── package.json



---
## 📡 REST API Endpoints Overview
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/send-otp` | Send verification OTP (Demo OTP: `123456`) |
| `POST` | `/api/auth/login` | Login user by phone & role |
| `POST` | `/api/auth/register` | Register new Customer or Labourer |
| `GET` | `/api/jobs` | Get all jobs (Supports `customerId`, `skill`, `location`, `status` filters) |
| `POST` | `/api/jobs` | Create a new job posting |
| `POST` | `/api/jobs/{id}/assign` | Assign worker to a job |
| `PUT` | `/api/jobs/{id}/status` | Update job status (`open`, `assigned`, `completed`) |
| `POST` | `/api/jobs/{id}/apply` | Apply for a job posting |
| `GET` | `/api/labourers` | Get skilled workers (Supports `skill`, `location`, `available` filters) |
| `PUT` | `/api/labourers/{id}/availability` | Toggle daily work availability |
| `POST` | `/api/reviews` | Submit job rating & worker feedback |
---
## 🛠️ Local Development Setup
### **Prerequisites**
- [.NET 8.0 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js (v18+)](https://nodejs.org/)
### **1. Run ASP.NET Core Backend**
```bash
# Navigate to API project directory
cd backend/RojgarSetu.Api
# Restore dependencies & run server
dotnet run --urls "http://localhost:5000"
Live Swagger documentation will be available at: http://localhost:5000/swagger

2. Run React Frontend
bash


# In the root project directory
npm install
npm run dev
Web application will be live at: http://localhost:5173/

🔑 Demo Login Credentials
Role	Phone	OTP	Skills / Details
Employer	9876543210	123456	Rajesh Kumar (Delhi)
Worker	9876543220	123456	Ravi Kumar (Painter, Helper)
Worker	9876543221	123456	Suresh Yadav (Plumber, Electrician)
