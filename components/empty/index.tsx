interface EmptyProps {
  label: string;
}

export const Empty = ({ label }: EmptyProps) => {
  return (
    <div className='h-full p-20 flex flex-col items-center justify-center'>
      {/* <iframe src='https://lottie.host/embed/a989b342-5e43-49cb-9333-f65dfb17cfad/NXh6V99WF2.json'></iframe> */}
      <p className='text-muted-foreground text-sm text-center mt-3'>{label}</p>
    </div>
  );
};
