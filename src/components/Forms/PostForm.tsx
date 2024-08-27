import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { FileUploader } from '../shared/FileUploader';
import { Input } from '../ui/input';
import { PostValidationSchema, type PostValidationSchemaType } from '@/lib/validation';
import { Models } from 'appwrite';
import { useCreatePost, useUpdatePost } from '@/lib/react-query/queriesAndMutations';
import { useUserAuthContext } from '@/context/AuthContext';
import { useToast } from '../ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { Loader } from '../shared/Loader';
import { Post } from '@/types';

type PostFormProps = {
    post: (Models.Document & Post) | undefined;
    action: 'Create' | 'Update';
};

export const PostForm = ({ post, action }: PostFormProps) => {
    const { mutateAsync: createPost, isPending: isSumbittingPost } = useCreatePost();
    const { mutateAsync: updatePost, isPending: isUpdatingPost } = useUpdatePost();
    const { user } = useUserAuthContext();
    const { toast } = useToast();

    const navigate = useNavigate();

    const form = useForm<PostValidationSchemaType>({
        resolver: zodResolver(PostValidationSchema),
        defaultValues: {
            caption: post ? post?.caption : '',
            file: [],
            location: post ? post?.location : '',
            tags: post ? post?.tags?.join(',') : '',
        },
    });

    async function onSubmit(values: PostValidationSchemaType) {
        try {
            if (post && action === 'Update') {
                await updatePost({
                    ...values,
                    postId: post.$id,
                    imageId: post?.imageId,
                    imageUrl: post?.imageUrl,
                });
                toast({ title: 'Post updated successfully!' });
                navigate(`/posts/${post.$id}`);
            } else {
                await createPost({
                    ...values,
                    userId: user.$id,
                });

                toast({ title: 'Post created successfully!' });
                navigate('/');
            }
        } catch (error) {
            const err = error as Error;
            toast({ title: err.message, variant: 'destructive' });
        }
    }
    return (
        <div className='w-full max-w-5xl mx-auto'>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-9'>
                    <FormField
                        control={form.control}
                        name='caption'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='text-white'>Caption</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder='Post...'
                                        {...field}
                                        className='h-36 bg-dark-3 rounded-xl border-none  focus-visible:ring-offset-1 ring-offset-light-3'
                                    />
                                </FormControl>

                                <FormMessage className='text-red-500' />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='file'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='text-white'>Add Photos</FormLabel>
                                <FormControl>
                                    <FileUploader fieldChange={field.onChange} mediaUrl={post?.imageUrl} />
                                </FormControl>

                                <FormMessage className='text-red-500' />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='location'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='text-white'>Add Location</FormLabel>
                                <FormControl>
                                    <Input
                                        type='text'
                                        {...field}
                                        className='h-12 bg-dark-4 border-none placeholder:text-light-4  focus-visible:ring-offset-1 ring-offset-light-3'
                                    />
                                </FormControl>

                                <FormMessage className='text-red-500' />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='tags'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='text-white'>{'Add Tags (separated by comma " , ")'}</FormLabel>
                                <FormControl>
                                    <Input
                                        type='text'
                                        placeholder='Art, Expression, Learn, etc..'
                                        {...field}
                                        className='h-12 bg-dark-4 border-none placeholder:text-light-4  focus-visible:ring-offset-1 ring-offset-light-3'
                                    />
                                </FormControl>

                                <FormMessage className='text-red-500' />
                            </FormItem>
                        )}
                    />
                    <div className='flex gap-4 items-start justify-end'>
                        <Button type='button' className='h-10 bg-dark-4 px-5 text-light-1 flex gap-2'>
                            Cancel
                        </Button>
                        <Button
                            type='submit'
                            disabled={isSumbittingPost || isUpdatingPost}
                            className='h-10 w-28 bg-primary-500 hover:bg-primary-600 text-light-1 flex gap-2 disabled:opacity-100'
                        >
                            {isSumbittingPost || isUpdatingPost ? <Loader /> : `${action} Post`}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};
