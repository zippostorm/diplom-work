import React, { useState, useEffect, useRef } from 'react';
import { Video } from '../types';
import { NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { HiVolumeUp, HiVolumeOff } from 'react-icons/hi';
import { BsPlay, BsFillPlayFill, BsFillPauseFill } from 'react-icons/bs';
import { GoVerified } from 'react-icons/go';

interface IProps {
  post: Video;
}

const VideoCard: NextPage<IProps> = ({ post }) => {
  // const [isHover, setIsHover] = useState(false);
  // const [playing, setPlaying] = useState(false);
  // const [isVideoMuted, setIsVideoMuted] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);

  // const onVideoPress = () => {
  //   if(playing) {
  //     videoRef?.current?.pause();
  //     setPlaying(false);
  //   } else {
  //     videoRef?.current?.play();
  //     setPlaying(true);
  //   }
  // }

  // useEffect (() => {
  //   if(videoRef?.current) {
  //     videoRef.current.muted = isVideoMuted;
  //   }
  // }, [isVideoMuted])

  const isImage = (url: string): boolean => {
    return url.includes('.jpg') || url.includes('.jpeg') || url.includes('.png') || url.includes('.gif');
  }

  const pluralize = (count: number, words: string[]): string => {
    const cases = [2, 0, 1, 1, 1, 2];
    return words[count % 100 > 4 && count % 100 < 20 ? 2 : cases[Math.min(count % 10, 5)]];
  };

  const formatDate = (createdAt: string): string => {
    const currentDate = new Date();
    const postDate = new Date(createdAt);
    const diff = Math.floor((currentDate.getTime() - postDate.getTime()) / 1000);
  
    if (diff < 60) {
      return `${diff} секунд назад`;
    } else if (diff < 3600) {
      const minutes = Math.floor(diff / 60);
      return `${minutes} ${pluralize(minutes, ['хвилину', 'хвилини', 'хвилин'])} назад`;
    } else if (diff < 86400) {
      const hours = Math.floor(diff / 3600);
      return `${hours} ${pluralize(hours, ['годину', 'години', 'годин'])} назад`;
    } else {
      const days = Math.floor(diff / 86400);
      return `${days} ${pluralize(days, ['день', 'дні', 'днів'])} назад`;
    }
  };

  if (post.status !== 'accepted') {
    return null;
  }

  return (
    <div className='flex flex-col border-b-2 border-gray-200 pb-6'>
      <div>
        <div className='flex gap-3 p-2 cursor-pointer font-semibold rounded'>
          <div className='md:w-16 md:h-16 w-10 h-10'>
            <Link href={`/profile/${post.postedBy._id}`}>
              <>
                <Image 
                  width={62}
                  height={62}
                  className="rounded-full"
                  src={post.postedBy.image}
                  alt="Profile Photo"
                  layout='responsive'
                />
              </>
            </Link>
          </div>
          <div>
            <Link href={`/profile/${post.postedBy._id}`}>
              <div className='flex items-center gap-2'>
                <p className='flex gap-2 items-center md:text-md font-bold text-primary'>
                  {post.postedBy.userName} {` `}
                  <GoVerified className='text-blue-400 text-md' />
                </p>
                <p className='capitalize font-medium text-xs text-gray-500 hidden md:block'>{post.postedBy.userName}</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
      <div className='lg:ml-20 flex gap-4 relative'>
        <div 
          // onMouseEnter={() => setIsHover(false)}
          // onMouseLeave={() => setIsHover(false)}
          className='rounded-3xl'>
          <Link href={`/detail/${post._id}`}>
            <p className='mb-5'>{post.caption}</p>
            <p className='text-sm text-gray-400'>{formatDate(post._updatedAt)}</p>
            <p className='mb-3 text-sm text-gray-400 '>Тег: #{post.topic}</p>
            {isImage(post.video.asset.url) ? (
              <img
                className='lg:w-[560px] lg:h-[360px] md:h-[320px] md:w-[500px] w-[250px] h-[200px] cursor-pointer bg-gray-200'
                src={post.video.asset.url}
                alt="Uploaded Image"
              />
            ) : (
              <video
                loop
                ref={videoRef}
                className='lg:w-[560px] lg:h-[360px] md:h-[320px] md:w-[500px] w-[250px] h-[200px] cursor-pointer bg-gray-200'
                src={post.video.asset.url}
                controls
              ></video>
            )}
          </Link>

          {/* {isHover || !isImage(post.video.asset.url) && (
            <div className='absolute bottom-6 cursor-pointer left-8 md:left-14 lg:left-0 flex gap-10 lg:justify-between w-[100px] md:w-[50px] p-3'>
              {playing ? (
                <button onClick={onVideoPress}>
                  <BsFillPauseFill className='text-black text-2xl lg:-text-4xl'/>
                </button>
              ) : (
                <button onClick={onVideoPress}>
                  <BsFillPlayFill className='text-black text-2xl lg:-text-4xl'/>
                </button>
              )}
              {isVideoMuted ? (
                <button onClick={() => setIsVideoMuted(false)}>
                  <HiVolumeOff className='text-black text-2xl lg:-text-4xl'/>
                </button>
              ) : (
                <button onClick={() => setIsVideoMuted(true)}>
                  <HiVolumeUp className='text-black text-2xl lg:-text-4xl'/>
                </button>
              )}
            </div>
          )} */}
        </div>
      </div>
    </div>
  )
}

export default VideoCard;
