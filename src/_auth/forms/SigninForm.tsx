import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { SigninValidationSchema, type SigninValidationSchemaType } from '@/lib/validation';

import { Input } from '@/components/ui/input';

import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { Loader } from '@/components/shared/Loader';
import { Link, useNavigate } from 'react-router-dom';

import { useToast } from '@/components/ui/use-toast';
import { useSignInAccount } from '@/lib/react-query/queriesAndMutations';
import { useUserAuthContext } from '@/context/AuthContext';
import { useState } from 'react';

export const SigninForm = () => {
    const { toast } = useToast();
    const { checkAuthUser } = useUserAuthContext();
    const [isUserLoginIn, setUserLoginIn] = useState(false);

    const navigate = useNavigate();

    const { mutateAsync: signInAccount } = useSignInAccount();

    // Define your form
    const form = useForm<SigninValidationSchemaType>({
        resolver: zodResolver(SigninValidationSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    async function onSubmit(values: SigninValidationSchemaType) {
        setUserLoginIn(true);
        try {
            await signInAccount({ email: values.email, password: values.password });
            const isLoggedIn = await checkAuthUser();

            if (isLoggedIn) {
                form.reset();
                navigate('/');
                toast({ title: 'Welcome back again!' });
            } else {
                return toast({ title: 'Sign up fail. Please try again.', variant: 'destructive' });
            }
        } catch (error) {
            const err = error as Error;
            toast({ title: err.message, variant: 'destructive' });
        } finally {
            setUserLoginIn(false);
        }
    }
    return (
        <>
            <Form {...form}>
                <div className='sm:w-[420px] text-center'>
                    <img src='/assets/images/logo.svg' alt='logo' className='mx-auto' />
                    <h2 className='text-2xl md:text-3xl font-bold leading-[140%] tracking-tighte pt-5 sm:pt-10'>Log in to your account</h2>

                    <p className='text-light-3 text-base font-medium leading-[20px] md:font-normal mt-2'>
                        Welcome back! Please enter your details details
                    </p>

                    <form onSubmit={form.handleSubmit(onSubmit)} className='mt-4 grid gap-5 text-start'>
                        <FormField
                            control={form.control}
                            name='email'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            type='email'
                                            placeholder='mauricio.corzo@example.com'
                                            className='h-12 bg-dark-4 border-none placeholder:text-light-4 focus-visible:ring-offset-[2px] ring-offset-light-3'
                                            {...field}
                                        />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='password'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type='password'
                                            inputMode='numeric'
                                            className='h-12 bg-dark-4 border-none placeholder:text-light-4 focus-visible:ring-offset-[2px] ring-offset-light-3'
                                            {...field}
                                        />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type='submit' className='bg-primary-500 hover:bg-primary-600 text-light-1'>
                            {isUserLoginIn ? (
                                <div className='flex items-center justify-center gap-2'>
                                    <Loader /> <span>Loading...</span>
                                </div>
                            ) : (
                                'Sign in'
                            )}
                        </Button>
                        <p className='text-light-2 text-center mt-2'>
                            Don´t have an account?{' '}
                            <Link
                                to={'/sign-up'}
                                className='text-primary-500 text-small font-semibold ml-1 decoration-white decoration-2 underline-offset-[3px] hover:underline focus-visible:underline focus-visible:outline-0'
                            >
                                Sign up
                            </Link>
                        </p>
                    </form>
                </div>
            </Form>
        </>
    );
};
