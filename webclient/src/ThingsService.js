const API_HOST = process.env.THINGS_SERVICE_API_HOST || 'http://localhost';
const API_PORT = process.env.THINGS_SERVICE_API_PORT || '4000';

async function fetchData(path, opts = {}) {
    const url = `${API_HOST}:${API_PORT}${path}`;

    const fetchOpts = Object.assign({}, {
        mode: 'cors'
    }, opts)

    try {
        const response = await fetch(url, fetchOpts);
        return await response.json();
    } catch (error) {
        return error;
    }
}

export function getAreas() {
    const path = '/areas';
    return fetchData(path)
}

export function getProjectsByArea(areaId) {
    const path = `/projects?areaId=${areaId}`;
    return fetchData(path)
}

export function getTasksByProject(projectId) {
    const path = `/tasks?projectId=${projectId}`;
    return fetchData(path)
}

export function tagTask(taskId) {
    const path = `/tasks/${taskId}`;
    return fetchData(path, {
        method: 'PATCH'
    })
}

export async function callResultsToState(callFunc, setFunc) {
    try {
        const results = await callFunc();
        setFunc(results)
    } catch (error) {
        setFunc([])
    }
}