import { useUser } from './context'


export const useApi = () => {
  const { user, setUser } = useUser();

  const apiRequest = async (url, options) => {
    options = {
      ...options,
      credentials: 'include'
    };
    
    const res = await fetch(url, options);
    if (res.status === 401) {
      setUser(null);
    }

    return res;
  };

  return apiRequest;
};
