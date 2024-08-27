import { Input } from '@/components/ui/input';
import React from 'react';

export const Explore = () => {
    // const [searchValue, setSearchValue] = useState("")

    return (
        <div className='w-full py-10 px-5 md:p-14 custom-scrollbar'>
            <div className='max-w-5xl mx-auto space-y-6 md:space-y-9'>
                <h2 className='md:text-3xl text-2xl font-bold leading-[140%] tracking-tighte'>Search Posts</h2>
                <div className='flex gap-1 w-full rounded-lg bg-dark-4 px-2'>
                    <img src='/assets/icons/search.svg' alt='Serach Icon' className='w-6 aspect-square' />
                    <Input
                        type='text'
                        placeholder='Search'
                        className='h-12 bg-dark-4 border-none placeholder:text-light-4 focus-visible:ring-0 focus-visible:ring-offset-0 ring-offset-0'
                    />
                </div>
            </div>

            <div className='flex items-start justify-between max-w-5xl mx-auto mt-16 mb-7'>
                <h3 className='md:text-2xl text-lg font-bold leading-[140%] tracking-tighte'>Popular Today</h3>
                <div className='flex items-center justify-center gap-3 py-2 px-4 bg-dark-3 rounded-xl'>
                    <p className='text-light-2 md:text-base text-sm font-medium leading-[140%]'>All</p>
                    <img src='/assets/icons/filter.svg' alt='Filter Icon' className='w-5 aspect-square cursor-pointer' title='Filter' />
                </div>
            </div>

            <div className='flex flex-wrap gap-9 w-full max-w-5xl'></div>
        </div>
    );
};
