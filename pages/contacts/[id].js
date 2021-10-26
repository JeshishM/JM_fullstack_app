import React, { useState, useEffect } from 'react';
import {
    Flex,
    Heading,
    InputGroup,
    InputLeftElement,
    Input,
    Button,
    Text,
    IconButton,
    Divider,
    Link,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { useAuthUser, withAuthUser, withAuthUserTokenSSR, AuthAction } from 'next-firebase-auth';
import { getFirebaseAdmin } from 'next-firebase-auth';
import firebase from 'firebase/app';
import 'firebase/firestore';
import Header from '../../components/Header';

const SingleContact = ({itemData}) => {
  const AuthUser = useAuthUser();
	const [inputFirstName, setInputFirstName] = useState('');
	const [inputLastName, setInputLastName] = useState('');
  const [inputPhone, setInputPhone] = useState('');;
  const [inputEmail, setInputEmail] = useState('')
	const [contacts, setContacts] = useState([])
  const [statusMsg, setStatusMsg] = useState('');
  
  const sendData = async () => {
    try {
      console.log("You Update data has been sent to firebase!");
      // try to update doc
      const docref = await firebase.firestore().collection("contacts").doc(itemData.id);
      const doc = docref.get();

      if (!doc.empty) {
        docref.update(
          {
            firstName: inputFirstName,
            lastName: inputLastName,
            phone: inputPhone,
            email: inputEmail,
            user: AuthUser.id
          }
        );
        setStatusMsg("Updated!");
      }

    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <Header 
        email={AuthUser.email} 
        signOut={AuthUser.signOut} />
      <Flex flexDir="column" maxW={800} align="center" justify="start" minH="100vh" m="auto" px={4} py={3}>
			<Flex justify="space-between" w="100%" align="center">
                <Heading mb={4}>Welcome To Update Your Contact, {AuthUser.email}!</Heading>
            </Flex>
			
        <InputGroup>
          <InputLeftElement
            pointerEvents="none"
            children={<AddIcon color="gray.300" />}
          />

           <Input type="text" value={inputFirstName} onChange={(e) => setInputFirstName(e.target.value)} placeholder="First Name" /> 
           <Input type="text" value={inputLastName} onChange={(e) => setInputLastName(e.target.value)} placeholder="Last Name" />
           <Input type="phone" value={inputPhone} onChange={(e) => setInputPhone(e.target.value)} placeholder="Phone Number" />
           <Input type="email" value={inputEmail} onChange={(e) => setInputEmail(e.target.value)} placeholder="email@example.com" />

          <Button
            ml={7}
            onClick={() => sendData()}
          >
            Update
          </Button>
        </InputGroup>
        <Text>
          {statusMsg}
        </Text>
      </Flex>
    </>
  );
};

export const getServerSideProps = withAuthUserTokenSSR(
  {
    whenUnauthed: AuthAction.REDIRECT_TO_LOGIN
  }
)(
  async ({ AuthUser, params }) => {
    // take the id parameter from the url and construct a db query with it
    const db = getFirebaseAdmin().firestore();
    const doc = await db.collection("contacts").doc(params.id).get();
    let itemData;
    if (!doc.empty) {
      // document was found
      let docData = doc.data();
      itemData = {
				id: doc.id,
				firstName: docData.firstName,
        lastName: docData.lastName,
        phone: docData.phone,
        email: docData.email
      };
    } else {
      // no document found
      itemData = null;
    }
    // return the data
    return {
      props: {
        itemData
      }
    }
  }
)

export default withAuthUser(
  {
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
    whenUnauthedBeforeInit: AuthAction.REDIRECT_TO_LOGIN
  }
)(SingleContact)