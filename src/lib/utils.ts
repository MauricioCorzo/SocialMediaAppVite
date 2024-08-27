import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const formatDate = (postCreationDate: string = '') => {
    const today = new Date().getTime();
    const postCreation = new Date(postCreationDate).getTime();

    const seconds_passed = (today - postCreation) / 1000;

    if (seconds_passed < 3600) {
        const minutes = Math.floor(seconds_passed / 60);
        return new Intl.RelativeTimeFormat(undefined, { style: 'long' }).format(-minutes, 'minutes');
    } else if (seconds_passed < 86400) {
        const hours = Math.floor(seconds_passed / (60 * 60));
        return new Intl.RelativeTimeFormat(undefined, { style: 'long' }).format(-hours, 'hours');
    } else {
        const days = Math.floor(seconds_passed / (60 * 60 * 24));
        return new Intl.RelativeTimeFormat(undefined, { style: 'long' }).format(-days, 'days');
    }
};

// COUNT DOWN
// const formatDate = (date) => {
//     const today = new Date().getTime();
//     const postCreation = date;

//     const seconds_passed = (date - today) / 1000;
//     console.log({seconds_passed: Math.floor(seconds_passed)})
//         const seconds = Math.floor(seconds_passed) % 60;
//         const minutes = Math.floor(seconds_passed / 60);
//         console.log("minutes: ", new Intl.RelativeTimeFormat(undefined, { style: 'long' }).format(minutes, 'minutes'));
//         console.log("seconds: ", new Intl.RelativeTimeFormat(undefined, { style: 'long' }).format(seconds, 'minutes'));
// };
