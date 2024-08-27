import { INewPost, Post, type INewUser, type INewUserCreated, IUpdatePost } from '@/types';
import { account, appwriteConfig, avatars, databases, storage } from './config';
import { AppwriteException, ID, Models, Query } from 'appwrite';

export async function createUserAccount(user: INewUser) {
    try {
        const newAccount = await account.create(ID.unique(), user.email, user.password, user.name);

        const avatarUrl = avatars.getInitials(user.name);

        const newUser = await saveUserToDB({
            accountId: newAccount.$id,
            name: newAccount.name,
            email: newAccount.email,
            username: user.username,
            imageUrl: avatarUrl,
        });

        return newUser;
    } catch (error) {
        console.log(error);
        if (error instanceof AppwriteException) assertErrorTest(error);
        throw new Error('Ups! Algo salió mal.');
    }
}

export async function saveUserToDB(user: { accountId: string; email: string; name: string; imageUrl: URL; username?: string }) {
    const newUser: Models.Document & INewUserCreated = await databases.createDocument(
        appwriteConfig.databaesId,
        appwriteConfig.userCollectionId,
        ID.unique(),
        user
    );

    return newUser;
}

export async function signInAccount(user: { email: string; password: string }) {
    try {
        const session = await account.createEmailSession(user.email, user.password);
        return session;
    } catch (error) {
        console.log(error);
        if (error instanceof AppwriteException) assertErrorTest(error);
        throw new Error('Ups! Algo salió mal.');
    }
}

export async function signOutAccount() {
    try {
        const session = await account.deleteSession('current');
        return session;
    } catch (error) {
        console.log(error);
        if (error instanceof AppwriteException) assertErrorTest(error);
        throw new Error('Ups! Algo salió mal.');
    }
}

export async function getCurrentUser() {
    try {
        const currenAccount = await account.get();

        const currenUserArray = await databases.listDocuments(appwriteConfig.databaesId, appwriteConfig.userCollectionId, [
            Query.equal('accountId', currenAccount.$id),
        ]);

        const currentUser = currenUserArray.documents[0] as Models.Document & INewUserCreated;
        return currentUser;
    } catch (error) {
        console.log(error);
        if (error instanceof AppwriteException) assertErrorTest(error);
        throw new Error('Ups! Algo salió mal.');
    }
}

// ============================== CREATE POST
export async function createPost(post: INewPost) {
    try {
        // Upload file to appwrite storage
        const uploadedFile = await uploadFile(post.file[0]);

        // Get file url
        const fileUrl = getFilePreview(uploadedFile.$id);

        if (!fileUrl) {
            // Si algo salio mal
            await deleteFile(uploadedFile.$id);
            throw Error;
        }

        // Convert tags into array
        // ?.replace(/ /g, '')
        const tags = post.tags?.split(/[ ,\-_]/g).filter((tag) => tag !== '') || [];

        // Create post
        const newPost = await databases.createDocument(appwriteConfig.databaesId, appwriteConfig.postsCollectionId, ID.unique(), {
            creator: post.userId,
            caption: post.caption,
            imageUrl: fileUrl,
            imageId: uploadedFile.$id,
            location: post.location,
            tags: tags,
        });

        if (!newPost) {
            await deleteFile(uploadedFile.$id);
            throw Error;
        }

        return newPost;
    } catch (error) {
        console.log(error);
        if (error instanceof AppwriteException) assertErrorTest(error);
        throw new Error('Ups! Algo salió mal.');
    }
}

// ============================== UPLOAD FILE
export async function uploadFile(file: File) {
    try {
        const uploadedFile = await storage.createFile(appwriteConfig.storageId, ID.unique(), file);

        return uploadedFile;
    } catch (error) {
        console.log(error);
        if (error instanceof AppwriteException) assertErrorTest(error);
        throw new Error('Ups! Algo salió mal.');
    }
}

// ============================== GET FILE URL
export function getFilePreview(fileId: string) {
    try {
        const fileUrl = storage.getFilePreview(appwriteConfig.storageId, fileId, 1400, undefined, undefined, 100);
        return fileUrl;
    } catch (error) {
        console.log(error);
        if (error instanceof AppwriteException) assertErrorTest(error);
        throw new Error('Ups! Algo salió mal.');
    }
}

// ============================== DELETE FILE
export async function deleteFile(fileId: string) {
    try {
        await storage.deleteFile(appwriteConfig.storageId, fileId);

        return { status: 'ok' };
    } catch (error) {
        console.log(error);
        if (error instanceof AppwriteException) assertErrorTest(error);
        throw new Error('Ups! Algo salió mal.');
    }
}

