import { open as openDB } from 'sqlite';
const expandTilde = require('expand-tilde');

const sqlite3 = require('sqlite3');
const DB_PATH = '~/Library/Group\ Containers/JLMPQHK86H.com.culturedcode.ThingsMac/Things\ Database.thingsdatabase/main.sqlite';

export const getDB = async () => {
    return openDB({
        filename: expandTilde(DB_PATH),
        driver: sqlite3.Database
    });
}

export const getAreas = async() => {
    const db = await getDB();
    
    const result = await db.all('SELECT uuid, title FROM TMArea ORDER BY `index` ASC');
    const nonResult = await db.all(`SELECT uuid, type, title, area FROM TMTask WHERE type = 1 and status = 0 and trashed = 0 and area IS NULL`);

    if (nonResult.length > 0) {
        result.push({
            uuid: 0,
            title: 'Area-free projects'
        })
    }

    return result;
}

export const getProjectByArea = async(areaId: String) => {
    const db = await getDB();

    let areaWhereCondition = areaId === "0" ? 'area IS NULL' : `area = '${areaId}'`;

    return await db.all(`
        SELECT uuid, type, title, area
        FROM TMTask
        WHERE
            type = 1 AND 
            status = 0 AND 
            trashed = 0 AND 
            ${areaWhereCondition}  
        ORDER BY \`index\` ASC`);
}

export const getTasksByProject = async(projectId: String) => {
    const db = await getDB();

    return await db.all(`
        SELECT uuid, title
        FROM TMTask
        WHERE(
            (project = '${projectId}' AND type = 0) OR
            (actionGroup IN(SELECT uuid FROM TMTask WHERE project = '${projectId}' and type = 2 ORDER BY \`index\` ASC))
        ) AND trashed = 0 AND status = 0
        ORDER BY \`index\` DESC`
    );
}