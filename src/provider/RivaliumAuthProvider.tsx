import { AuthProvider } from 'react-admin';
import Cookies from 'js-cookie'; // Assuming you are using `js-cookie` to manage cookies
import { fetchUtils } from 'react-admin'; // Used for handling HTTP requests

const apiUrl = 'http://localhost:1840/api/v1'; // Your API endpoint

const authProvider: AuthProvider = {
    // Handle login
    login: async ({ username, password }) => {
        const request = new Request(`${apiUrl}/admin/login`, {
            method: 'POST',
            body: JSON.stringify({ username, password }),
        });

        const response = await fetchUtils.fetchJson(request, {
            headers: new Headers({ 
                'Content-Type': 'application/json',
                'Accept': 'application/json' }),
        });
        
        if (!response || !response.json?.token) {
            throw new Error('Login failed');
        }

        Cookies.set('accessToken', response.json.token, { expires: 1 });
        Cookies.set('accessLevel', response.json.access);
    },

    logout: () => {
        Cookies.remove('accessToken');
        return Promise.resolve();
    },

    checkAuth: () => {
        const token = Cookies.get('accessToken');
        if (token) {
            return Promise.resolve();
        } else {
            return Promise.reject();
        }
    },

    checkError: (error) => {
        const status = error.status;
        if (status === 401 || status === 403) {
            Cookies.remove('accessToken');
            return Promise.reject();
        }
        return Promise.resolve();
    },

    getPermissions: () => {
        // Customize based on how your API manages roles/permissions
        return Promise.resolve();
    },

    getIdentity: async () => {
        const token = Cookies.get('accessToken');
        if (!token) {
            return Promise.reject();
        }

        // Example of fetching the authenticated user's profile
        const request = new Request(`${apiUrl}/admin/member/profile`, {
            method: 'GET',
        });

        const headers = new Headers({ 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        })
        headers.set('Access', Cookies.get('accessLevel') ?? "");

        const response = await fetchUtils.fetchJson(request, {
            headers
        });
        if (response.status !== 200) {
            return Promise.reject();
        }

        return {
            id: response.json.id,
            ...response.json
        };
    }
};

export default authProvider;
