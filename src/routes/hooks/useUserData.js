import { useMemo } from 'react';
import { decrypt, decryptObjectKeys } from 'src/api/encryption';

const useUserData = () => {
 const userData = useMemo(() => {
    const parsedData = JSON.parse(localStorage.getItem('UserData'));
    return decryptObjectKeys(
      Array.isArray(parsedData) ? parsedData : [parsedData]  // Ensure it's wrapped in an array if it's not already
    );
  }, []);
  
  return userData ? userData.map(user => ({
    ...user,
    roleID: decrypt(user.roleID),
  })) : null;
};

export default useUserData;
