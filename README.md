# Health Information System

A comprehensive health information management system for healthcare providers to manage clients and health programs.

## Demo Links

- Live Demo [Deployed Web App](https://health-management-system-main.vercel.app/)
- Slides Presentation [https://docs.google.com/presentation/d/17kXqaBMSHEqhpij4HDaPfYQwHzJAU4LrjR7Wa6DOKao/edit?usp=drivesdk](https://docs.google.com/presentation/d/17kXqaBMSHEqhpij4HDaPfYQwHzJAU4LrjR7Wa6DOKao/edit?usp=drivesdk)

## Features

- User authentication with role-based access control (admin/doctor)
- Health program management (create, view, update)
- Client registration and management
- Program enrollment for clients
- Client search functionality
- Client profile viewing with enrolled programs
- RESTful API for client profile access

## Tech Stack

- **Frontend**: React with TypeScript, Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with JWT
- **API**: Supabase Edge Functions

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account

### Setup Steps

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/health-information-system.git
   cd health-information-system
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a Supabase project at [supabase.com](https://supabase.com)

4. Set up environment variables by creating a `.env` file in the root directory:
   ```
   VITE_SUPABASE_URL=YOUR_SUPABASE_URL
   VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
   ```

5. Run the database migrations:
   - Navigate to the SQL editor in your Supabase dashboard
   - Run the SQL scripts from the `supabase/migrations` folder in order

6. Deploy the edge functions:
   - Configure Supabase CLI
   - Deploy the functions with `supabase functions deploy`

7. Start the development server:
   ```
   npm run dev
   ```

8. Access the application at http://localhost:5173

## API Documentation

The system exposes a REST API to retrieve client information:

### Authentication

All API requests must include an API key in the headers:
```
Authorization: Bearer YOUR_API_KEY
```

### Endpoints

- `GET /api/clients`: Get a list of all clients
- `GET /api/clients/:id`: Get details of a specific client including their enrolled programs

Example response from `GET /api/clients/:id`:
```json
{
  "success": true,
  "data": {
    "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "first_name": "John",
    "last_name": "Doe",
    "date_of_birth": "1980-01-01",
    "gender": "male",
    "contact_number": "+1234567890",
    "email": "john.doe@example.com",
    "address": "123 Main St, City",
    "created_at": "2023-05-23T14:56:29.000Z",
    "programs": [
      {
        "id": "a2b4c6d8-e0f2-4681-8024-6a9b3c5d7e8f",
        "name": "Diabetes Management",
        "enrollment_status": "active",
        "enrollment_date": "2023-05-24T10:30:00.000Z"
      }
    ]
  }
}
```

## Default Users

The system comes with two default users:

1. **Admin User**
   - Email: craigcarlos95@gmail.com
   - Password: admin123

## License

This project is licensed under the MIT License - see the LICENSE file for details.
