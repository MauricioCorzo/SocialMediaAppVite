import { BottomBar } from '@/components/shared/BottomBar';
import { LeftSideBar } from '@/components/shared/LeftSideBar';
import { Loader } from '@/components/shared/Loader';
import { TopBar } from '@/components/shared/TopBar';
import { useUserAuthContext } from '@/context/AuthContext';
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

export const RootLayout = () => {
    const { isAuthenticated, checkNoUserInfoInLocalStorage } = useUserAuthContext();
    const navigate = useNavigate();

    //FUNCION PARA CUANDO APRETO LOGOUT,ME REDIRECCIONA A LOG-IN Y EL USAURIO APRETA EL BACK BUTTON
    //DEL BROWSER LE MUESTRA EL LOADER INFINITAMENTE
    useEffect(() => {
        if (checkNoUserInfoInLocalStorage()) navigate('/sign-in');
    }, [navigate, checkNoUserInfoInLocalStorage]);

    return (
        <>
            {isAuthenticated ? (
                <div className='w-full md:flex'>
                    <TopBar />
                    <LeftSideBar />
                    <section className='flex flex-1 h-full'>
                        <Outlet />
                    </section>
                    <BottomBar />
                </div>
            ) : (
                <div className='fixed inset-0 m-auto w-6 aspect-square'>
                    <Loader />
                </div>
            )}
        </>
    );
};
