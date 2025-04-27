import React, { useEffect, useState } from 'react';
import { Card } from '../components/ui/Card';
import { supabase, Program, Client } from '../lib/supabase';
import { Users, Activity, UserPlus, CalendarCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

export const DashboardPage: React.FC = () => {
  const [clientCount, setClientCount] = useState<number>(0);
  const [programCount, setProgramCount] = useState<number>(0);
  const [enrollmentCount, setEnrollmentCount] = useState<number>(0);
  const [recentClients, setRecentClients] = useState<Client[]>([]);
  const [recentPrograms, setRecentPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      
      try {
        // Get counts
        const { count: clientCountResult } = await supabase
          .from('clients')
          .select('*', { count: 'exact', head: true });
          
        const { count: programCountResult } = await supabase
          .from('programs')
          .select('*', { count: 'exact', head: true });
          
        const { count: enrollmentCountResult } = await supabase
          .from('enrollments')
          .select('*', { count: 'exact', head: true });
          
        // Get recent clients
        const { data: recentClientsResult } = await supabase
          .from('clients')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);
          
        // Get recent programs
        const { data: recentProgramsResult } = await supabase
          .from('programs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);
          
        setClientCount(clientCountResult || 0);
        setProgramCount(programCountResult || 0);
        setEnrollmentCount(enrollmentCountResult || 0);
        setRecentClients(recentClientsResult || []);
        setRecentPrograms(recentProgramsResult || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  const StatCard = ({ title, value, icon, color }: { title: string; value: number; icon: React.ReactNode; color: string }) => (
    <Card className="flex items-center">
      <div className={`rounded-full p-4 ${color} mr-4`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-3xl font-semibold">{value}</p>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      
      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin h-12 w-12 rounded-full border-t-2 border-b-2 border-cyan-600"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              title="Total Clients"
              value={clientCount}
              icon={<Users className="h-6 w-6 text-white" />}
              color="bg-cyan-600"
            />
            <StatCard
              title="Total Programs"
              value={programCount}
              icon={<Activity className="h-6 w-6 text-white" />}
              color="bg-emerald-600"
            />
            <StatCard
              title="Total Enrollments"
              value={enrollmentCount}
              icon={<CalendarCheck className="h-6 w-6 text-white" />}
              color="bg-amber-500"
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card title="Recent Clients">
              {recentClients.length === 0 ? (
                <p className="text-gray-500 py-4">No clients found</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date Added
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {recentClients.map((client) => (
                        <tr key={client.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {client.first_name} {client.last_name}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {format(new Date(client.created_at), 'MMM d, yyyy')}
                            </div>
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
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              
              <div className="mt-4 text-right">
                <Link
                  to="/clients"
                  className="text-sm font-medium text-cyan-600 hover:text-cyan-500"
                >
                  View all clients →
                </Link>
              </div>
            </Card>
            
            <Card title="Recent Programs">
              {recentPrograms.length === 0 ? (
                <p className="text-gray-500 py-4">No programs found</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Program Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date Added
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {recentPrograms.map((program) => (
                        <tr key={program.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {program.name}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {format(new Date(program.created_at), 'MMM d, yyyy')}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Link
                              to={`/programs/${program.id}`}
                              className="text-cyan-600 hover:text-cyan-900"
                            >
                              View
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              
              <div className="mt-4 text-right">
                <Link
                  to="/programs"
                  className="text-sm font-medium text-cyan-600 hover:text-cyan-500"
                >
                  View all programs →
                </Link>
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};