import { useMemo } from 'react';
import { decrypt } from 'src/api/encryption';

const useUserData = () => {
  const userData = useMemo(() => {
    const data = localStorage.getItem('UserData');
    return data ? JSON.parse(data) : null;
  }, []);
  
  return userData ? userData.map(user => ({
    ...user,
    roleID: decrypt(user.roleID),
  })) : null;
};

export default useUserData;
