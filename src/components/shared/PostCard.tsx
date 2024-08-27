import { useUserAuthContext } from '@/context/AuthContext';
import { type Post } from '@/types';
import { type Models } from 'appwrite';
import React from 'react';
import { Link } from 'react-router-dom';
import { PostStats } from './PostStats';
import { formatDate } from '@/lib/utils';

type PostCardProps = {
    post: Models.Document & Post;
};

export const PostCard = ({ post }: PostCardProps) => {
    const { user } = useUserAuthContext();

    return (
        <li className='bg-dark-2 rounded-3xl border border-dark-4 p-5 lg:p-7'>
            <div className='flex justify-between items-center'>
                <div className='grid grid-cols-[minmax(0,50px),1fr] gap-5'>
                    <Link to={`/profile/${post.creator.$id}`}>
                        <img
                            src={post.creator.imageUrl || '/assets/icons/profile-placeholder.svg'}
                            alt='User Profile Logo'
                            className='rounded-full w-12 aspect-square'
                        />
                    </Link>
                    <div className=''>
                        <p className='font-medium lg:font-bold lg:text-lg text-light-1'>{post.creator.name}</p>
                        <p className='font-semibold text-xs lg:text-base lg:font-normal text-light-3'>
                            {formatDate(post.$createdAt)} - {post.location}
                        </p>
                    </div>
                </div>

                <Link to={`/update-post/${post.$id}`} className={`${user.$id !== post.creator.$id && 'hidden'}`}>
                    <img src='/assets/icons/edit.svg' alt='Edit Post Icon' className='w-5 aspect-square' />
                </Link>
            </div>

            <Link to={`/posts/${post.$id}`}>
                <div className='text-sm lg:text-base font-medium leading-[140%] py-5'>
                    <p>{post.caption}</p>
                    <ul className='flex gap-2 mt-2'>
                        {post.tags.map((tag) => (
                            <li key={tag} className='text-light-3'>
                                #{tag}
                            </li>
                        ))}
                    </ul>
                </div>

                <img
                    src={post.imageUrl || '/assets/icons/profile-placeholder.svg'}
                    alt='Post Card Image'
                    className='max-h-[20rem] md:max-h-96 lg:max-h-[450px] h-auto w-auto max-w-[100%] mx-auto rounded-[24px] mb-5'
                />
            </Link>

            <PostStats post={post} userId={user.$id} />
        </li>
    );
};
