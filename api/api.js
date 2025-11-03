import axios from 'axios'

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
    // Query here the accont from the HRIS
    // Or call the backend service that can fetch the hris

    // const data = await axios.get('route for validating the account', loginCredentials);

    return {
        token: "thisissampletoken",
        id: 1,
        name: 'Francis alex',
        role: 'Admin',
        ...loginCredentials
    }
}