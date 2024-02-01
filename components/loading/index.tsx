import Image from 'next/image';

export const LoadingState = () => {
  return (
    <div className='p-5 flex flex-col items-center justify-center'>
      <div className='w-10 h-10 relative animate-spin'>
        <Image src='/an-logo.svg' fill alt='arian' />
      </div>
      <p className='text-muted-foreground text-sm'>Extreme is thinking</p>
    </div>
  );
};
