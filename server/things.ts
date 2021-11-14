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