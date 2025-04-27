import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { ArrowLeft, Save, Plus, X } from 'lucide-react';
import { supabase, Program } from '../../lib/supabase';
import { useAuth } from '../../lib/auth';
import toast from 'react-hot-toast';

type ClientFormData = {
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  contact_number: string;
  email: string;
  address: string;
};

export const RegisterClientPage = () => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>([]);
  const [selectedProgramId, setSelectedProgramId] = useState('');
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClientFormData>({
    defaultValues: {
      first_name: '',
      last_name: '',
      date_of_birth: '',
      gender: '',
      contact_number: '',
      email: '',
      address: '',
    },
  });
  
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const { data, error } = await supabase.from('programs').select('*').order('name');
        
        if (error) throw error;
        
        setPrograms(data || []);
      } catch (error) {
        console.error('Error fetching programs:', error);
        toast.error('Failed to load programs');
      }
    };
    
    fetchPrograms();
  }, []);
  
  const addProgram = () => {
    if (!selectedProgramId || selectedPrograms.includes(selectedProgramId)) return;
    
    setSelectedPrograms([...selectedPrograms, selectedProgramId]);
    setSelectedProgramId('');
  };
  
  const removeProgram = (programId: string) => {
    setSelectedPrograms(selectedPrograms.filter((id) => id !== programId));
  };
  
  const onSubmit = async (data: ClientFormData) => {
    if (!user) return;
    
    setIsSubmitting(true);
    
    try {
      // Register client
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .insert({
          first_name: data.first_name,
          last_name: data.last_name,
          date_of_birth: data.date_of_birth,
          gender: data.gender,
          contact_number: data.contact_number,
          email: data.email || null,
          address: data.address,
          created_by: user.id,
        })
        .select('id')
        .single();
        
      if (clientError) throw clientError;
      
      // Enroll client in selected programs
      if (selectedPrograms.length > 0 && clientData) {
        const enrollments = selectedPrograms.map((programId) => ({
          client_id: clientData.id,
          program_id: programId,
          enrollment_date: new Date().toISOString(),
          status: 'active',
          created_by: user.id,
        }));
        
        const { error: enrollmentError } = await supabase.from('enrollments').insert(enrollments);
        
        if (enrollmentError) throw enrollmentError;
      }
      
      toast.success('Client registered successfully');
      navigate('/clients');
    } catch (error) {
      console.error('Error registering client:', error);
      toast.error('Failed to register client');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <>
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Register New Client
          </h2>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Button
            variant="outline"
            leftIcon={<ArrowLeft className="h-4 w-4" />}
            onClick={() => navigate('/clients')}
          >
            Back to Clients
          </Button>
        </div>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="md:col-span-2">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="First Name"
                error={errors.first_name?.message}
                {...register('first_name', {
                  required: 'First name is required',
                })}
              />
              
              <Input
                label="Last Name"
                error={errors.last_name?.message}
                {...register('last_name', {
                  required: 'Last name is required',
                })}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Date of Birth"
                type="date"
                error={errors.date_of_birth?.message}
                {...register('date_of_birth', {
                  required: 'Date of birth is required',
                })}
              />
              
              <Select
                label="Gender"
                options={[
                  { value: '', label: 'Select gender' },
                  { value: 'male', label: 'Male' },
                  { value: 'female', label: 'Female' },
                  { value: 'other', label: 'Other' },
                ]}
                error={errors.gender?.message}
                {...register('gender', {
                  required: 'Gender is required',
                })}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Contact Number"
                error={errors.contact_number?.message}
                {...register('contact_number', {
                  required: 'Contact number is required',
                })}
              />
              
              <Input
                label="Email (Optional)"
                type="email"
                error={errors.email?.message}
                {...register('email', {
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
              />
            </div>
            
            <Input
              label="Address"
              error={errors.address?.message}
              {...register('address', {
                required: 'Address is required',
              })}
            />
          </Card>
          
          <Card>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Program Enrollment</h3>
            
            <div className="flex items-end gap-2 mb-4">
              <div className="flex-grow">
                <Select
                  label="Select Program"
                  value={selectedProgramId}
                  onChange={setSelectedProgramId}
                  options={[
                    { value: '', label: 'Select a program' },
                    ...programs
                      .filter((program) => !selectedPrograms.includes(program.id))
                      .map((program) => ({
                        value: program.id,
                        label: program.name,
                      })),
                  ]}
                />
              </div>
              <Button
                type="button"
                size="sm"
                leftIcon={<Plus className="h-4 w-4" />}
                onClick={addProgram}
                disabled={!selectedProgramId}
              >
                Add
              </Button>
            </div>
            
            {selectedPrograms.length === 0 ? (
              <div className="text-center py-6 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-500">No programs selected</p>
              </div>
            ) : (
              <ul className="space-y-2">
                {selectedPrograms.map((programId) => {
                  const program = programs.find((p) => p.id === programId);
                  return (
                    <li
                      key={programId}
                      className="flex items-center justify-between bg-cyan-50 px-3 py-2 rounded-md"
                    >
                      <span className="text-sm font-medium text-cyan-700">{program?.name}</span>
                      <button
                        type="button"
                        className="text-gray-400 hover:text-gray-500"
                        onClick={() => removeProgram(programId)}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
            
            <div className="mt-6 flex justify-end">
              <Button
                type="submit"
                leftIcon={<Save className="h-4 w-4" />}
                isLoading={isSubmitting}
              >
                Register Client
              </Button>
            </div>
          </Card>
        </div>
      </form>
    </>
  );
};