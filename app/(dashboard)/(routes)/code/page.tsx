'use client';

import { useState } from 'react';

import * as z from 'zod';
import axios from 'axios';
import { Code } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';

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

const CodePage = () => {
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
      const response = await axios.post('/api/code', {
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
        description='Generate code with descriptive text.'
        icon={Code}
        title='Code'
        bgColor='bg-green-700/10'
        iconColor='text-green-700'
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
                          placeholder='Simple toggle button using react hooks.'
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
                  <ReactMarkdown
                    className='text-sm overflow-hidden leading-7'
                    components={{
                      code(props) {
                        const { children, className, node, ...rest } = props;
                        const match = /language-(\w+)/.exec(className || '');
                        console.log('match', match);
                        return match ? (
                          <SyntaxHighlighter
                            language={match[1]}
                            style={dracula}
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        ) : (
                          <code {...rest} className={className}>
                            {children}
                          </code>
                        );
                      },
                    }}
                  >
                    {Array.isArray(message.content)
                      ? message.content
                          .map((part, partIndex) => {
                            if ('text' in part) {
                              return <span key={partIndex}>{part.text}</span>;
                            } else {
                              // Handle 'ChatCompletionContentPartImage' case here
                              return null;
                            }
                          })
                          .join('')
                      : message.content || ''}
                  </ReactMarkdown>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodePage;
