import axios from 'axios';
import queryClient from './queryClient';
import { navigate } from "../lib/setNavigate";

const options = {
    baseURL: import.meta.env.VITE_APP_URL,
    withCredentials: true,
}

// create a separate client for refreshing the access token
// to avoid infinite loops with the error interceptor
const TokenRefreshClient = axios.create(options);
TokenRefreshClient.interceptors.response.use((response) => response.data);

const API = axios.create(options);

API.interceptors.response.use(
    (response) => response.data,
    async (error) => {
        const {config, response} = error;
        const {status, data} = response || {};
        // try to refresh the access token behnind the scenes
        if(status === 401 && data?.errorCode === 'InvalidAccessToken') {
            try {
                // refresh the access token, then retry the original request
                await TokenRefreshClient.get("/auth/refresh");
                return TokenRefreshClient(config);
            } catch (error) {
                queryClient.clear();
                navigate('/login',{
                    state: {
                        redirectUrl: window.location.pathname,
                      },
                })
            }
        }

        return Promise.reject({status, ...data});
    }
)

export default API;
