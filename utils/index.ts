import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const getUserTypeFromSanity = async (userId: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/getUserTypeFromSanity/${userId}`);
    return response.data.userType;
  } catch (error) {
    console.error("Error fetching user type from Sanity:", error);
    return '';
  }
};

export const createOrGetUser = async (response: any, addUser: any) => {
  const decoded: { name: string, picture: string, sub: string } = jwtDecode(response.credential);

  const { name, picture, sub } = decoded;

  const userId = sub;

  const userType = await getUserTypeFromSanity(userId);

  const user = {
    _id: sub,
    _type: 'user',
    userName: name,
    image: picture,
    userType: userType
  }

  addUser(user);
  
  await axios.post(`${BASE_URL}/api/auth`, user);
};