import { Loader } from '@/components/shared/Loader';
import { PostCard } from '@/components/shared/PostCard';
import { useGetRecentPosts } from '@/lib/react-query/queriesAndMutations';
import React from 'react';

export const Home = () => {
    const { data: posts, isPending: isPostLoading } = useGetRecentPosts();

    return (
        <div className='w-full'>
            <div className='grid justify-items-center gap-10 py-10 px-5 md:px-8 lg:p-14 custom-scrollbar'>
                <div className='max-w-screen-sm grid w-full gap-6 md:gap-9'>
                    <h2 className='text-left text-2xl md:text-3xl font-bold leading-[140%] tracking-tighter'>Home Feed</h2>
                    {isPostLoading && !posts ? (
                        <div className='place-self-center'>
                            <Loader />
                        </div>
                    ) : (
                        <ul className='grid gap-9 w-full'>
                            {posts?.documents.map((post) => (
                                <PostCard key={post.$id} post={post} />
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};
