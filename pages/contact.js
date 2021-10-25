import React, { useState, useEffect } from 'react'
import {
    Flex, HStack,
    Heading,
    InputGroup,
    InputLeftElement,
    Input,
    Button, Link, 
    Text,
    IconButton,
    Divider,
} from "@chakra-ui/react"
import { AddIcon, DeleteIcon, StarIcon } from "@chakra-ui/icons"
import {
    useAuthUser,
    withAuthUser,
    withAuthUserTokenSSR,
    AuthAction,
} from 'next-firebase-auth'
import getAbsoluteURL from '../utils/getAbsoluteURL'
import firebase from 'firebase/app'
import 'firebase/firestore'
import Header from '../components/Header'

const Contact = () => {
    const AuthUser = useAuthUser()
    const [inputFirstName, setInputFirstName] = useState('')
    const [inputLastName, setInputLastName] = useState('')
    const [inputPhone, setInputPhone] = useState('')
    const [inputEmail, setInputEmail] = useState('')

    // format of a React Hook: useState function
    // stateVariableName, SetterFunction, = useState(initialValue)
    const [contacts, setContacts] = useState([])
    // this does the same, but makes an array that will be populated when data is loaded from the database


    useEffect(() => {
        AuthUser.id &&
            firebase
                .firestore()
                .collection("contacts")
                .where('user', '==', AuthUser.id)
                .onSnapshot(
                  snapshot => {
                    setContacts(
                      snapshot.docs.map(
                        doc => {
                          return{
                            contactID: doc.id,
                            contactFirstName: doc.data().firstName,
                            contactLastName: doc.data().lastName,
                            contactPhone: doc.data().phone,
                            contactEmail: doc.data().email,
                            
                          }

                        }
                      )
                    );
                })

    })

    const sendData = () => {
        try {

            firebase
                .firestore()
                .collection("contacts") // this time we're using one collection

                .add({
                    firstName: inputFirstName,
                    lastName: inputLastName,
                    phone: inputPhone,
                    email: inputEmail,
                    user: AuthUser.id
                })
                .then(console.log('Data was successfully sent to cloud firestore!'))

                .then(console.log('inputFirstName was ' + inputFirstName))
                .then(console.log('inputLastName was ' + inputLastName))
                .then(console.log('inputPhone was ' + inputPhone))
                .then(console.log('inputEmail was ' + inputEmail))


                //resetting state variables since we saved them already
                setInputFirstName('');
                setInputLastName('');
                setInputPhone('');
                setInputEmail('');
                
        } catch (error) {
            console.log(error)
        }
    }

    const deleteContact = (t) => {
        try {
            firebase
                .firestore()
                .collection("contacts")
                .doc(t)
                .delete()
                .then(console.log('Data was successfully deleted!'))
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <>

        <Header
        email={AuthUser.email} 
        signOut={AuthUser.signOut} />
        
        <Flex flexDir="column" maxW={800} align="center" justify="center" minH="100vh" m="auto" px={4}>
            <Flex justify="space-between" w="100%" align="center">
                <Heading mb={4}>Welcome, {AuthUser.email}!</Heading>
            </Flex>

                <InputGroup>
                    <InputLeftElement
                        pointerEvents="none"
                        children={<AddIcon color="gray.300" />}
                    />
                    <Input type="text" value={inputFirstName} onChange={(e) => setInputFirstName(e.target.value)} placeholder="First Name" />
                    <Input type="text" value={inputLastName} onChange={(e) => setInputLastName(e.target.value)} placeholder="Last Name" />
                    <Input type="tel" value={inputPhone} onChange={(e) => setInputPhone(e.target.value)} placeholder="Phone Number" />
                    <Input type="eamil" value={inputEmail} onChange={(e) => setInputEmail(e.target.value)} placeholder="email@example.com" />

                    
                    <Button
                        ml={2}
                        onClick={() => sendData()}

                    >
                        Add 
                    </Button>
                </InputGroup>
                {contacts.map((item, i) => {
                return (
                    <React.Fragment key={i}>
                        {i > 0 && <Divider />}
                        <Flex
                            key={i}
                            w="100%"
                            p={5}
                            my={2}
                            align="center"
                            borderRadius={5}
                            justifyContent="space-between"
                        >
                            <HStack spacing={6} w="full" >
                                
                                <Text fontSize="xl" mr={4}>{i + 1}.</Text>

                                <Link href={"/contacts/" + item.contactID} >
                                    {item.contactFirstName} {item.contactLastName} 
                                </Link>


                            </HStack>
                            <IconButton onClick={() => deleteContact(item.contactID)} icon={<DeleteIcon />} />
                        </Flex>
                    </React.Fragment>
                )
            })}
        </Flex>

        </>
    )
}


export const getServerSideProps = withAuthUserTokenSSR({
    whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async ({ AuthUser, req }) => {
    
    return {
        props: {

        }
    }
})
// this is from the Auth project we're building off it. Ensures that we only render for authenticated users
export default withAuthUser({
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
    whenUnauthedBeforeInit: AuthAction.REDIRECT_TO_LOGIN,
})(Contact)