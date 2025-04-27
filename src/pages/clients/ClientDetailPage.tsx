import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ArrowLeft, Edit, User, Plus, Activity, Calendar, Check, X } from 'lucide-react';
import { supabase, Client, ClientWithPrograms } from '../../lib/supabase';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export const ClientDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [client, setClient] = useState<ClientWithPrograms | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchClientDetails = async () => {
      if (!id) return;
      
      setIsLoading(true);
      
      try {
        // Fetch client details
        const { data: clientData, error: clientError } = await supabase
          .from('clients')
          .select('*')
          .eq('id', id)
          .single();
          
        if (clientError) throw clientError;
        
        // Fetch client enrollments with program details
        const { data: enrollmentsData, error: enrollmentsError } = await supabase
          .from('enrollments')
          .select(`
            id,
            enrollment_date,
            status,
            programs (
              id,
              name,
              description
            )
          `)
          .eq('client_id', id);
          
        if (enrollmentsError) throw enrollmentsError;
        
        // Transform into ClientWithPrograms format
        const clientWithPrograms: ClientWithPrograms = {
          ...clientData,
          programs: enrollmentsData.map((enrollment) => ({
            ...(enrollment.programs as any),
            enrollment_id: enrollment.id,
            enrollment_status: enrollment.status,
            enrollment_date: enrollment.enrollment_date,
          })),
        };
        
        setClient(clientWithPrograms);
      } catch (error) {
        console.error('Error fetching client details:', error);
        toast.error('Failed to load client details');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchClientDetails();
  }, [id]);

  const updateEnrollmentStatus = async (enrollmentId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('enrollments')
        .update({ status: newStatus })
        .eq('id', enrollmentId);
        
      if (error) throw error;
      
      // Update local state
      if (client) {
        const updatedPrograms = client.programs.map((program) => {
          if (program.enrollment_id === enrollmentId) {
            return {
              ...program,
              enrollment_status: newStatus,
            };
          }
          return program;
        });
        
        setClient({
          ...client,
          programs: updatedPrograms,
        });
      }
      
      toast.success(`Program status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating enrollment status:', error);
      toast.error('Failed to update program status');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin h-12 w-12 rounded-full border-t-2 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <h3 className="mt-2 text-lg font-medium text-gray-900">Client not found</h3>
        <p className="mt-1 text-sm text-gray-500">The client you're looking for doesn't exist.</p>
        <div className="mt-6">
          <Button
            variant="outline"
            leftIcon={<ArrowLeft className="h-4 w-4" />}
            onClick={() => navigate('/clients')}
          >
            Back to Clients
          </Button>
        </div>
      </div>
    );
  }

  const birthDate = new Date(client.date_of_birth);
  const age = new Date().getFullYear() - birthDate.getFullYear();
  const formattedBirthDate = format(birthDate, 'MMMM d, yyyy');

  return (
    <>
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            {client.first_name} {client.last_name}
          </h2>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
          <Button
            variant="outline"
            leftIcon={<ArrowLeft className="h-4 w-4" />}
            onClick={() => navigate('/clients')}
          >
            Back to Clients
          </Button>
          <Button
            leftIcon={<Edit className="h-4 w-4" />}
            onClick={() => navigate(`/clients/${id}/edit`)}
          >
            Edit Client
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="md:col-span-2">
          <div className="flex items-start">
            <div className="bg-cyan-100 rounded-full p-3 mr-4">
              <User className="h-8 w-8 text-cyan-600" />
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                {client.first_name} {client.last_name}
              </h3>
              <p className="text-gray-500">
                {age} years old • {client.gender.charAt(0).toUpperCase() + client.gender.slice(1)}
              </p>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Contact Information</h4>
              <div className="mt-2 space-y-2">
                <p className="text-gray-900">{client.contact_number}</p>
                {client.email && <p className="text-gray-900">{client.email}</p>}
                <p className="text-gray-900">{client.address}</p>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500">Personal Details</h4>
              <div className="mt-2 space-y-2">
                <p className="text-gray-900">
                  <span className="font-medium">Date of Birth:</span> {formattedBirthDate}
                </p>
                <p className="text-gray-900">
                  <span className="font-medium">Age:</span> {age} years
                </p>
                <p className="text-gray-900">
                  <span className="font-medium">Gender:</span>{' '}
                  {client.gender.charAt(0).toUpperCase() + client.gender.slice(1)}
                </p>
              </div>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Enrolled Programs</h3>
            <Link to={`/clients/${id}/enroll`}>
              <Button size="sm" leftIcon={<Plus className="h-4 w-4" />}>
                Enroll
              </Button>
            </Link>
          </div>
          
          {client.programs.length === 0 ? (
            <div className="text-center py-6 bg-gray-50 rounded-md">
              <Activity className="h-10 w-10 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Not enrolled in any programs</p>
              <div className="mt-4">
                <Link to={`/clients/${id}/enroll`}>
                  <Button size="sm">Enroll in Program</Button>
                </Link>
              </div>
            </div>
          ) : (
            <ul className="space-y-3">
              {client.programs.map((program) => (
                <li
                  key={program.enrollment_id}
                  className="border rounded-md overflow-hidden"
                >
                  <div className="bg-gray-50 px-4 py-2 border-b">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium text-cyan-700">{program.name}</h4>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          program.enrollment_status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : program.enrollment_status === 'completed'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {program.enrollment_status.charAt(0).toUpperCase() +
                          program.enrollment_status.slice(1)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="px-4 py-2 flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>
                      Enrolled on{' '}
                      {format(new Date(program.enrollment_date), 'MMM d, yyyy')}
                    </span>
                  </div>
                  
                  {program.enrollment_status === 'active' && (
                    <div className="px-4 py-2 bg-gray-50 border-t flex justify-end space-x-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        leftIcon={<Check className="h-4 w-4" />}
                        onClick={() =>
                          updateEnrollmentStatus(program.enrollment_id, 'completed')
                        }
                      >
                        Complete
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        leftIcon={<X className="h-4 w-4" />}
                        onClick={() =>
                          updateEnrollmentStatus(program.enrollment_id, 'terminated')
                        }
                      >
                        Terminate
                      </Button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
      
      <Card title="Client History">
        <div className="text-center py-8">
          <p className="text-gray-500">Detailed client history will be available soon.</p>
        </div>
      </Card>
    </>
  );
};