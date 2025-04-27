import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { ArrowLeft, Save } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/auth';
import toast from 'react-hot-toast';

type ProgramFormData = {
  name: string;
  description: string;
};

export const CreateProgramPage = () => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProgramFormData>({
    defaultValues: {
      name: '',
      description: '',
    },
  });
  
  const onSubmit = async (data: ProgramFormData) => {
    if (!user) return;
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.from('programs').insert({
        name: data.name,
        description: data.description,
        created_by: user.id,
      });
      
      if (error) throw error;
      
      toast.success('Program created successfully');
      navigate('/programs');
    } catch (error) {
      console.error('Error creating program:', error);
      toast.error('Failed to create program');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <>
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Create Health Program
          </h2>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Button
            variant="outline"
            leftIcon={<ArrowLeft className="h-4 w-4" />}
            onClick={() => navigate('/programs')}
          >
            Back to Programs
          </Button>
        </div>
      </div>
      
      <Card>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Program Name"
            placeholder="e.g., Tuberculosis Control Program"
            error={errors.name?.message}
            {...register('name', {
              required: 'Program name is required',
              maxLength: {
                value: 100,
                message: 'Program name cannot exceed 100 characters',
              },
            })}
          />
          
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm ${
                errors.description
                  ? 'border-red-300 text-red-900 placeholder-red-300'
                  : 'border-gray-300 placeholder-gray-400'
              }`}
              placeholder="Describe the health program and its objectives..."
              {...register('description', {
                required: 'Description is required',
                maxLength: {
                  value: 500,
                  message: 'Description cannot exceed 500 characters',
                },
              })}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>
          
          <div className="flex justify-end">
            <Button
              type="submit"
              leftIcon={<Save className="h-4 w-4" />}
              isLoading={isSubmitting}
            >
              Create Program
            </Button>
          </div>
        </form>
      </Card>
    </>
  );
};