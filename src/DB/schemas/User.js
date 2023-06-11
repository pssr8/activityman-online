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

const { Schema, model } = require("mongoose");


let UserSchema = new Schema({
    name: String,
    permissions: {
        actis_control: Boolean,
        assis_control: Boolean,
        users_control: Boolean,
    },
    username: String,
    password: String,
    admin: Boolean
});

UserSchema.methods.modify = async function (changes) {
    for (let key of ['name', 'password']) {
        if(changes[key]) {
            this[key] = changes[key];
        }
    }
    await this.save();
}
UserSchema.methods.allow = async function (permissionKey) {
    if (permissionKey in this.permissions) {
        this.permissions[permissionKey] = true;
        await this.save();
    } else {
        throw new Error("Permission key ('" + permissionKey + "') doesn't exists");
    }
}
UserSchema.methods.disallow = async function (permissionKey) {
    if (permissionKey in this.permissions) {
        this.permissions[permissionKey] = false;
        await this.save();
    } else {
        throw new Error("Permission key ('" + permissionKey + "') doesn't exists");
    }
}
UserSchema.methods.isAdmin = function () {
    return this.admin;
}


const User = model('User', UserSchema);

module.exports = { User };