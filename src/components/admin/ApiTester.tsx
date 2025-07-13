import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ApiTest {
  name: string;
  url: string;
  method: string;
  expectedStatus: number;
  testData?: any;
}

export const ApiTester: React.FC = () => {
  const [results, setResults] = useState<Record<string, any>>({});
  const [isRunning, setIsRunning] = useState(false);
  const { toast } = useToast();

  const apiTests: ApiTest[] = [
    {
      name: 'Agent Status Check',
      url: 'https://draminesaid.com/lucci/api/agent_status.php?action=count',
      method: 'GET',
      expectedStatus: 200
    },
    {
      name: 'Get All Products',
      url: 'https://draminesaid.com/lucci/api/get_all_products.php',
      method: 'GET',
      expectedStatus: 200
    },
    {
      name: 'Get Featured Products',
      url: 'https://draminesaid.com/lucci/api/get_exclusive_collection.php',
      method: 'GET',
      expectedStatus: 200
    },
    {
      name: 'Chat Sessions',
      url: 'https://draminesaid.com/lucci/api/chat_sessions.php',
      method: 'GET',
      expectedStatus: 200
    },
    {
      name: 'Store Initial Message',
      url: 'https://draminesaid.com/lucci/api/store_initial_message.php',
      method: 'POST',
      expectedStatus: 200,
      testData: {
        temp_session_id: 'test_session_123',
        message_content: 'Test initial message',
        message_type: 'text'
      }
    },
    {
      name: 'Chat Messages',
      url: 'https://draminesaid.com/lucci/api/chat_messages.php?session_id=test_session',
      method: 'GET',
      expectedStatus: 200
    }
  ];

  const testApi = async (test: ApiTest) => {
    try {
      const options: RequestInit = {
        method: test.method,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (test.testData && test.method === 'POST') {
        options.body = JSON.stringify(test.testData);
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(test.url, {
        ...options,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const responseText = await response.text();
      let responseData;

      try {
        responseData = JSON.parse(responseText);
      } catch {
        responseData = { raw: responseText };
      }

      return {
        name: test.name,
        status: response.status,
        success: response.ok,
        data: responseData,
        error: null,
        url: test.url
      };
    } catch (error: any) {
      return {
        name: test.name,
        status: 0,
        success: false,
        data: null,
        error: error.message,
        url: test.url
      };
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setResults({});

    for (const test of apiTests) {
      const result = await testApi(test);
      setResults(prev => ({ ...prev, [test.name]: result }));
      
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setIsRunning(false);
    
    const successCount = Object.values(results).filter((r: any) => r?.success).length;
    const totalTests = apiTests.length;
    
    toast({
      title: `API Tests Complete`,
      description: `${successCount}/${totalTests} tests passed`,
      variant: successCount === totalTests ? 'default' : 'destructive'
    });
  };

  const getStatusIcon = (result: any) => {
    if (!result) return <Loader2 className="w-4 h-4 animate-spin" />;
    return result.success ? 
      <CheckCircle className="w-4 h-4 text-green-500" /> : 
      <XCircle className="w-4 h-4 text-red-500" />;
  };

  const getStatusBadge = (result: any) => {
    if (!result) return <Badge variant="secondary">Testing...</Badge>;
    return (
      <Badge variant={result.success ? 'default' : 'destructive'}>
        Status: {result.status || 'Failed'}
      </Badge>
    );
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">API Testing Dashboard</h1>
        <Button onClick={runAllTests} disabled={isRunning}>
          {isRunning ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Testing...
            </>
          ) : (
            'Run All Tests'
          )}
        </Button>
      </div>

      <div className="grid gap-4">
        {apiTests.map((test) => {
          const result = results[test.name];
          return (
            <Card key={test.name}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(result)}
                    {test.name}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{test.method}</Badge>
                    {getStatusBadge(result)}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground font-mono">
                    {test.url}
                  </p>
                  {result && (
                    <div className="bg-muted p-3 rounded">
                      <pre className="text-xs overflow-auto max-h-32">
                        {result.error ? 
                          `Error: ${result.error}` : 
                          JSON.stringify(result.data, null, 2)
                        }
                      </pre>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};