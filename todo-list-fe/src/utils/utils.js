export const getServerUrl = () => {
    const serverHost = import.meta.env.VITE_SERVER_HOST;
    const serverPort = import.meta.env.VITE_SERVER_PORT;
    return `http://${serverHost}:${serverPort}`;
};

export const getApiUrl = (path) => {
    console.log(`${getServerUrl()}${path}`);
    return `${getServerUrl()}${path}`;
};