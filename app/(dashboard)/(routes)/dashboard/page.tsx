'use client';

import { Card } from '@/components/ui/card';
import { TOOLS } from '@/constants';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

const DashboardPage = () => {
  const router = useRouter();

  return (
    <div className='pb-40'>
      <div className='mb-8 space-y-4'>
        <h2 className='text-2xl md:text-4xl font-bold text-center'>Explore the power of AI</h2>
        <p className='text-muted-foreground font-light text-center text-sm lg:text-lg'>
          Interact with the smartest AI, experience the power of AI
        </p>
      </div>
      <div className='px-4 md:px-20 lg:px-32 space-y-4'>
        {TOOLS.map((tool) => {
          const { bgColor, color, href, label } = tool;
          return (
            <Card
              onClick={() => router.push(href)}
              className='p-4 border-black/5 flex items-center justify-between hover:shadow-md transition cursor-pointer'
              key={href}
            >
              <div className='flex items-center gap-x-4'>
                <div className={cn('p-2 w-fit rounded-md', bgColor)}>
                  <tool.icon className={cn('w-8 h-8', color)} />
                </div>
                <p className='font-semibold'>{label}</p>
              </div>
              <ArrowRight className='w-5 h-5' />
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardPage;
