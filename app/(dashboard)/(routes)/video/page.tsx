'use client';

import { useState } from 'react';

import * as z from 'zod';
import axios from 'axios';
import { Video } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';

import { Heading } from '@/components/heading';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';

import { formSchema } from './constants';
import { Button } from '@/components/ui/button';
import { Empty } from '@/components/empty';
import { LoadingState } from '@/components/loading';

const VideoPage = () => {
  const router = useRouter();
  const [video, setVideo] = useState<string>();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
    },
  });

  const isLoading = form.formState.isLoading || form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setVideo(undefined);
      const response = await axios.post('/api/video', values);

      setVideo(response.data[0]);
      form.reset();
    } catch (err) {
      // TODO OPEN PRO MODAL
      console.log('err', err);
    } finally {
      router.refresh();
    }
  };

  return (
    <div>
      <Heading
        description='Turn your prompt into a video.'
        icon={Video}
        title='Video Generation'
        bgColor='bg-orange-500/10'
        iconColor='text-orange-500'
      />
      <div className='px-4 lg:px-8'>
        <div>
          <Form {...form}>
            <form
              className='rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2'
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                name='prompt'
                render={({ field }) => {
                  return (
                    <FormItem className='col-span-12 lg:col-span-10'>
                      <FormControl className='p-0 m-0'>
                        <Input
                          className='border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent'
                          disabled={isLoading}
                          placeholder='Rainbow in the sky'
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  );
                }}
              />
              <Button className='col-span-12 lg:col-span-2 w-full' disabled={isLoading}>
                Generate
              </Button>
            </form>
          </Form>
        </div>
        <div className='space-y-4 mt-4'>
          {isLoading && (
            <div className='bg-muted p-8 rounded-lg w-full flex items-center justify-center'>
              <LoadingState />
            </div>
          )}
          {!video && !isLoading && <Empty label='No video generated.' />}
          {video && (
            <video className='w-full aspect-video mt-8 rounded-lg border bg0black' controls>
              <source src={video} />
            </video>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoPage;
