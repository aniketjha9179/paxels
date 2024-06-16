import axios from 'axios';

const API_KEY = '19229917-9448824f1a0271f33bbc8d091';
const apiUrl = `https://pixabay.com/api/?key=${API_KEY}`;

const formatUrl = (params) => {
    let url = apiUrl + "&per_page=30&safesearch=true&editors_choice=true";
    if (!params) return url;
    let paramKeys = Object.keys(params);
    paramKeys.forEach(key => {
        let value = key === "q" ? encodeURIComponent(params[key]) : params[key];
        url += `&${key}=${value}`;
    });
    // console.log("Final url ", url);
    return url;
}

export const apiCall = async (params) => {
    try {
        const response = await axios.get(formatUrl(params));
        // console.log('Response:', response); // Log the full response
        const data = response.data; // Accessing response.data directly
        return { success: true, data };
    } catch (err) {
        console.log(`Got error`, err.message);
        return { success: false, msg: err.message };
    }
}
