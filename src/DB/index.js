/*
 * ActivityMan-online | An online activity manager
 * Copyright (C) 2023  pssr8
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

const mongoose = require('mongoose');
const { loadEnv } = require('vite');
const { join } = require('path');

// console.log(process.env.MODE || 'development', join(__dirname, '../../env'), ['SVR_']);

let env = loadEnv(process.env.MODE || 'development', join(__dirname, '../../env'), ['SVR_']);

const DBLoad = async () => {
    await mongoose.connect(env.SVR_MONGOSTRING);

    const { User } = require('./schemas/User');
    const { Assi } = require('./schemas/Assi');
    const { Acti } = require('./schemas/Acti');
    const { Lang } = require('./schemas/Lang');

    const ISO6391 = require('iso-639-1')

    const { ObjectId } = mongoose.Types;

    const DB = {
        models: { Lang, Assi, Acti, User },
        ObjectId,
        actis: {
            create: async () => {
                try {
                    let langMain = await DB.langs.main();
                    let actiCreate = Acti.create({
                        name: { values: [{ lang: langMain.id, text: '' }] },
                        description: { values: [{ lang: langMain.id, text: '' }] },
                        assis: [],
                        date: new Date(),
                        created: new Date(),
                        updated: new Date(),
                        type: 'd',
                        results: '',
                        note: '',
                    })
                    let acti = await actiCreate;
                    return acti
                } catch (e) {
                    console.error(e);
                }
            },
            /**
             * 
             * @param {string} oid the object id in the database
             * @param {{[c:string]: any}} changes the object of new changes (should not be used with assistants, instead use the assi methods)
             */
            modify: async (oid, changes) => {
                try {
                    let findActi = Acti.findById(oid);
                    let acti = await findActi;
                    if (!acti) {
                        throw new Error("Couldn't find acti with oid: " + oid);
                    }

                    /* modify */
                    await acti.modify(changes)
                } catch (e) {
                    console.error(e);
                }
            },
            /**
             * 
             * @param {string} oid the object id in the database
             */
            get: async (oid) => {
                try {
                    let acti = await Acti.findById(oid);
                    if (!acti) {
                        throw new Error("Couldn't find acti with oid: " + oid);
                    }
                    return acti;
                } catch (e) {
                    console.error(e);
                }
            },
            delete: async (oid) => {
                try {
                    await Acti.findByIdAndDelete(oid);
                } catch (e) {
                    throw e;
                }
            },
            getAll: () => {
                return Acti.find();
            }
        },
        assis: {
            create: async () => {
                try {
                    let assiCreate = Assi.create({
                        name: { first: '', last: '' },
                        contacts: [
                            {
                                lien: '',
                                name: '',
                                phone: [
                                    { number: '', note: '' }
                                ],
                                email: [
                                    { address: '', note: '' }
                                ]
                            }
                        ],
                        address: {
                            province: '',
                            city: '',
                            street: '',
                            postalcode: 'A0A0A0', // then (number).toString(36) to get postalcode
                        },
                        grade: 0,
                        birth: new Date().setFullYear(2000),
                        sexe: 0,
                        note: '',
                        created: new Date(),
                        updated: new Date()
                    })
                    let assi = await assiCreate;
                    return assi
                } catch (e) {
                    console.error(e);
                }
            },
            /**
             * 
             * @param {string} oid the object id in the database
             */
            get: async (oid) => {
                try {
                    let assi = await Assi.findById(oid);
                    if (!assi) {
                        throw new Error("Couldn't find assi with oid: " + oid);
                    }
                    return assi;
                } catch (e) {
                    console.error(e);
                }
            },
            /**
             * 
             * @param {string} oid the object id in the database
             * @param {{[c:string]: any}} changes the object of new changes (should not be used with assistants, instead use the assi methods)
             */
            modify: async (oid, changes) => {
                try {
                    let assi = await Assi.findById(oid);
                    if (!assi) {
                        throw new Error("Couldn't find assi with oid: " + oid);
                    }

                    /* modify */
                    assi.modify(changes)

                    assi.save();
                } catch (e) {
                    console.error(e);
                }
            },
            delete: async (oid) => {
                try {
                    await Assi.findByIdAndDelete(oid);
                } catch (e) {
                    throw new Error("Couldn't delete assi with oid: " + oid + "\n" + e.message);
                }
            },
            getAll: () => {
                return Assi.find();
            }
        },
        users: {
            add: async (name) => {
                let user = await User.create({
                    name: name | '',
                    permissions: {
                        actis_control: false,
                        assis_control: false,
                        users_control: false,
                    },
                    username: name | '',
                    password: ''
                });

                return user;
            },
            modify: async (oid, changes) => {
                let user = await User.findById(oid);
                await user.modify(changes);
                return user;
            },
            delete: async (oid) => {
                try {
                    await User.findByIdAndDelete(oid);
                } catch (e) {
                    throw new Error("Couldn't delete user with oid: " + oid + "\n" + e.message);
                }
            },
            getAll: () => {
                return User.find();
            },
            findUser: async (username) => {
                let user = User.findOne({ username })
                if (user) {
                    return user;
                } else {
                    throw new Error("User " + username + " not found.");
                }
            },
            admin: async () => {
                let adminUser = await User.findOne({ admin: true });
                if (adminUser) {
                    return adminUser;
                } else {
                    throw new Error("No admin user.")
                }
            },
            changeAdmin: async (username) => {
                let user = await User.findOne({ username });
                if (user) {
                    let oldAdmin = await User.findOne({ admin: true });

                    oldAdmin.admin = false;
                    user.admin = true;

                    await Promise.all([
                        oldAdmin.save(),
                        user.save(),
                    ]);

                    return true;

                } else {
                    throw new Error("The user you want to make admin doesn't exists.")
                }
            }

        },
        langs: {
            add: async (code) => {
                let exist = (await Lang.findOne({ code })).length > 0;
                if (!exist) {
                    let newLang = await Lang.create({
                        code,
                        name: ISO6391.getNativeName(code)
                    })
                    return newLang;
                } else {
                    throw new Error("Language '" + code + "' already exist.");
                }
            },
            delete: (code) => {
                return Lang.findOneAndDelete({ code, main: false });
            },
            list: async () => {
                let langs = await Lang.find()
                return langs;
            },
            main: async () => {
                let langMain = await Lang.find({ main: true });
                return langMain;
            },
            changeMain: async (code) => {
                let lang = (await Lang.find({ code }))[0];
                if (lang) {
                    let [langMain] = await Lang.find({ main: true });

                    langMain.main = false;
                    lang.main = true;

                    await Promise.all([
                        langMain.save(),
                        lang.save(),
                    ]);

                    return true;

                } else {
                    console.error()
                    return false;
                }
            }
        },
        firstTime: false,
        AUTH: {
            /**
         * check authentication
         * @param {string} username 
         * @param {string} password 
         * @returns { Promise<AUTH.UserInfo> }
         */
            verifyLogin: async (username, password) => {
                try {
                    let user = await DB.users.findUser(username);
                    // console.dir(user);
                    console.log('login: ', user.password === password, user.password, password);
                    if (user.password === password) {
                        return user;
                    } else {
                        throw new Error('Incorrect username or password!')
                    }

                } catch (e) {
                    throw e;
                }
            },
            firstTime: () => MongoDB.firstTime,
        },
        exportAssi: (assi) => {
            let { name, contacts, address, grade, birth, sexe, note, created, updated, id } = assi;
            return { name, contacts, address, grade, birth, sexe, note, created, updated, id };
        },
        exportActi: (acti) => {
            let { id, name, description, assis, date, created, updated, type, results, note } = acti;
            return { id, name, description, assis, date, created, updated, type, results, note };
        },
        exportUser: (user) => {
            let { name, permissions, username, password, id, isAdmin, admin } = user;
            return { name, permissions, username, password, id, isAdmin, admin };
        },
        exportLang: (lang) => {
            let { code, name, main } = lang;
            return { code, name, isMain: () => main };
        },
    };

    // set langs
    let langs = await Lang.find();

    if (langs.length === 0) {
        Lang.create({
            code: 'en',
            name: 'English',
            main: true
        })
    }

    // set users
    try { // try getting admin
        await DB.users.admin();
    } catch (e) { // if no admin
        console.log('No admin-user found. Creating one...')
        let admin = await User.create({
            name: 'Administrator',
            permissions: {
                actis_control: true,
                assis_control: true,
                users_control: true,
            },
            username: 'Admin',
            password: '0000',
            admin: true
        })
        DB.firstTime = true;
        console.log('Created user ' + admin.id + '.\nusername=Admin\npassword=0000');
    }

    return DB;
}

module.exports = DBLoad();