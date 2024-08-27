import { bottombarLinks } from '@/constants';
import { Link, useLocation } from 'react-router-dom';

export const BottomBar = () => {
    const { pathname } = useLocation();
    return (
        <section className='z-50 flex justify-between items-center w-full sticky bottom-0 rounded-t-[20px] bg-dark-2 px-5 py-4 md:hidden'>
            {bottombarLinks.map((link) => {
                const isActive = pathname === link.route;
                // className={`group rounded-lg text-base font-medium ${isActive && 'bg-primary-500'} hover:bg-primary-500 transition`}
                return (
                    <Link
                        key={link.route}
                        to={link.route}
                        className={`${isActive && 'bg-primary-500'} w-[70px] group grid justify-items-center gap-1 rounded-xl p-2 transition`}
                    >
                        <img
                            src={link.imgURL}
                            alt={link.label}
                            className={`${
                                isActive && 'invert brightness-0'
                            } w-[clamp(16px,3vw,24px)] aspect-square group-hover:invert group-hover:brightness-0 transition`}
                        />
                        <p className='text-[clamp(10px,2vw,14px)] text-light-2'>{link.label}</p>
                    </Link>
                );
            })}
        </section>
    );
};
