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
    Text
} from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../lib/api';

const Register = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const {
        mutate: createAccount,
        isPending,
        isError,
        error
    } = useMutation({
        mutationFn: register,
        onSuccess: ()=>{
            navigate('/',{
                replace: true,
            })
        }
    })

    return (
        <Flex minH='100vh' align='center' justify='center'>
            <Container mx='auto' maxW='md' py={12} px={6} textAlign='center'>
            <Heading fontSize='4xl' mb={8}>
                    Create your account
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
                        <FormControl id='email'>
                            <FormLabel>Email Address</FormLabel>
                            <Input type='email' 
                            autoFocus
                            value={email}
                            onChange={(e)=> setEmail(e.target.value)}
                            />
                        </FormControl>
                        <FormControl id='password'>
                            <FormLabel>Password</FormLabel>
                            <Input type='password' 
                            value={password}
                            onChange={(e)=> setPassword(e.target.value)}
                            />
                            <Text color='text.muted' fontSize='xs' textAlign='left' mt={2}>
                                - Must be atleast 6 characters long
                            </Text>
                        </FormControl>
                        <FormControl id='confirmPassword'>
                            <FormLabel>Confirm Password</FormLabel>
                            <Input type='password' 
                            value={confirmPassword}
                            onChange={(e)=> setConfirmPassword(e.target.value)}
                            onKeyDown={
                                (e) => e.key === 'Enter' && createAccount({ email, password, confirmPassword })
                            }
                            />
                            <Button my={2} isDisabled={!email || password.length<6 || password !== confirmPassword}
                            isLoading={isPending}
                            onClick={
                                ()=> createAccount({ email, password, confirmPassword })
                            }
                            >
                                Create Account
                            </Button>
                            <Text align='center' fontSize='sm' color='text.muted'>
                            Already have an account?{" "}
                            <ChakraLink as={Link} to='/login'>
                                Sign In
                            </ChakraLink>
                        </Text>
                        </FormControl>
                    </Stack>
                </Box>

            </Container>
        </Flex>
                
    )
}

export default Register;