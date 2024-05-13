import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Video } from '../types';
import { BASE_URL } from '../utils';
import Image from 'next/image';
import useAuthStore from '../store/authStore';
import Link from 'next/link';
import NoResults from '../components/NoResults';

const Admin = () => {
  const [waitingPosts, setWaitingPosts] = useState<Video[]>([]);

  const videoRef = useRef<HTMLVideoElement>(null);

  const { userProfile }: any = useAuthStore();

  useEffect(() => {
    const fetchWaitingPosts = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/post`);
        const filteredPosts = response.data.filter((post : Video) => post.status === 'waiting');
        setWaitingPosts(filteredPosts);
      } catch (error) {
        console.error('Error fetching waiting posts:', error);
      }
    };

    fetchWaitingPosts();
  }, []);

  const isImage = (url: string): boolean => {
    return url.includes('.jpg') || url.includes('.jpeg') || url.includes('.png') || url.includes('.gif');
  }

  const handleAccept = async (postId: string) => {
    try {
      await axios.put(`${BASE_URL}/api/accept/${postId}`);
      const updatedPosts = waitingPosts.filter(post => post._id !== postId);
      setWaitingPosts(updatedPosts);
    } catch (error) {
      console.error('Error accepting post:', error);
    }
  };

  const handleDelete = async (postId: string) => {
    try {
      await axios.delete(`${BASE_URL}/api/accept/${postId}`);
      const updatedPosts = waitingPosts.filter(post => post._id !== postId);
      setWaitingPosts(updatedPosts);
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  if (!userProfile || (userProfile.userType !== 'admin' && userProfile.userType !== 'moderator')) {
    return <h1>Error page</h1>;
  }

  return (
    <div className='flex w-full h-full absolute left-0 top-[88px] mb-10 bg-[#F8F8F8]'>
      <div className='bg-white rounded-lg h-[100%] w-[100%] flex flex-wrap gap-4 justify-start items-start'>

        {waitingPosts.length === 0 ? (
          <NoResults text='Немає постів які треба підтверджувати' />
        ) : (
          waitingPosts.map(post => (
            <div key={post._id} className="mt-[50px] ml-4 mr-4 border border-gray-200 p-4 rounded-lg shadow-md flex flex-col mb-4">
              <div className="mb-4">
                  <Link href={`/profile/${post.postedBy._id}`}>
                    <div className='flex flex-wrap gap-3 items-center mb-3'>
                      <Image 
                        width={40}
                        height={40}
                        className="rounded-full cursor-pointer"
                        src={post.postedBy.image}
                        alt="Profile Photo"
                      />
                      <p className='font-bold'>{post.postedBy.userName}</p>
                    </div>
                  </Link>
                {post.caption && <p className="text-lg font-semibold">{post.caption}</p>}
                {post._createdAt && <p className="text-sm text-gray-500">#{post._createdAt}</p>}
                {post.topic && <p className="text-sm text-gray-500">#{post.topic}</p>}
              </div>
              <div className="flex gap-4">
                {isImage(post.video.asset.url) ? (
                  <img
                    className='lg:w-[300px] lg:h-[200px] cursor-pointer bg-gray-200'
                    src={post.video.asset.url}
                    alt="Uploaded Image"
                  />
                ) : (
                  <video
                    className='lg:w-[300px] lg:h-[200px] cursor-pointer bg-gray-200'
                    loop
                    ref={videoRef}
                    src={post.video.asset.url}
                    controls
                  />
                )}
              </div>
              <div className="flex justify-between mt-4">
                <button className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600" onClick={() => handleAccept(post._id)}>Пост</button>
                <button className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600" onClick={() => handleDelete(post._id)}>Удалити</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Admin;