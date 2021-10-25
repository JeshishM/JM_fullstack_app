import React, { useState, useEffect } from 'react'
import {
    Flex,
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

const Todo = () => {
    const AuthUser = useAuthUser()
    const [input, setInput] = useState('')
    // format of a React Hook: useState function
    // stateVariableName, SetterFunction, = useState(initialValue)
    const [todos, setTodos] = useState([])
    // this does the same, but makes an array that will be populated when data is loaded from the database


    useEffect(() => {
        AuthUser.id &&
            firebase
                .firestore()
                .collection("todos")
                .where('user', '==', AuthUser.id)

                .onSnapshot(snapshot => {
                    setTodos(
                        snapshot.docs.map(
                            doc => {
                                return{
                                  toDoID: doc.id,
                                  toDoName: doc.data().todo,
      
                                }
                            }
                        )
                    );
                });
    })

    const sendData = () => {
        try {
            // try to update doc
            firebase
                .firestore()
                .collection("todos") // only using a single collection

                .add({
                    todo: input,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    user: AuthUser.id
                })
                .then(console.log('Data was successfully sent to cloud firestore!'))
                //resetting the name value since we saved it already
                setInput('');
        } catch (error) {
            console.log(error)
        }
    }

    const deleteTodo = (t) => {
        try {
            firebase
                .firestore()
                .collection("todos")
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
                
            </Flex>

                <InputGroup>
                    <InputLeftElement
                        pointerEvents="none"
                        children={<AddIcon color="gray.300" />}
                    />
                    <Input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="To Do" />
                    <Button
                        ml={2}
                        onClick={() => sendData()}

                    >
                        Add Todo
                    </Button>
                </InputGroup>
                {todos.map((item, i) => {
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
                            <Flex align="center">
                                <Text fontSize="xl" mr={4}>{i + 1}.</Text>
                                <Link href={"/todos/" + item.toDoID} >{item.toDoName}</Link>
                            </Flex>
                            <IconButton onClick={() => deleteTodo(item.toDoID)} icon={<DeleteIcon />} />
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
})(Todo)