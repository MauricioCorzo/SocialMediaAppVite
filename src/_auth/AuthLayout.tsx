import { useUserAuthContext } from '@/context/AuthContext';
import { Outlet, Navigate } from 'react-router-dom';

export const AuthLayout = () => {
    const { isAuthenticated } = useUserAuthContext();
    return (
        <>
            {isAuthenticated ? (
                <Navigate to={'/'} />
            ) : (
                <>
                    <section className='grid place-content-center py-10 w-1/2'>
                        <Outlet />
                    </section>
                    <img src='/assets/images/side-img.svg' alt='logo' className='hidden lg:block h-screen object-cover w-1/2' />
                </>
            )}
        </>
    );
};
