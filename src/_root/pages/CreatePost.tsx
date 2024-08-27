import { PostForm } from '@/components/Forms/PostForm';

export const CreatePost = () => {
    return (
        <div className='w-full'>
            <div className='grid gap-10 py-10 px-5 md:px-8 lg:p-14 custom-scrollbar'>
                <div className='max-w-5xl mx-auto flex justify-start items-center gap-3 w-full'>
                    <img src='/assets/icons/add-post.svg' alt='Add Post' className='w-9 aspect-square' />
                    <h2 className='text-2xl md:text-3xl font-bold leading-[140%] tracking-tighter text-left w-full'>Create Post</h2>
                </div>

                <PostForm action='Create' post={undefined} />
            </div>
        </div>
    );
};
