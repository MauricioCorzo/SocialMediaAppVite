import { useToast } from '@/components/ui/use-toast';
import { getCurrentUser, signOutAccount } from '@/lib/appwrite/api';
import { type INewUserCreated, type IContextType } from '@/types';
import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const checkNoUserInfoInLocalStorage = () => localStorage.getItem('cookieFallback') === '[]' || localStorage.getItem('cookieFallback') === null;

const AuthContext = createContext<IContextType | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useUserAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuthContext muts be used inide a Provider');
    }

    return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<INewUserCreated>({} as INewUserCreated);
    const [isLoading, setIsLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const { toast } = useToast();

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.pathname === '/sign-up') return;
        if (checkNoUserInfoInLocalStorage()) {
            navigate('/sign-in');
            return;
        }

        checkAuthUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const checkAuthUser = async () => {
        setIsLoading(true);
        try {
            const currentAccount = await getCurrentUser();

            if (currentAccount) {
                setUser({
                    ...currentAccount,
                    // id: currentAccount.$id,
                    // name: currentAccount.name,
                    // username: currentAccount.username,
                    // email: currentAccount.email,
                    // imageUrl: currentAccount.imageUrl,
                    // bio: currentAccount.bio,
                });
                setIsAuthenticated(true);
                return true;
            }
            return false;
        } catch (error) {
            const err = error as Error;
            toast({ title: err.message, variant: 'destructive' });
            navigate('/sign-in');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const logOutUser = async () => {
        setIsLoading(true);
        try {
            await signOutAccount();
            setIsAuthenticated(false);
            navigate('/sign-in');
        } catch (error) {
            const err = error as Error;
            toast({ title: err.message, variant: 'destructive' });
            navigate('/sign-in', { replace: true });
        } finally {
            setIsLoading(false);
        }
    };

    const value = {
        user,
        setUser,
        isLoading,
        isAuthenticated,
        setIsAuthenticated,
        checkAuthUser,
        logOutUser,
        checkNoUserInfoInLocalStorage,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
