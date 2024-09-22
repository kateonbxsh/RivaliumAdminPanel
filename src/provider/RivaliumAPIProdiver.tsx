import { fetchUtils, DataProvider, CreateResult, RaRecord } from 'react-admin';
import Cookies from 'js-cookie';

const dataMap: Record<string, string> = {
    'user': 'users',
    'match': 'matches',
    'member': 'members',
    'version': 'versions'
}

const apiUrl = 'http://localhost:1840/api/v1';
const httpClient = fetchUtils.fetchJson;

const formatQueryParams = (params: any) => {
    return Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        .join('&');
};

const getTokenFromCookies = () => {
    const token = (Cookies.get("accessToken") ?? "");
    return token;
};
const getAccessLevelFromCookies = () => {
    return Cookies.get('accessLevel') ?? "";
}

const dataProvider: DataProvider = {
    
    getList: async (resource, params) => {
        let query = { ...params.filter };
        if (params.pagination) {
            const { page, perPage } = params.pagination;
            query = {
                ...query,
                page: page,
                itemsPerPage: perPage,
            }
        }
        if (params.sort) {
            const { field, order } = params.sort;
            query = {
                ...query,
                sort: field,
                sortOrder: order,
            };
        }

        const url = `${apiUrl}/admin/${resource}/all?${formatQueryParams(query)}`;
        const options = {
            headers: new Headers({
                Authorization: `Bearer ${getTokenFromCookies()}`,
                Access: getAccessLevelFromCookies()
            }),
        };

        const { json } = await httpClient(url, options);
        return ({
            data: json[dataMap[resource]],
            total: json.total,
        });
    },

    // Fetch a single resource
    getOne: async (resource, params) => {
        const url = `${apiUrl}/admin/${resource}/${params.id}`;
        const options = {
            headers: new Headers({
                Authorization: `Bearer ${getTokenFromCookies()}`,
                Access: getAccessLevelFromCookies()
            }),
        };

        const { json } = await httpClient(url, options);
        return ({
            data: json,
        });
    },

    // Fetch multiple resources by IDs
    getMany: async (resource, params) => {
        const ids = params.ids.join(',');
        const url = `${apiUrl}/admin/${resource}/some?ids=${ids}`;
        const options = {
            headers: new Headers({
                Authorization: `Bearer ${getTokenFromCookies()}`,
                Access: getAccessLevelFromCookies(),
            }),
        };

        const { json } = await httpClient(url, options);
        return ({
            data: json,
        });
    },

    //@ts-ignore
    create: async (resource, params) => {
        const url = `${apiUrl}/admin/${resource}/`;
        const options = {
            method: 'POST',
            headers: new Headers({
                Authorization: `Bearer ${getTokenFromCookies()}`,
                Access: getAccessLevelFromCookies(),
                'Content-Type': 'application/json',
            }),
            body: JSON.stringify(params.data),
        };

        const { json } = await httpClient(url, options);
        return ({
            data: { ...params.data, id: json.id },
        }) ;
    },

    // Update an existing resource
    update: async (resource, params) => {
        const url = `${apiUrl}/admin/${resource}/${params.id}`;
        const options = {
            method: 'PUT',
            headers: new Headers({
                Authorization: `Bearer ${getTokenFromCookies()}`,
                Access: getAccessLevelFromCookies(),
                'Content-Type': 'application/json',
            }),
            body: JSON.stringify(params.data),
        };

        const { json } = await httpClient(url, options);
        return ({
            data: json,
        });
    },

    // Delete a resource
    delete: async (resource, params) => {
        const url = `${apiUrl}/admin/${resource}/${params.id}`;
        const options = {
            method: 'DELETE',
            headers: new Headers({
                Authorization: `Bearer ${getTokenFromCookies()}`,
                Access: getAccessLevelFromCookies(),
            }),
        };

        const { json } = await httpClient(url, options);
        return ({
            data: json,
        });
    },

};

export default dataProvider;
