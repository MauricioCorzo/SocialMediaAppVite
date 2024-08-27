import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { Loader } from './Loader';
import { useUserAuthContext } from '@/context/AuthContext';

export const TopBar = () => {
    const { user, isLoading: isLoginOut, logOutUser } = useUserAuthContext();

    return (
        <nav className='sticky top-0 z-50 md:hidden bg-dark-2 w-full'>
            <div className='flex justify-between items-center py-4 px-5'>
                <Link to='/' className='flex gap-3 items-center'>
                    <img src='/assets/images/logo.svg' alt='Snapgram Logo' width={130} />
                </Link>

                <div className='flex items-center gap-4'>
                    <Button variant={'ghost'} title='Log out' onClick={() => logOutUser()}>
                        {isLoginOut ? <Loader /> : <img src='/assets/icons/logout.svg' alt='Log out Logo' className='w-6 h-6' />}
                    </Button>
                    <Link to={`/profile/${user.$id}`}>
                        <img
                            src={(user.imageUrl as string) || '/assets/icons/profile-placeholder.svg'}
                            alt='User Profile Logo'
                            className='w-8 aspect-square rounded-full align-middle'
                        />
                    </Link>
                </div>
            </div>
        </nav>
    );
};
