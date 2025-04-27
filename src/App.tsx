import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './lib/auth';
import { AppLayout } from './components/layout/AppLayout';
import { LoginForm } from './components/auth/LoginForm';
import { DashboardPage } from './pages/DashboardPage';
import { ProgramsListPage } from './pages/programs/ProgramsListPage';
import { CreateProgramPage } from './pages/programs/CreateProgramPage';
import { ProgramDetailPage } from './pages/programs/ProgramDetailPage';
import { ClientsListPage } from './pages/clients/ClientsListPage';
import { RegisterClientPage } from './pages/clients/RegisterClientPage';
import { ClientDetailPage } from './pages/clients/ClientDetailPage';
import { EditClientPage } from './pages/clients/EditClientPage';
import { EnrollProgramPage } from './pages/clients/EnrollProgramPage';
import { UsersListPage } from './pages/users/UsersListPage';
import { ApiDocsPage } from './pages/api/ApiDocsPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          
          <Route path="/" element={<AppLayout />}>
            <Route index element={<DashboardPage />} />
            
            <Route path="programs">
              <Route index element={<ProgramsListPage />} />
              <Route path="new" element={<CreateProgramPage />} />
              <Route path=":id" element={<ProgramDetailPage />} />
            </Route>
            
            <Route path="clients">
              <Route index element={<ClientsListPage />} />
              <Route path="new" element={<RegisterClientPage />} />
              <Route path=":id" element={<ClientDetailPage />} />
              <Route path=":id/edit" element={<EditClientPage />} />
              <Route path=":id/enroll" element={<EnrollProgramPage />} />
            </Route>
            
            <Route path="users" element={<UsersListPage />} />
            <Route path="api" element={<ApiDocsPage />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#ffffff',
              color: '#333333',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              borderRadius: '0.375rem',
              padding: '0.75rem 1rem',
            },
            success: {
              iconTheme: {
                primary: '#22C55E',
                secondary: '#FFFFFF',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: '#FFFFFF',
              },
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;