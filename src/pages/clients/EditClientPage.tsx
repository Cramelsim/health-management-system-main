import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { ArrowLeft, Save } from 'lucide-react';
import { supabase } from '../../lib/supabase';
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

export const EditClientPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ClientFormData>();
  
  useEffect(() => {
    const fetchClient = async () => {
      if (!id) return;
      
      try {
        const { data, error } = await supabase
          .from('clients')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) throw error;
        
        // Format date to YYYY-MM-DD for input
        const formattedData = {
          ...data,
          date_of_birth: new Date(data.date_of_birth).toISOString().split('T')[0],
        };
        
        reset(formattedData);
      } catch (error) {
        console.error('Error fetching client:', error);
        toast.error('Failed to load client details');
        navigate('/clients');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchClient();
  }, [id, reset, navigate]);
  
  const onSubmit = async (data: ClientFormData) => {
    if (!user || !id) return;
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('clients')
        .update({
          first_name: data.first_name,
          last_name: data.last_name,
          date_of_birth: data.date_of_birth,
          gender: data.gender,
          contact_number: data.contact_number,
          email: data.email || null,
          address: data.address,
        })
        .eq('id', id);
        
      if (error) throw error;
      
      toast.success('Client updated successfully');
      navigate(`/clients/${id}`);
    } catch (error) {
      console.error('Error updating client:', error);
      toast.error('Failed to update client');
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
  
  return (
    <>
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Edit Client
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
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
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
          
          <div className="mt-6 flex justify-end">
            <Button
              type="submit"
              leftIcon={<Save className="h-4 w-4" />}
              isLoading={isSubmitting}
            >
              Save Changes
            </Button>
          </div>
        </Card>
      </form>
    </>
  );
};