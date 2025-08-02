'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardClient({ user }: { user: any }) {
  const [count, setCount] = useState(0);

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle>Welcome, {user.email}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is your dashboard.</p>
          <Button onClick={() => setCount(count + 1)}>Click count: {count}</Button>
        </CardContent>
      </Card>
    </div>
  );
}
