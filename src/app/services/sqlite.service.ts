import { Injectable } from '@angular/core';

import { Capacitor } from '@capacitor/core';
import { CapacitorSQLite, SQLiteDBConnection, SQLiteConnection, capSQLiteSet,
         capSQLiteChanges, capSQLiteValues, capEchoResult, capSQLiteResult,
         capNCDatabasePathResult } from '@capacitor-community/sqlite';

@Injectable()

export class SQLiteService {
    sqlite: SQLiteConnection;
    isService: boolean = false;
    platform: string;
    sqlitePlugin: any;
    native: boolean = false;

    constructor() {
    }
    /**
     * Plugin Initialization
     */
    initializePlugin(): Promise<boolean> {
        return new Promise (resolve => {
            this.platform = Capacitor.getPlatform();
            if(this.platform === 'ios' || this.platform === 'android') this.native = true;
            this.sqlitePlugin = CapacitorSQLite;
            this.sqlite = new SQLiteConnection(this.sqlitePlugin);
            this.isService = true;
            resolve(true);
        });
    }
    getPlatform() {
        return this.platform;
    }

    /**
     * Create a connection to a database
     * @param database
     * @param encrypted
     * @param mode
     * @param version
     */
    async createConnection(database:string, encrypted: boolean,
                           mode: string, version: number, readonly?: boolean
                           ): Promise<SQLiteDBConnection> {
        if(this.sqlite != null) {
            try {
/*                if(encrypted) {
                    if(this.native) {
                        const isSet = await this.sqlite.isSecretStored()
                        if(!isSet.result) {
                            return Promise.reject(new Error(`no secret phrase registered`));
                        }
                    }
                }
*/
               const readOnly = readonly ? readonly : false;
               const db: SQLiteDBConnection = await this.sqlite.createConnection(
                                database, encrypted, mode, version, readOnly);
                if (db != null) {
                    return Promise.resolve(db);
                } else {
                    return Promise.reject(new Error(`no db returned is null`));
                }
            } catch (err) {
                return Promise.reject(new Error(err));
            }
        } else {
            return Promise.reject(new Error(`no connection open for ${database}`));
        }
    }
    /**
     * Close a connection to a database
     * @param database
     */
    async closeConnection(database:string, readonly?: boolean): Promise<void> {
        if(this.sqlite != null) {
            try {
                const readOnly = readonly ? readonly : false;
                await this.sqlite.closeConnection(database, readOnly);
                return Promise.resolve();
            } catch (err) {
                return Promise.reject(new Error(err));
            }
        } else {
            return Promise.reject(new Error(`no connection open for ${database}`));
        }
    }
    /**
     * Retrieve an existing connection to a database
     * @param database
     */
    async retrieveConnection(database:string, readonly?: boolean):
            Promise<SQLiteDBConnection> {
        if(this.sqlite != null) {
            try {
                const readOnly = readonly ? readonly : false;
                return Promise.resolve(await this.sqlite.retrieveConnection(database, readOnly));
            } catch (err) {
                return Promise.reject(new Error(err));
            }
        } else {
            return Promise.reject(new Error(`no connection open for ${database}`));
        }
    }
    /**
     * Check if connection exists
     * @param database
     */
     async isConnection(database: string, readonly?: boolean): Promise<capSQLiteResult> {
        if(this.sqlite != null) {
            try {
                const readOnly = readonly ? readonly : false;
                return Promise.resolve(await this.sqlite.isConnection(database, readOnly));
            } catch (err) {
                return Promise.reject(new Error(err));
            }
        } else {
            return Promise.reject(new Error(`no connection open`));
        }
    }
}
