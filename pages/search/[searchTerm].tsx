import { useState } from "react";
import Image from "next/image";
import { GoVerified } from "react-icons/go";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

import VideoCard from "../../components/VideoCard";
import NoResults from "../../components/NoResults";
import { IUser, Video } from "../../types";
import { BASE_URL } from "../../utils";
import useAuthStore from "../../store/authStore";
import { userAgent } from "next/server";

const Search = ({ videos }: { videos: Video[] }) => {

  const [isAccounts, setIsAccounts] = useState(false);
  const router = useRouter();
  const { searchTerm }: any = router.query;
  const { allUsers } = useAuthStore();

  const accounts = isAccounts ? 'border-b-2 border-black' : 'text-gray-400';
  const isVideos = !isAccounts ? 'border-b-2 border-black' : 'text-gray-400';

  const searchedAccounts = allUsers.filter((user: IUser) => user.userName.toLowerCase().includes(searchTerm.toLowerCase()));


  const allWaiting = videos.every(video => video.status === 'waiting');

  return (
    <div className="w-full">
      <div className="flex gap-10 mb-10 mt-10 border-b-2 border-gray-200 bg-white w-full">
        <p className={`text-xl font-semibold cursor-pointer mt-2 ${accounts}`} onClick={() => setIsAccounts(true)}>Акаунти</p>
        <p className={`text-xl font-semibold cursor-pointer mt-2 ${isVideos}`} onClick={() => setIsAccounts(false)}>Публікації</p>
      </div>
      {isAccounts ? (
        <div className="md:mt-16">
          {searchedAccounts.length > 0 ? (
            searchedAccounts.map((user: IUser, idx: number) => (
              <Link href={`/profile/${user._id}`} key={idx}>
                <div className='flex gap-3 p-2 cursor-pointer font-semibold rounded border-b-2 border-gray-200'>
                  <div>
                    <Image 
                      src={user.image}
                      width={50}
                      height={50}
                      className='rounded-full'
                      alt='user profile'
                    />
                  </div>
                  <div>
                    <p className='flex gap-1 items-center text-md font-bold text-primary lowercase'>
                      {user.userName.replaceAll(' ', '')}
                      <GoVerified className='text-blue-400' />
                    </p>
                    <p className='capitalize text-gray-400 text-xs'>
                      {user.userName}
                    </p>
                  </div>
                </div>
              </Link>
            ))
          ) : <NoResults text={`Немає акаунтів за запитом '${searchTerm}'`} />}
        </div>
      ) : (
        <div className="md:mt-16 flex flex-wrap gap-6 md:justify-start">
          {allWaiting ? (
            <NoResults text={`Немає публікацій за запитом '${searchTerm}'`} />
          ) : (
            videos.length ? (
              videos.map((video: Video, idx) => (
                video.status === 'accepted' ? (
                  <VideoCard post={video} key={idx} />
                ) : null
              ))
            ) : <NoResults text={`Немає публікацій за запитом '${searchTerm}'`} />
          )}
        </div>
      )}
    </div>
  )
}

export const getServerSideProps = async ({ 
  params: { searchTerm }
}: {
  params: { searchTerm: string }
}) => {
  const encodedSearchTerm = encodeURIComponent(searchTerm);
  const res = await axios.get(`${BASE_URL}/api/search/${encodedSearchTerm}`)

  return {
    props: { videos: res.data }
  }
}

export default Search
