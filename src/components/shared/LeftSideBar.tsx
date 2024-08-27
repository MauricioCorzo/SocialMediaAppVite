import { sidebarLinks } from '@/constants';
import { useUserAuthContext } from '@/context/AuthContext';
import { INavLink } from '@/types';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Button } from '../ui/button';
import { Loader } from './Loader';

export const LeftSideBar = () => {
    const location = useLocation();
    const { user, isLoading: isLoginOut, logOutUser } = useUserAuthContext();

    return (
        <nav className='hidden md:grid px-6 py-10 items-start content-between min-w-[270px] max-h-[100svh] sticky top-0 bg-dark-2'>
            <div className='grid gap-11'>
                <Link to='/' className='flex gap-3 items-center'>
                    <img src='/assets/images/logo.svg' alt='Snapgram Logo' width={170} />
                </Link>
                <Link to={`/profile/${user.$id}`} className='flex items-center gap-3'>
                    <img
                        src={(user.imageUrl as string) || '/assets/icons/profile-placeholder.svg'}
                        alt='User Profile Logo'
                        className='w-14 aspect-square rounded-full align-middle'
                    />
                    <div className='space-y-0.5'>
                        <p className='text-lg font-bold leading-[140%]'>{user.name}</p>
                        <p className='text-light-3'>@{user.username}</p>
                    </div>
                </Link>
                <ul className='grid gap-6'>
                    {sidebarLinks.map((link: INavLink) => {
                        const isActive = location.pathname === link.route;
                        return (
                            <li
                                key={link.route}
                                className={`group rounded-lg text-base font-medium ${isActive && 'bg-primary-500'} hover:bg-primary-500 transition`}
                            >
                                <NavLink to={link.route} className={'p-4 flex items-center gap-3'}>
                                    <img
                                        src={link.imgURL}
                                        alt={link.label}
                                        className={`${isActive && 'invert brightness-0'} group-hover:invert group-hover:brightness-0 transition`}
                                    />
                                    {link.label}
                                </NavLink>
                            </li>
                        );
                    })}
                </ul>
            </div>

            <Button
                title='Log out'
                onClick={() => logOutUser()}
                className='flex gap-3 item-center justify-start p-4 h-auto bg-transparent hover:bg-primary-500 focus:bg-primary-500 group'
            >
                {isLoginOut ? (
                    <Loader />
                ) : (
                    <img
                        src='/assets/icons/logout.svg'
                        alt='Log out Logo'
                        className='w-6 h-6  group-hover:invert group-hover:brightness-0 transition'
                    />
                )}
                <p>Logout</p>
            </Button>
        </nav>
    );
};
