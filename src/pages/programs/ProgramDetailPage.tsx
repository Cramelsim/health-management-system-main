import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ArrowLeft, Users, Edit, Clock, User } from 'lucide-react';
import { supabase, Program, Client } from '../../lib/supabase';
import { format } from 'date-fns';

export const ProgramDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [program, setProgram] = useState<Program | null>(null);
  const [enrolledClients, setEnrolledClients] = useState<Client[]>([]);
  const [enrollmentCount, setEnrollmentCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProgramDetails = async () => {
      if (!id) return;
      
      setIsLoading(true);
      
      try {
        // Fetch program details
        const { data: programData, error: programError } = await supabase
          .from('programs')
          .select('*')
          .eq('id', id)
          .single();
          
        if (programError) throw programError;
        
        // Fetch enrolled clients
        const { data: clientsData, error: clientsError } = await supabase
          .from('enrollments')
          .select(`
            client_id,
            clients (
              id,
              first_name,
              last_name,
              date_of_birth,
              gender,
              contact_number
            )
          `)
          .eq('program_id', id)
          .limit(10);
          
        if (clientsError) throw clientsError;
        
        // Get enrollment count
        const { count, error: countError } = await supabase
          .from('enrollments')
          .select('*', { count: 'exact', head: true })
          .eq('program_id', id);
          
        if (countError) throw countError;
        
        setProgram(programData);
        setEnrollmentCount(count || 0);
        
        // Extract client data from the join
        const clients = clientsData
          .map((enrollment) => enrollment.clients)
          .filter(Boolean) as Client[];
          
        setEnrolledClients(clients);
      } catch (error) {
        console.error('Error fetching program details:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProgramDetails();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin h-12 w-12 rounded-full border-t-2 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <h3 className="mt-2 text-lg font-medium text-gray-900">Program not found</h3>
        <p className="mt-1 text-sm text-gray-500">The program you're looking for doesn't exist.</p>
        <div className="mt-6">
          <Button
            variant="outline"
            leftIcon={<ArrowLeft className="h-4 w-4" />}
            onClick={() => navigate('/programs')}
          >
            Back to Programs
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            {program.name}
          </h2>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
          <Button
            variant="outline"
            leftIcon={<ArrowLeft className="h-4 w-4" />}
            onClick={() => navigate('/programs')}
          >
            Back to Programs
          </Button>
          <Button
            leftIcon={<Edit className="h-4 w-4" />}
            onClick={() => navigate(`/programs/${id}/edit`)}
          >
            Edit Program
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="md:col-span-2">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
          <p className="text-gray-600 whitespace-pre-wrap">{program.description}</p>
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="h-5 w-5 text-gray-400 mr-2" />
              <span>
                Created on {format(new Date(program.created_at), 'MMMM d, yyyy')}
              </span>
            </div>
          </div>
        </Card>
        
        <Card>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Overview</h3>
          
          <div className="flex items-center py-2">
            <div className="bg-cyan-100 rounded-full p-2 mr-3">
              <Users className="h-5 w-5 text-cyan-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Enrolled Clients</p>
              <p className="text-xl font-semibold">{enrollmentCount}</p>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-end">
              <Link to="/clients/new">
                <Button size="sm">Enroll New Client</Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
      
      <Card title="Enrolled Clients">
        {enrolledClients.length === 0 ? (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No clients enrolled</h3>
            <p className="mt-1 text-sm text-gray-500">Start by enrolling clients in this program.</p>
            <div className="mt-4">
              <Link to="/clients/new">
                <Button>Enroll Client</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gender
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Age
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {enrolledClients.map((client) => {
                  const birthDate = new Date(client.date_of_birth);
                  const age = new Date().getFullYear() - birthDate.getFullYear();
                  
                  return (
                    <tr key={client.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                            <User className="h-6 w-6 text-gray-500" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {client.first_name} {client.last_name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 capitalize">{client.gender}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{age} years</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{client.contact_number}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          to={`/clients/${client.id}`}
                          className="text-cyan-600 hover:text-cyan-900"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            
            {enrollmentCount > enrolledClients.length && (
              <div className="px-6 py-4 bg-gray-50 text-center">
                <span className="text-sm text-gray-700">
                  Showing {enrolledClients.length} of {enrollmentCount} clients
                </span>
                <Link
                  to={`/programs/${id}/clients`}
                  className="ml-2 text-sm font-medium text-cyan-600 hover:text-cyan-500"
                >
                  View all
                </Link>
              </div>
            )}
          </div>
        )}
      </Card>
    </>
  );
};