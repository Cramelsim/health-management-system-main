import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, User, Search, Filter } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { supabase, Client } from '../../lib/supabase';
import { Select } from '../../components/ui/Select';

export const ClientsListPage = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGender, setFilterGender] = useState('');

  useEffect(() => {
    const fetchClients = async () => {
      setIsLoading(true);
      
      try {
        let query = supabase.from('clients').select('*').order('first_name');
        
        if (searchTerm) {
          query = query.or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%`);
        }
        
        if (filterGender) {
          query = query.eq('gender', filterGender);
        }
        
        const { data, error } = await query;
        
        if (error) {
          throw error;
        }
        
        setClients(data || []);
      } catch (error) {
        console.error('Error fetching clients:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchClients();
  }, [searchTerm, filterGender]);

  return (
    <>
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Clients
          </h2>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Link to="/clients/new">
            <Button leftIcon={<Plus className="h-4 w-4" />}>Register New Client</Button>
          </Link>
        </div>
      </div>
      
      <Card className="mb-6">
        <div className="md:flex md:items-center gap-4">
          <div className="flex-grow max-w-md mb-4 md:mb-0">
            <Input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search className="h-5 w-5 text-gray-400" />}
            />
          </div>
          <div className="w-full md:w-48">
            <Select
              value={filterGender}
              onChange={setFilterGender}
              options={[
                { value: '', label: 'All Genders' },
                { value: 'male', label: 'Male' },
                { value: 'female', label: 'Female' },
                { value: 'other', label: 'Other' },
              ]}
              label=""
              className="md:w-48"
            />
          </div>
        </div>
      </Card>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin h-12 w-12 rounded-full border-t-2 border-b-2 border-cyan-600"></div>
        </div>
      ) : (
        <>
          {clients.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">No clients found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by registering a new client.
              </p>
              <div className="mt-6">
                <Link to="/clients/new">
                  <Button leftIcon={<Plus className="h-4 w-4" />}>Register New Client</Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Client
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Gender
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date of Birth
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {clients.map((client) => {
                      const birthDate = new Date(client.date_of_birth);
                      const formattedDate = `${birthDate.getDate().toString().padStart(2, '0')}/${(
                        birthDate.getMonth() + 1
                      )
                        .toString()
                        .padStart(2, '0')}/${birthDate.getFullYear()}`;
                      
                      return (
                        <tr key={client.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-cyan-100 rounded-full flex items-center justify-center">
                                <User className="h-5 w-5 text-cyan-600" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {client.first_name} {client.last_name}
                                </div>
                                <div className="text-sm text-gray-500">{client.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{client.contact_number}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 capitalize">{client.gender}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{formattedDate}</div>
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
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};