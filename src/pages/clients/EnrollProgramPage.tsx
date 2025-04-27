import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { ArrowLeft, Save } from 'lucide-react';
import { supabase, Program, Client } from '../../lib/supabase';
import { useAuth } from '../../lib/auth';
import toast from 'react-hot-toast';

export const EnrollProgramPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [client, setClient] = useState<Client | null>(null);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [selectedProgramId, setSelectedProgramId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      try {
        // Fetch client details
        const { data: clientData, error: clientError } = await supabase
          .from('clients')
          .select('*')
          .eq('id', id)
          .single();
          
        if (clientError) throw clientError;
        
        // Fetch available programs (excluding already enrolled ones)
        const { data: enrollments } = await supabase
          .from('enrollments')
          .select('program_id')
          .eq('client_id', id);
          
        const enrolledProgramIds = enrollments?.map((e) => e.program_id) || [];
        
        let query = supabase
          .from('programs')
          .select('*')
          .order('name');
          
        if (enrolledProgramIds.length > 0) {
          query = query.not('id', 'in', `(${enrolledProgramIds.join(',')})`);
        }
        
        const { data: programsData, error: programsError } = await query;
        
        if (programsError) throw programsError;
        
        setClient(clientData);
        setPrograms(programsData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load data');
        navigate(`/clients/${id}`);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [id, navigate]);
  
  const handleEnroll = async () => {
    if (!user || !id || !selectedProgramId) return;
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.from('enrollments').insert({
        client_id: id,
        program_id: selectedProgramId,
        enrollment_date: new Date().toISOString(),
        status: 'active',
        created_by: user.id,
      });
      
      if (error) throw error;
      
      toast.success('Client enrolled successfully');
      navigate(`/clients/${id}`);
    } catch (error) {
      console.error('Error enrolling client:', error);
      toast.error('Failed to enroll client');
    } finally {
      setIsSubmitting(false);
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
  
  return (
    <>
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Enroll {client.first_name} {client.last_name} in Program
          </h2>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Button
            variant="outline"
            leftIcon={<ArrowLeft className="h-4 w-4" />}
            onClick={() => navigate(`/clients/${id}`)}
          >
            Back to Client
          </Button>
        </div>
      </div>
      
      <Card>
        {programs.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No available programs for enrollment</p>
            <p className="text-sm text-gray-400 mt-2">
              The client is already enrolled in all available programs
            </p>
          </div>
        ) : (
          <>
            <Select
              label="Select Program"
              value={selectedProgramId}
              onChange={setSelectedProgramId}
              options={[
                { value: '', label: 'Choose a program' },
                ...programs.map((program) => ({
                  value: program.id,
                  label: program.name,
                })),
              ]}
            />
            
            {selectedProgramId && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Program Description</h3>
                <p className="text-gray-700">
                  {programs.find((p) => p.id === selectedProgramId)?.description}
                </p>
              </div>
            )}
            
            <div className="mt-6 flex justify-end">
              <Button
                leftIcon={<Save className="h-4 w-4" />}
                onClick={handleEnroll}
                disabled={!selectedProgramId}
                isLoading={isSubmitting}
              >
                Enroll in Program
              </Button>
            </div>
          </>
        )}
      </Card>
    </>
  );
};