import { 
    Box,
    Container,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Stack,
    Link as ChakraLink,
    Button,
    Text,
    Alert,
    AlertIcon
} from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { forgotPassword } from '../lib/api';

const ForgotPassword =()=> {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');

    const {
        mutate: sendPasswordResetEmail,
        isPending,
        isSuccess,
        isError,
        error
    } = useMutation({
        mutationFn: forgotPassword,
    })

    return (
        <Flex minH='100vh' align='center' justify='center'>
                    <Container mx='auto' maxW='md' py={12} px={6} textAlign='center'>
                    <Heading fontSize='4xl' mb={8}>
                            Reset your password
                        </Heading>
                        <Box rounded='lg' bg='gray.700' boxShadow='lg' p={8}>
                            {
                                isError && (
                                <Box mb={3} color='red.400'>
                                    {
                                        error?.message || 'An error occured'
                                    }
                                </Box>
                            )}
                        
                        <Stack spacing={4}>
                        {   isSuccess ?
                        <Alert status='success' borderRadius={12}>
                            <AlertIcon />
                            Email sent! Check your inbox for further instructions.
                        </Alert>
                        : <> 
                            <FormControl id='email'>
                            <FormLabel>Email Address</FormLabel>
                            <Input type='email' 
                            autoFocus
                            value={email}
                            onChange={(e)=> setEmail(e.target.value)}
                            onKeyDown={
                                (e) => e.key === 'Enter' && sendForgotPasswordEmail({ email })
                            }
                            />
                        </FormControl>
                        <Button my={2} isDisabled={!email }
                            isLoading={isPending}
                            onClick={
                                ()=> sendPasswordResetEmail({ email })
                            }
                            >
                                Get Password Reset Link 
                            </Button>
                            </>}
                        </Stack>
                        </Box>
                    </Container>
                </Flex>
    )
}

export default ForgotPassword;