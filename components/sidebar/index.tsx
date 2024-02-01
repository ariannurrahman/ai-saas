'use client';

import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

import { ROUTES } from '@/constants';

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className='space-y-4 py-4 flex flex-col h-full bg-[#111827] text-white'>
      <div className='px-3 flex-1'>
        <Link className='flex items-center pl-3 mb-14' href='/dashboard'>
          <div className='relative w-10 h-10 mr-4'>
            <Image alt='extreme logo' fill src='/an-logo.svg' />
          </div>
          <h1 className='font-bold text-2xl font-roboto'>Extreme</h1>
        </Link>
        <div className='space-y-1'>
          {ROUTES.map((route) => {
            return (
              <Link
                className={cn(
                  'group text-sm w-full flex p-3 justify-start font-medium cursor-pointer rounded-lg transition hover:text-white hover:bg-white/10',
                  pathname === route.href ? 'text-white bg-white/10' : 'text-zinc-400',
                )}
                href={route.href}
                key={route.label}
              >
                <div className='flex items-center'>
                  <route.icon className={cn('h-5 w-5 mr-3', route.color)} />
                </div>
                {route.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};
