import { UserButton } from '@clerk/nextjs';

import { MobileSidebar } from '@/components/mobile-sidebar';

export const Navbar = () => {
  return (
    <div className='p-4 flex items-center'>
      <MobileSidebar />
      <div className='flex justify-end w-full'>
        <UserButton afterSignOutUrl='/' />
      </div>
    </div>
  );
};
