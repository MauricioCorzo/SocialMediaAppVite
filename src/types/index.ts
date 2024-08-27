import { Models } from 'appwrite';

export type IContextType = {
    user: INewUserCreated;
    isLoading: boolean;
    isAuthenticated: boolean;
    setUser: React.Dispatch<React.SetStateAction<INewUserCreated>>;
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
    checkAuthUser: () => Promise<boolean>;
    logOutUser: () => Promise<void>;
    checkNoUserInfoInLocalStorage: () => boolean;
};

export type INavLink = {
    imgURL: string;
    route: string;
    label: string;
};

export type IUpdateUser = {
    userId: string;
    name: string;
    bio: string;
    imageId: string;
    imageUrl: URL | string;
    file: File[];
};

export type INewPost = {
    userId: string;
    caption: string;
    file: File[];
    location?: string;
    tags?: string;
};

export type IUpdatePost = {
    postId: string;
    caption: string;
    imageId: string;
    imageUrl: string;
    file: File[];
    location?: string;
    tags?: string;
};

export type IUser = {
    id: string;
    name: string;
    username: string;
    email: string;
    imageUrl: URL | string;
    bio: string | null;
};

export interface INewUserCreated {
    $collectionId: string;
    $createdAt: string;
    $databaseId: string;
    $id: string;
    $permissions: string[];
    $updatedAt: string;
    accountId: string;
    bio: string | null;
    name: string;
    email: string;
    imageId: string;
    username: string;
    imageUrl: string;
    liked: (Models.Document & Post)[];
    posts: (Models.Document & Post)[];
    save: (Models.Document & { post: Models.Document & Omit<Post, 'likes' | 'creator'> })[];
}

export type INewUser = {
    name: string;
    email: string;
    username: string;
    password: string;
};

export type Post = {
    caption: string;
    imageId: string;
    imageUrl: string;
    location: string;
    tags: string[];
    likes: Models.Document[];
    creator: Omit<INewUserCreated, 'posts'>;
    save: (Models.Document & { user: Omit<INewUserCreated, 'liked' | 'posts' | 'save'> })[];
};
