import axios from '../utils/axios';

export const getPermissionsAPI = async () => {
    const { data } = await axios.get('/permissions');
    return data;
};
