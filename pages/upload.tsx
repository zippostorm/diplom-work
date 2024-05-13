import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import axios from 'axios';
import { SanityAssetDocument } from '@sanity/client';
import { useToast } from "@/components/ui/use-toast";

import useAuthStore from '../store/authStore';
import { client } from '../utils/client';

import { topics } from '../utils/constants';
import { BASE_URL } from '../utils';

const Upload = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [videoAsset, setVideoAsset] = useState<SanityAssetDocument | undefined>();
  const [wrongFileType, setWrongFileType] = useState(false);
  const [caption, setCaption] = useState('');
  const [category, setCategory] = useState(topics[0].name);
  const [savingPost, setSavingPost] = useState(false);

  const { userProfile }: { userProfile: any } = useAuthStore();

  const imageTypes = ['image/jpeg', 'image/png', 'image/gif'];

  const router = useRouter();
  const { toast } = useToast();

  const uploadVideo = async (e: any) => {
    const selectedFile = e.target.files[0];
    const videoTypes = ['video/mp4', 'video/webm', 'video/ogg'];
    const imageTypes = ['image/jpeg', 'image/png', 'image/gif'];
  
    if (videoTypes.includes(selectedFile.type)) {
      setIsLoading(true);
      client.assets.upload('file', selectedFile, {
        contentType: selectedFile.type,
        filename: selectedFile.name
      })
      .then((data) => {
        setVideoAsset(data);
        setIsLoading(false);
      });
    } else if (imageTypes.includes(selectedFile.type)) {
      setIsLoading(true);
      client.assets.upload('file', selectedFile, {
        contentType: selectedFile.type,
        filename: selectedFile.name
      })
      .then((data) => {
        setVideoAsset(data);
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
      setWrongFileType(true);
      console.log("Wrong File Type");
    }
  }

  const handlePost = async () => {
    if(caption && videoAsset?._id && category) {
      setSavingPost(true);

      const document = {
        _type: 'post',
        caption,
        video: {
          _type: 'file',
          asset: {
            _type: 'reference',
            _ref: videoAsset?._id
          }
        },
        userId: userProfile?._id,
        postedBy: {
          _type: 'postedBy',
          _ref: userProfile?._id
        },
        topic: category,
        status: 'waiting'
      }

      await axios.post(`${BASE_URL}/api/post`, document);
      toast({
        title: "Ваш пост відправлений на перевірку. Очікуйте",
        duration: 8000,
      });
      setCaption('');
      setVideoAsset(undefined);
      setCategory(topics[0].name);
      setSavingPost(false);
      router.push("/");
    }
  }

  return (
    <div className='flex w-full h-full absolute left-0 top-[88px] mb-10 bg-[#F8F8F8] justify-center'>
      <div className='bg-white rounded-lg xl:h-[100%] w-[100%] flex gap-6 flex-wrap justify-center items-center p-14 pt-6'>
        <div>
          <div className='ml-6'>
            <p className='text-2xl font-bold'>Завантажити Відео або Фото</p>
            <p className='text-md text-gray-400 mt-1'>Опублікуйте відео або фото у своєму обліковому записі</p>
          </div>
          <div className='border-dashed rounded-xl border-4 border-gray-200 flex flex-col justify-center items-center outline-none mt-10 w-[400px] h-[500px] cursor-pointer hover:border-red-300 hover:bg-gray-100'>
            {isLoading ? (
              <p>Uploading...</p>
            ) : (
              <div>
                {videoAsset ? (
                  <div>
                    {imageTypes.includes(videoAsset.mimeType) ? (
                      <img
                        src={videoAsset.url}
                        alt="Uploaded Image"
                        className="rounded-xl p-2 w-[380px] h-[250px]"
                      />
                    ) : (
                      <video
                        src={videoAsset.url}
                        loop
                        controls
                        className='rounded-xl h-[400px] bg-black'
                      ></video>
                    )}
                  </div>
                ) : (
                  <label className='cursor-pointer'>
                    <div className='flex flex-col items-center justify-center h-full'>
                      <div className='flex flex-col items-center justify-center'>
                        <p className='font-bold text-xl'>
                          <FaCloudUploadAlt className='text-gray-300 text-6xl' />
                        </p>
                        <p className='text-xl font-semibold'>
                          Завантажити Відео або Фото
                        </p>
                      </div>
                      <p className='text-gray-400 text-center mt-10 text-sm leading-10'>
                        MP4 або WebM або ogg <br />
                        PNG або JPEG або GIF <br />
                        720x1280 або вище <br />
                        До 10 хвилин <br />
                        Менше 2 ГБ
                      </p>
                      <p className='bg-[#F51997] text-center mt-10 rounded text-white text-md font-medium p-2 w-52 outline-none'>
                        Обрати Файл
                      </p>
                    </div>
                    <input 
                      type="file" 
                      name="upload-video"
                      onChange={uploadVideo}
                      className='w-0 h-0'
                    />
                  </label>
                )}
              </div>
            )}
            {wrongFileType && (
              <p className='text-center text-xl text-red-400 font-semibold mt-4 w-[250px]'>
                Будь-ласка виберіть відео файл
              </p>
            )}
          </div>


        </div>
          <div className='flex flex-col gap-3 pb-10 w-[350px]'>
            <label className='text-md font-medium'>Заголовок</label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="rounded outline-none text-md border-2 border-gray-200 p-2"
            />
            <label className='text-md font-medium'>Виберіть тег</label>
            <select
              onChange={(e) => setCategory(e.target.value)}
              className="outline-none border-2 border-gray-200 text-md capitalize lg:p-4 p-2 rounded cursor-pointer"
            >
              {topics.map((topic) => (
                <option
                  key={topic.name}
                  className="outline-none capitalize bg-white text-gray-700 text-md p-2 hover:bg-slate-300"
                  value={topic.name}
                >
                  {topic.name}
                </option>
              ))}
            </select>
            <div className='flex gap-6 mt-10 justify-center'>
              <button
                onClick={handlePost}
                type="button"
                className='bg-[#F51997] text-white text-md font-medium p-2 rounded w-28 lg:w-44 outline-none'
              >
                Запостити
              </button>
            </div>
          </div>
      </div>
    </div>
  )
}

export default Upload;
