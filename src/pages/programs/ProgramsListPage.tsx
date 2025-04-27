import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Activity, Search, Edit } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { supabase, Program } from '../../lib/supabase';
import { format } from 'date-fns';

export const ProgramsListPage = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPrograms = async () => {
      setIsLoading(true);
      
      try {
        let query = supabase.from('programs').select('*').order('name');
        
        if (searchTerm) {
          query = query.ilike('name', `%${searchTerm}%`);
        }
        
        const { data, error } = await query;
        
        if (error) {
          throw error;
        }
        
        setPrograms(data || []);
      } catch (error) {
        console.error('Error fetching programs:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPrograms();
  }, [searchTerm]);

  return (
    <>
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Health Programs
          </h2>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Link to="/programs/new">
            <Button leftIcon={<Plus className="h-4 w-4" />}>Add New Program</Button>
          </Link>
        </div>
      </div>
      
      <Card className="mb-6">
        <div className="flex items-center">
          <div className="flex-grow max-w-md">
            <Input
              type="text"
              placeholder="Search programs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search className="h-5 w-5 text-gray-400" />}
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
          {programs.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">No programs found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating a new health program.
              </p>
              <div className="mt-6">
                <Link to="/programs/new">
                  <Button leftIcon={<Plus className="h-4 w-4" />}>Add New Program</Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {programs.map((program) => (
                  <li key={program.id}>
                    <Link
                      to={`/programs/${program.id}`}
                      className="block hover:bg-gray-50 transition duration-150 ease-in-out"
                    >
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="bg-cyan-100 rounded-full p-2 mr-4">
                              <Activity className="h-6 w-6 text-cyan-600" />
                            </div>
                            <p className="text-lg font-medium text-cyan-600 truncate">
                              {program.name}
                            </p>
                          </div>
                          <div className="ml-2 flex-shrink-0 flex">
                            <Edit className="h-5 w-5 text-gray-400" />
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500">
                              {program.description?.substring(0, 100)}
                              {program.description && program.description.length > 100 ? '...' : ''}
                            </p>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            <p>Created on {format(new Date(program.created_at), 'MMM d, yyyy')}</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </>
  );
};