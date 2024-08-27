import { useUserAuthContext } from '@/context/AuthContext';
import { useDeleteSavedPost, useLikePost, useSavePost } from '@/lib/react-query/queriesAndMutations';
import { Post } from '@/types';
import { Models } from 'appwrite';
import { useState, MouseEvent } from 'react';

// eslint-disable-next-line react-refresh/only-export-components
export const checkIsLiked = (likeList: string[], userId: string) => {
    return likeList.includes(userId);
};
type PostStatsProps = {
    post: Models.Document & Post;
    userId: string;
};

export const PostStats = ({ post, userId }: PostStatsProps) => {
    const { user } = useUserAuthContext();

    const likesList = post.likes.map((user) => user.$id);
    const savedPostRecord = user?.save.find((record) => record.post.$id === post.$id);

    const [likes, setLikes] = useState(likesList);
    const [isSaved, setIsSaved] = useState(!!savedPostRecord);

    const { mutateAsync: likePost } = useLikePost();
    const { mutateAsync: savePost } = useSavePost();
    const { mutateAsync: deleteSavedPost } = useDeleteSavedPost();

    const likedIconUrl = checkIsLiked(likes, userId) ? '/assets/icons/liked.svg' : '/assets/icons/like.svg';
    const savedIconUrl = isSaved ? '/assets/icons/saved.svg' : '/assets/icons/save.svg';

    const handleLikePost = async (event: MouseEvent) => {
        try {
            event.stopPropagation();

            const newLikes = [...likes];
            const hasLiked = newLikes.includes(userId);
            if (hasLiked) {
                newLikes.filter((id) => id !== userId);
            } else {
                newLikes.push(userId);
            }
            setLikes(newLikes);
            await likePost({ postId: post.$id, likesArray: newLikes });
        } catch (error) {
            console.log(error);
        }
    };

    const handleSavePost = async (event: MouseEvent) => {
        try {
            event.stopPropagation();

            if (savedPostRecord) {
                setIsSaved(false);
                await deleteSavedPost({ savedRecorId: savedPostRecord.$id });
            } else {
                setIsSaved(true);
                await savePost({ postId: post.$id, userId: userId });
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className='flex justify-between items-center z-20'>
            <div className='flex gap-2 '>
                <img src={likedIconUrl} alt='Likes Icon' className='w-5 aspect-square cursor-pointer' onClick={(e) => handleLikePost(e)} />
                <p className='font-medium text-sm lg:text-base'>{likes.length}</p>
            </div>
            <div className=''>
                <img src={savedIconUrl} alt='Likes Icon' className='w-5 aspect-square cursor-pointer' onClick={(e) => handleSavePost(e)} />
            </div>
        </div>
    );
};
