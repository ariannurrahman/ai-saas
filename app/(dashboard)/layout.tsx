import { Navbar } from '@/components/navbar';
import { Sidebar } from '@/components/sidebar';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='relative h-full'>
      <div className='hidden md:flex md:flex-col md:fixed md:h-full md:inset-y-0 md:z-[80] w-72 bg-slate-700'>
        <Sidebar />
      </div>
      <div className='md:pl-72'>
        <Navbar />
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
