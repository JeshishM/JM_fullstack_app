import React from 'react';
import {
  useAuthUser,
  withAuthUser,
  withAuthUserTokenSSR,
} from 'next-firebase-auth';
import Header from '../components/Header';
import {
  Box,
} from '@chakra-ui/react';

const Home = () => {
  const AuthUser = useAuthUser();

  return (
    <>
      <Header 
        email={AuthUser.email} 
        signOut={AuthUser.signOut} />
      <Box p={4}>Example Personal Digital Assistant App</Box>
    </>
  );
}

export const getServerSideProps = withAuthUserTokenSSR()()

export default withAuthUser()(Home)
