// plugins/userDetails.ts

interface User {
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  sessionId: string;
  credit: number;
  maxCredit: number;
}

export type UserDetails = User | null;

export default defineNuxtPlugin((nuxtApp) => {
  const userDetails = useState<UserDetails>('userDetails', () => {
    if (import.meta.client) {
      const storedDetails = localStorage.getItem('userDetails');
      return storedDetails ? JSON.parse(storedDetails) : null;
    }
    return null;
  });

  const setUserDetails = (details: UserDetails | Partial<User>) => {
    if (details === null) {
      userDetails.value = null;
    } else if (userDetails.value) {
      userDetails.value = { ...userDetails.value, ...details };
    } else if ('name' in details && 'email' in details) {
      userDetails.value = details as User;
    }

    if (import.meta.client && userDetails.value) {
      localStorage.setItem('userDetails', JSON.stringify(userDetails.value));
    }
  };

  const updateUserCredit = (credit: number) => {
    if (userDetails.value) {
      userDetails.value.credit = credit;
      if (import.meta.client) {
        localStorage.setItem('userDetails', JSON.stringify(userDetails.value));
      }
    }
  };

  const clearUserDetails = () => {
    userDetails.value = null;
    if (import.meta.client) {
      localStorage.removeItem('userDetails');
    }
  };

  return {
    provide: {
      userDetails,
      setUserDetails,
      updateUserCredit,
      clearUserDetails,
    },
  };
});