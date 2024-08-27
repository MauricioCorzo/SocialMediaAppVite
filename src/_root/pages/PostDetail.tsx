import { Loader } from '@/components/shared/Loader';
import { PostStats } from '@/components/shared/PostStats';
import { Button } from '@/components/ui/button';
import { useUserAuthContext } from '@/context/AuthContext';
import { useGetPostById } from '@/lib/react-query/queriesAndMutations';
import { formatDate } from '@/lib/utils';
import React from 'react';
import { Link, useParams } from 'react-router-dom';

export const PostDetail = () => {
    const { id } = useParams();
    const { data: post, isPending: isPostDetailsLoading } = useGetPostById(id || '');

    const { user } = useUserAuthContext();

    const handleDeletePost = () => {};

    return (
        <div className='w-full'>
            <div className='w-fit mx-auto py-10 px-5 md:px-8 lg:p-14 custom-scrollbar'>
                {isPostDetailsLoading ? (
                    <Loader />
                ) : (
                    <div className='bg-dark-3 w-full max-w-5xl rounded-[24px] p-4 flex-col flex lg:flex-row justify-between gap-4 border border-dark-4'>
                        <img
                            src={post?.imageUrl}
                            alt='Post Image'
                            className='max-h-[20rem] place-self-start md:max-h-96 lg:max-h-[450px] h-auto w-auto lg:max-w-[50%] max-w-[100%] mx-auto rounded-[8px]'
                        />
                        <div className='flex flex-col w-full'>
                            <div className='grid grid-cols-[minmax(0,auto),1fr] gap-3 lg:gap-5 h-min'>
                                <Link to={`/profile/${post?.creator.$id}`} className='flex items-center'>
                                    <img
                                        src={post?.creator.imageUrl || '/assets/icons/profile-placeholder.svg'}
                                        alt='User Profile Logo'
                                        className='rounded-full lg:w-12 w-8  aspect-square'
                                    />
                                </Link>
                                <div className='flex justify-between gap-5'>
                                    <div>
                                        <p className='font-medium lg:font-bold lg:text-lg text-light-1'>{post?.creator.name}</p>
                                        <p className='font-semibold text-xs lg:text-base lg:font-normal text-light-3'>
                                            {formatDate(post?.$createdAt)} - {post?.location}
                                        </p>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <Link
                                            to={`/update-post/${post?.$id}`}
                                            title='Edit Post'
                                            className={`group hover:bg-primary-600 rounded-md p-1 ${user.$id !== post?.creator.$id && 'hidden'}`}
                                        >
                                            <img
                                                src='/assets/icons/edit.svg'
                                                alt='Edit Post Icon'
                                                className={'w-6 aspect-square group-hover:invert group-hover:brightness-0'}
                                            />
                                        </Link>

                                        <Button
                                            onClick={handleDeletePost}
                                            title='Delete Post'
                                            variant={'ghost'}
                                            className={`group ${user.$id !== post?.creator.$id && 'hidden'} hover:bg-red-500 h-auto p-1`}
                                        >
                                            <img
                                                src='/assets/icons/delete.svg'
                                                alt='Delete Post Icon'
                                                className='w-6 aspect-square group-hover:brightness-0 group-hover:invert '
                                            />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <hr className='border border-dark-4/80 w-full my-4' />
                            <div className='text-sm lg:text-base font-medium leading-[140%] py-2'>
                                <p>{post?.caption}</p>
                                <ul className='flex gap-2 mt-2'>
                                    {post?.tags.map((tag) => (
                                        <li key={tag} className='text-light-3'>
                                            #{tag}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className='mt-auto'>
                                <PostStats post={post!} userId={user.$id} />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
