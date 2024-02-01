'use client';

import { useState } from 'react';

import * as z from 'zod';
import axios from 'axios';
import { Download, ImageIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';

import { Heading } from '@/components/heading';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { amountOptions, formSchema, resolutionOptions } from './constants';
import { Button } from '@/components/ui/button';
import { Empty } from '@/components/empty';
import { LoadingState } from '@/components/loading';
import { Card, CardFooter } from '@/components/ui/card';
import Image from 'next/image';

const ImagePage = () => {
  const router = useRouter();
  const [images, setImages] = useState<string[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
      amount: '1',
      resolution: '512x512',
    },
  });

  const isLoading = form.formState.isLoading || form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setImages([]);
      console.log('values', values);
      const response = await axios.post('/api/image', values);

      const urls = response.data.map((image: { url: string }) => image.url);

      setImages(urls);

      form.reset();
    } catch (err) {
      // TODO OPEN PRO MODAL
      console.log('err', err);
    } finally {
      router.refresh();
    }
  };

  console.log('images', images);
  return (
    <div>
      <Heading
        description='Turn you prompt into an image.'
        icon={ImageIcon}
        title='Image Generation'
        bgColor='bg-pink-500/10'
        iconColor='text-pink-500'
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
                    <FormItem className='col-span-12 lg:col-span-6'>
                      <FormControl className='p-0 m-0'>
                        <Input
                          className='border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent'
                          disabled={isLoading}
                          placeholder='A picture of snail in aquascape'
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  );
                }}
              />
              <FormField
                name='amount'
                control={form.control}
                render={({ field }) => {
                  return (
                    <FormItem className='col-span-12 lg:col-span-2'>
                      <Select
                        disabled={field.disabled || isLoading}
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue defaultValue={field.value} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {amountOptions.map(({ label, value }) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  );
                }}
              />
              <FormField
                name='resolution'
                control={form.control}
                render={({ field }) => {
                  return (
                    <FormItem className='col-span-12 lg:col-span-2'>
                      <Select
                        disabled={field.disabled || isLoading}
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue defaultValue={field.value} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {resolutionOptions.map(({ label, value }) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
          {images.length === 0 && !isLoading && <Empty label='No images generated.' />}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8'>
            {images.map((src) => (
              <Card key={src} className='rounded-lg overflow-hidden'>
                <div className='relative aspect-square'>
                  <Image src={src} alt='src' fill />
                </div>
                <CardFooter className='p-2'>
                  <Button variant='secondary' className='w-full' onClick={() => window.open(src)}>
                    <Download className='h-4 w-2 mr-2' /> Download
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImagePage;
