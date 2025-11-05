import axios from 'axios'
import { transformResult } from '../helpers/helpers';
import toast from 'react-hot-toast';

export const fetchCurrentUser = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No token");
  }

  console.log('Token', token)

  // Simulate fetching user
  return {
    id: 1,
    name: "Francis Alex",
    role: "Admin",
    token,
  };
};


export const loginUser = async ( loginCredentials ) => {

    return {
        token: "thisissampletoken",
        id: 1,
        name: 'Francis alex',
        role: 'Admin',
        ...loginCredentials
    }
}

export const getAllResults = async() => {
      try {

        const res = await axios.get("http://localhost:3000/api/result/get");
        if(!res) {console.log('Error, API')}

        const formatted = res.data.data.map(transformResult);
        
        return formatted

      } catch (error) {
        console.error(error)
        toast.error(error)
      }
}
