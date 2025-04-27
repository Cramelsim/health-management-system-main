import React, { useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Plus, Search, UserPlus } from 'lucide-react';
import { supabase, User } from '../../lib/supabase';
import { useAuth } from '../../lib/auth';
import toast from 'react-hot-toast';

type NewUserFormData = {
  email: string;
  password: string;
  role: string;
};

export const UsersListPage = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState<NewUserFormData>({
    email: '',
    password: '',
    role: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select(`
            id,
            role,
            created_at,
            auth_user:id (
              email
            )
          `)
          .order('created_at');
          
        if (error) throw error;
        
        // Transform the data to match the User type
        const transformedUsers = data?.map(user => ({
          id: user.id,
          email: user.auth_user.email,
          role: user.role,
          created_at: user.created_at
        })) || [];
        
        setUsers(transformedUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('Failed to load users');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUsers();
  }, []);
  
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser?.id) return;
    
    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase.rpc('create_user_with_profile', {
        email: newUser.email,
        password: newUser.password,
        user_role: newUser.role,
      });
      
      if (error) throw error;
      
      // Refresh user list
      const { data: updatedUsers } = await supabase
        .from('user_profiles')
        .select(`
          id,
          role,
          created_at,
          auth_user:id (
            email
          )
        `)
        .order('created_at');
        
      const transformedUsers = updatedUsers?.map(user => ({
        id: user.id,
        email: user.auth_user.email,
        role: user.role,
        created_at: user.created_at
      })) || [];
      
      setUsers(transformedUsers);
      setShowAddUser(false);
      setNewUser({ email: '', password: '', role: '' });
      toast.success('User created successfully');
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Failed to create user');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase.rpc('update_user_role', {
        user_id: userId,
        new_role: newRole,
      });
      
      if (error) throw error;
      
      // Update local state
      setUsers(users.map(u => 
        u.id === userId ? { ...u, role: newRole } : u
      ));
      
      toast.success('User role updated successfully');
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update user role');
    }
  };
  
  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <>
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            User Management
          </h2>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Button
            leftIcon={<UserPlus className="h-4 w-4" />}
            onClick={() => setShowAddUser(true)}
          >
            Add New User
          </Button>
        </div>
      </div>
      
      <Card className="mb-6">
        <div className="flex items-center">
          <div className="flex-grow max-w-md">
            <Input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search className="h-5 w-5 text-gray-400" />}
            />
          </div>
        </div>
      </Card>
      
      {showAddUser && (
        <Card className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Add New User</h3>
          <form onSubmit={handleAddUser}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                required
              />
              <Input
                label="Password"
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                required
              />
              <Select
                label="Role"
                value={newUser.role}
                onChange={(value) => setNewUser({ ...newUser, role: value })}
                options={[
                  { value: '', label: 'Select role' },
                  { value: 'doctor', label: 'Doctor' },
                  { value: 'admin', label: 'Admin' },
                ]}
                required
              />
            </div>
            <div className="mt-4 flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddUser(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                leftIcon={<Plus className="h-4 w-4" />}
                isLoading={isSubmitting}
              >
                Add User
              </Button>
            </div>
          </form>
        </Card>
      )}
      
      {isLoading ? (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin h-12 w-12 rounded-full border-t-2 border-b-2 border-cyan-600"></div>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-cyan-100 flex items-center justify-center">
                          <UserPlus className="h-6 w-6 text-cyan-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Select
                      value={user.role}
                      onChange={(value) => handleUpdateRole(user.id, value)}
                      options={[
                        { value: 'doctor', label: 'Doctor' },
                        { value: 'admin', label: 'Admin' },
                      ]}
                      disabled={user.id === currentUser?.id}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {user.id === currentUser?.id && (
                      <span className="text-gray-500">(Current User)</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};