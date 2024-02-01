'use client';

import { useState } from 'react';

import * as z from 'zod';
import axios from 'axios';
import { MessageSquare } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';

import { Heading } from '@/components/heading';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';

import { formSchema } from './constants';
import { Button } from '@/components/ui/button';
import { ChatCompletionAssistantMessageParam, ChatCompletionUserMessageParam } from 'openai/resources/index.mjs';
import { Empty } from '@/components/empty';
import { LoadingState } from '@/components/loading';
import { cn } from '@/lib/utils';
import { UserAvatar } from '@/components/avatar/user-avatar';
import { AiAvatar } from '@/components/avatar/ai-avatar';

type Role = 'assistant' | 'user';

const ConversationPage = () => {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatCompletionAssistantMessageParam[] | ChatCompletionUserMessageParam[]>(
    [],
  );
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
    },
  });

  const isLoading = form.formState.isLoading || form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const userMessage = {
        role: 'user',
        content: values.prompt,
      };

      const newMessages = [...messages, userMessage];
      const response = await axios.post('/api/conversation', {
        messages: newMessages,
      });

      setMessages([...newMessages, response.data]);
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
        description='Our most advanced conversation model.'
        icon={MessageSquare}
        title='Conversation'
        bgColor='bg-violet-500/10'
        iconColor='text-violet-500'
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
                          placeholder='How do I calculate the radius of a circle'
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
          {messages.length === 0 && !isLoading && <Empty label='No conversation started.' />}
          <div className='flex flex-col-reverse gap-y-4'>
            {messages.map((message, index) => {
              const { role }: { role: Role } = message;
              return (
                <div
                  className={cn(
                    'p-8 w-full rounded-lg flex items-start gap-x-8',
                    role === 'user' ? 'bg-white border border-black/10' : 'bg-muted',
                  )}
                  key={index}
                >
                  {role === 'user' ? <UserAvatar /> : <AiAvatar />}
                  {Array.isArray(message.content) ? (
                    message.content.map((part, partIndex) => {
                      if ('text' in part) {
                        return (
                          <span key={partIndex} className='text-sm'>
                            {part.text}
                          </span>
                        );
                      } else {
                        // Handle 'ChatCompletionContentPartImage' case here
                        return null;
                      }
                    })
                  ) : (
                    <p className='text-sm'>{message.content}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationPage;
