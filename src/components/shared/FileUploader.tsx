import React, { useCallback, useState } from 'react';
import { FileWithPath, useDropzone } from 'react-dropzone';
import { Button } from '../ui/button';

type FileUploaderProps = {
    fieldChange: (files: File[]) => void;
    mediaUrl: string | undefined;
};

export const FileUploader = ({ fieldChange, mediaUrl }: FileUploaderProps) => {
    const [files, setFiles] = useState<File[]>([]);
    const [fileUrl, setFileUrl] = useState(mediaUrl || '');

    const onDrop = useCallback(
        (acceptedFiles: FileWithPath[]) => {
            setFiles(acceptedFiles);
            fieldChange(acceptedFiles);
            setFileUrl(URL.createObjectURL(acceptedFiles[0]));
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [files]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'image/*': ['.png', '.jpeg', '.jpg', '.svg'] } });

    console.log(isDragActive);

    return (
        <div {...getRootProps()} className='grid justify-items-center bg-dark-3 rounded-xl cursor-pointer'>
            <input {...getInputProps()} className='cursor-pointer' onClick={() => URL.revokeObjectURL(fileUrl)} />
            {fileUrl ? (
                <div className='grid gap-5 p-5 lg-p-10'>
                    <img src={fileUrl} alt='Image' className='max-h-80 lg:max-h-[480px] aspect-auto rounded-[24px]' />
                    <p className='text-center text-light-3 font-medium pt-2 border-t border-t-dark-4'>Click or drag photo to replace</p>
                </div>
            ) : (
                <div className='grid content-center justify-items-center gap-5 p-7 h-80 lg:h-[600px]'>
                    <img src='/assets/icons/file-upload.svg' alt='File Upload' className='w-24' />
                    <h3 className='text-lg text-light-2 font-medium'>Drag photo here</h3>
                    <p className='text-light-3 text-sm leading-[140%] mb-6'>SVG, PNG, JPG</p>
                    <Button className='h-10 bg-dark-4 px-5 text-light-1 flex gap-2'>Select from computer</Button>
                </div>
            )}
        </div>
    );
};