// ============================== GET LAST 20 POSTS
export async function getRecentPosts() {
    try {
        const posts: Models.DocumentList<Models.Document & Post> = await databases.listDocuments(
            appwriteConfig.databaesId,
            appwriteConfig.postsCollectionId,
            [Query.orderDesc('$createdAt'), Query.limit(20)]
        );

        if (!posts) throw Error;

        return posts;
    } catch (error) {
        console.log(error);
        if (error instanceof AppwriteException) assertErrorTest(error);
        throw new Error('Ups! Algo salió mal.');
    }
}

// ============================== LIKE POST
export async function likePost(postId: string, likesArray: string[]) {
    try {
        const updatePostLikes = await databases.updateDocument(appwriteConfig.databaesId, appwriteConfig.postsCollectionId, postId, {
            likes: likesArray,
        });
        return updatePostLikes;
    } catch (error) {
        console.log(error);
        if (error instanceof AppwriteException) assertErrorTest(error);
        throw new Error('Ups! Algo salió mal.');
    }
}

// ============================== SAVE POST
export async function savePost(postId: string, userId: string) {
    try {
        const savePost = await databases.createDocument(appwriteConfig.databaesId, appwriteConfig.savesCollectionId, ID.unique(), {
            user: userId,
            post: postId,
        });
        return savePost;
    } catch (error) {
        console.log(error);
        if (error instanceof AppwriteException) assertErrorTest(error);
        throw new Error('Ups! Algo salió mal.');
    }
}

// ============================== UNSAVE POST
export async function deleteSavePost(savedRecordId: string) {
    try {
        await databases.deleteDocument(appwriteConfig.databaesId, appwriteConfig.savesCollectionId, savedRecordId);
        return { status: 'ok' };
    } catch (error) {
        console.log(error);
        if (error instanceof AppwriteException) assertErrorTest(error);
        throw new Error('Ups! Algo salió mal.');
    }
}

// ============================== GET ONE POST
export async function getPostById(postId: string) {
    try {
        const post: Models.Document & Post = await databases.getDocument(appwriteConfig.databaesId, appwriteConfig.postsCollectionId, postId);
        return post;
    } catch (error) {
        console.log(error);
        if (error instanceof AppwriteException) assertErrorTest(error);
        throw new Error('Ups! Algo salió mal.');
    }
}

// ============================== UPDATE POST
export async function updatePost(postToUpdate: IUpdatePost) {
    const hasFileToUpdate = postToUpdate.file.length > 0;
    // Grab the already stored image
    let image = {
        imageUrl: postToUpdate.imageUrl,
        imageId: postToUpdate.imageId,
    };

    try {
        if (hasFileToUpdate) {
            // Upload file to appwrite storage
            const uploadedFile = await uploadFile(postToUpdate.file[0]);

            // Get file url
            const fileUrl = getFilePreview(uploadedFile.$id);

            if (!fileUrl) {
                // Si algo salio mal
                await deleteFile(uploadedFile.$id);
                throw Error;
            }

            image = { ...image, imageUrl: fileUrl.href, imageId: uploadedFile.$id };
        }
        // Convert tags into array
        // ?.replace(/ /g, '')
        const tags = postToUpdate.tags?.split(/[ ,\-_]/g).filter((tag) => tag !== '') || [];

        // Update post
        const updatedPost = await databases.updateDocument(appwriteConfig.databaesId, appwriteConfig.postsCollectionId, postToUpdate.postId, {
            caption: postToUpdate.caption,
            location: postToUpdate.location,
            tags: tags,
            ...(hasFileToUpdate && { imageUrl: image.imageUrl, imageId: image.imageId }),
        });

        if (!updatedPost) {
            await deleteFile(image.imageId);
            throw Error;
        }

        return updatedPost;
    } catch (error) {
        console.log(error);
        if (error instanceof AppwriteException) assertErrorTest(error);
        throw new Error('Ups! Algo salió mal.');
    }
}

// ============================== DELETE POST AND FILE

export async function deletePost(postId: string, imageId: string) {
    try {
        await databases.deleteDocument(appwriteConfig.databaesId, appwriteConfig.postsCollectionId, postId);
        await databases.deleteDocument(appwriteConfig.databaesId, appwriteConfig.storageId, imageId);
    } catch (error) {
        console.log(error);
        if (error instanceof AppwriteException) assertErrorTest(error);
        throw new Error('Ups! Algo salió mal.');
    }
}

const assertErrorTest = (error: AppwriteException) => {
    if (error.code === 409) throw new Error('Este usuario ya existe, por favor prueba con datos diferentes.');
    if (error.code === 401) throw new Error('Las credenciales del usuario no son correctas. Por favor logueate nuevamente.');
};
