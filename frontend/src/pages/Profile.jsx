import { Alert, AlertIcon, Center, Heading, Text } from "@chakra-ui/react";
import useAuth from "../hooks/useAuth";

const Profile = () => {
    const {user} = useAuth();
    const {email, verified, createdAt} = user;

    return (
        <Center my={16} flexDir={"column"}>
            <Heading mb={4}>My Account</Heading>
            {
                !verified && (
                    <Alert status="warning" w='fit-content' borderRadius={12} mb={3}>
                        <AlertIcon />
                        Please verify your email
                    </Alert>
                )
            }
            <Text color='white' mb={2}>
                Email:{" "}
                <Text as='span' color='gray.400'>
                    {email}
                </Text>
            </Text>
            <Text color='white' mb={2}>
                Created On:{" "}
                <Text as='span' color='gray.400'>
                {new Date(createdAt).toLocaleDateString('en-IN')} {" "} {new Date(createdAt).toLocaleTimeString('en-IN')}
                </Text>
            </Text>
        </Center>
    )
}

export default Profile;