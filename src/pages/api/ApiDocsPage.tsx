import React from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Code, Copy } from 'lucide-react';
import toast from 'react-hot-toast';

export const ApiDocsPage = () => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            API Documentation
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Integrate with our health information system using these API endpoints.
          </p>
        </div>
      </div>
      
      <Card title="Authentication" className="mb-6">
        <p className="mb-4">
          All API requests must include an API key in the headers. Contact the administrator to
          get your API key.
        </p>
        
        <div className="bg-gray-50 rounded-md p-4 mb-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium text-gray-700">Request Header Example</h4>
            <Button
              size="sm"
              variant="outline"
              leftIcon={<Copy className="h-3 w-3" />}
              onClick={() =>
                copyToClipboard(`Authorization: Bearer YOUR_API_KEY`)
              }
            >
              Copy
            </Button>
          </div>
          <pre className="bg-gray-800 text-white p-3 rounded text-sm overflow-x-auto">
            <code>{`Authorization: Bearer YOUR_API_KEY`}</code>
          </pre>
        </div>
      </Card>
      
      <Card title="Client API" className="mb-6">
        <h3 className="text-xl font-semibold mb-4">Endpoints</h3>
        
        <div className="mb-8">
          <div className="flex items-center mb-2">
            <div className="bg-green-100 text-green-800 font-medium px-2 py-1 rounded text-xs mr-2">
              GET
            </div>
            <h4 className="font-medium text-gray-800">/api/clients</h4>
          </div>
          <p className="mb-4 text-gray-600">Get a list of all clients</p>
          
          <div className="bg-gray-50 rounded-md p-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium text-gray-700">Response Example</h4>
              <Button
                size="sm"
                variant="outline"
                leftIcon={<Copy className="h-3 w-3" />}
                onClick={() =>
                  copyToClipboard(`{
  "success": true,
  "data": [
    {
      "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      "first_name": "John",
      "last_name": "Doe",
      "date_of_birth": "1980-01-01",
      "gender": "male",
      "contact_number": "+1234567890",
      "email": "john.doe@example.com",
      "address": "123 Main St, City",
      "created_at": "2023-05-23T14:56:29.000Z"
    },
    ...
  ]
}`)
                }
              >
                Copy
              </Button>
            </div>
            <pre className="bg-gray-800 text-white p-3 rounded text-sm overflow-x-auto">
              <code>{`{
  "success": true,
  "data": [
    {
      "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      "first_name": "John",
      "last_name": "Doe",
      "date_of_birth": "1980-01-01",
      "gender": "male",
      "contact_number": "+1234567890",
      "email": "john.doe@example.com",
      "address": "123 Main St, City",
      "created_at": "2023-05-23T14:56:29.000Z"
    },
    ...
  ]
}`}</code>
            </pre>
          </div>
        </div>
        
        <div className="mb-8">
          <div className="flex items-center mb-2">
            <div className="bg-green-100 text-green-800 font-medium px-2 py-1 rounded text-xs mr-2">
              GET
            </div>
            <h4 className="font-medium text-gray-800">/api/clients/:id</h4>
          </div>
          <p className="mb-4 text-gray-600">Get details of a specific client</p>
          
          <div className="bg-gray-50 rounded-md p-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium text-gray-700">Response Example</h4>
              <Button
                size="sm"
                variant="outline"
                leftIcon={<Copy className="h-3 w-3" />}
                onClick={() =>
                  copyToClipboard(`{
  "success": true,
  "data": {
    "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "first_name": "John",
    "last_name": "Doe",
    "date_of_birth": "1980-01-01",
    "gender": "male",
    "contact_number": "+1234567890",
    "email": "john.doe@example.com",
    "address": "123 Main St, City",
    "created_at": "2023-05-23T14:56:29.000Z",
    "programs": [
      {
        "id": "a2b4c6d8-e0f2-4681-8024-6a9b3c5d7e8f",
        "name": "Diabetes Management",
        "enrollment_status": "active",
        "enrollment_date": "2023-05-24T10:30:00.000Z"
      }
    ]
  }
}`)
                }
              >
                Copy
              </Button>
            </div>
            <pre className="bg-gray-800 text-white p-3 rounded text-sm overflow-x-auto">
              <code>{`{
  "success": true,
  "data": {
    "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "first_name": "John",
    "last_name": "Doe",
    "date_of_birth": "1980-01-01",
    "gender": "male",
    "contact_number": "+1234567890",
    "email": "john.doe@example.com",
    "address": "123 Main St, City",
    "created_at": "2023-05-23T14:56:29.000Z",
    "programs": [
      {
        "id": "a2b4c6d8-e0f2-4681-8024-6a9b3c5d7e8f",
        "name": "Diabetes Management",
        "enrollment_status": "active",
        "enrollment_date": "2023-05-24T10:30:00.000Z"
      }
    ]
  }
}`}</code>
            </pre>
          </div>
        </div>
        
        <div className="mb-8">
          <div className="flex items-center mb-2">
            <div className="bg-green-100 text-green-800 font-medium px-2 py-1 rounded text-xs mr-2">
              GET
            </div>
            <h4 className="font-medium text-gray-800">/api/clients/:id/programs</h4>
          </div>
          <p className="mb-4 text-gray-600">Get all programs a client is enrolled in</p>
          
          <div className="bg-gray-50 rounded-md p-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium text-gray-700">Response Example</h4>
              <Button
                size="sm"
                variant="outline"
                leftIcon={<Copy className="h-3 w-3" />}
                onClick={() =>
                  copyToClipboard(`{
  "success": true,
  "data": [
    {
      "id": "a2b4c6d8-e0f2-4681-8024-6a9b3c5d7e8f",
      "name": "Diabetes Management",
      "description": "Program for managing diabetes and related complications",
      "enrollment_status": "active",
      "enrollment_date": "2023-05-24T10:30:00.000Z",
      "created_at": "2023-05-20T09:15:00.000Z"
    }
  ]
}`)
                }
              >
                Copy
              </Button>
            </div>
            <pre className="bg-gray-800 text-white p-3 rounded text-sm overflow-x-auto">
              <code>{`{
  "success": true,
  "data": [
    {
      "id": "a2b4c6d8-e0f2-4681-8024-6a9b3c5d7e8f",
      "name": "Diabetes Management",
      "description": "Program for managing diabetes and related complications",
      "enrollment_status": "active",
      "enrollment_date": "2023-05-24T10:30:00.000Z",
      "created_at": "2023-05-20T09:15:00.000Z"
    }
  ]
}`}</code>
            </pre>
          </div>
        </div>
      </Card>
      
      <Card title="Implementation Steps">
        <ol className="list-decimal ml-6 space-y-4">
          <li>
            <strong>Request API Credentials</strong>
            <p className="text-gray-600 mt-1">
              Contact the system administrator to get your API key.
            </p>
          </li>
          <li>
            <strong>Make API Requests</strong>
            <p className="text-gray-600 mt-1">
              Use the endpoints above with your API key in the Authorization header.
            </p>
          </li>
          <li>
            <strong>Handle Responses</strong>
            <p className="text-gray-600 mt-1">
              Process the JSON responses according to your application needs.
            </p>
          </li>
          <li>
            <strong>Implement Error Handling</strong>
            <p className="text-gray-600 mt-1">
              Check for error responses and implement appropriate error handling.
            </p>
          </li>
        </ol>
        
        <div className="mt-6 bg-cyan-50 rounded-md p-4">
          <h4 className="font-medium text-cyan-800 mb-2">Sample Code (JavaScript)</h4>
          <div className="bg-gray-50 rounded-md p-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium text-gray-700">Fetch Client Profile</h4>
              <Button
                size="sm"
                variant="outline"
                leftIcon={<Copy className="h-3 w-3" />}
                onClick={() =>
                  copyToClipboard(`// Example using fetch API
const fetchClientProfile = async (clientId) => {
  try {
    const response = await fetch(\`https://api.healthsystem.com/api/clients/\${clientId}\`, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch client profile');
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching client profile:', error);
    throw error;
  }
};

// Usage
fetchClientProfile('f47ac10b-58cc-4372-a567-0e02b2c3d479')
  .then(clientProfile => {
    console.log('Client Profile:', clientProfile);
  })
  .catch(error => {
    console.error('Error:', error);
  });`)
                }
              >
                Copy
              </Button>
            </div>
            <pre className="bg-gray-800 text-white p-3 rounded text-sm overflow-x-auto">
              <code>{`// Example using fetch API
const fetchClientProfile = async (clientId) => {
  try {
    const response = await fetch(\`https://api.healthsystem.com/api/clients/\${clientId}\`, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch client profile');
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching client profile:', error);
    throw error;
  }
};

// Usage
fetchClientProfile('f47ac10b-58cc-4372-a567-0e02b2c3d479')
  .then(clientProfile => {
    console.log('Client Profile:', clientProfile);
  })
  .catch(error => {
    console.error('Error:', error);
  });`}</code>
            </pre>
          </div>
        </div>
      </Card>
    </div>
  );
};