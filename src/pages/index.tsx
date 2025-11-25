// src/pages/index.tsx
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Center, LoadingOverlay } from '@mantine/core'; // Mantine Center component-ийг нэмж ашиглав
import { useAuth } from '../context/AuthContext'; // 💡 Auth Context-ийг ашиглана

const HomePageRedirect = () => {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth(); // Нэвтрэлтийн төлөв, ачааллыг татаж авна

  useEffect(() => {
    // Хэрэв AuthContext ачаалж дууссан бол
    if (!isLoading) {
      if (isAuthenticated) {
        router.replace('/dashboard');
      } else {
        router.replace('/home');
      }
    }
  }, [router, isAuthenticated, isLoading]); 
  if (isLoading) {
    return (
      <Center style={{ width: '100%', minHeight: '100vh' }}>
        <LoadingOverlay 
            visible={true} 
            loaderProps={{ children: 'Төлвийг шалгаж байна...' }} 
            zIndex={1000}
        />
      </Center>
    );
  }
  return (
    <Center style={{ width: '100%', minHeight: '100vh' }}>
        <LoadingOverlay 
            visible={true} 
            loaderProps={{ children: 'Шилжиж байна...' }} 
            zIndex={1000}
        />
    </Center>
  );
};

export default HomePageRedirect;