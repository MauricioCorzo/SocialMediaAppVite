import { PostForm } from '@/components/Forms/PostForm';
import { Loader } from '@/components/shared/Loader';
import { useGetPostById } from '@/lib/react-query/queriesAndMutations';
import { useParams } from 'react-router-dom';

export const EditPost = () => {
    const { id } = useParams();
    const { data: postData, isPending: isPostLoading } = useGetPostById(id || '');

    return (
        <div className='w-full'>
            <div className='grid gap-10 py-10 px-5 md:px-8 lg:p-14 custom-scrollbar'>
                <div className='max-w-5xl mx-auto flex justify-start items-center gap-3 w-full'>
                    <img src='/assets/icons/add-post.svg' alt='Add Post' className='w-9 aspect-square' />
                    <h2 className='text-2xl md:text-3xl font-bold leading-[140%] tracking-tighter text-left w-full'>Edit Post</h2>
                </div>

                {isPostLoading ? (
                    <div className='mx-auto'>
                        <Loader />
                    </div>
                ) : (
                    <PostForm action='Update' post={postData} />
                )}
            </div>
        </div>
    );
};
