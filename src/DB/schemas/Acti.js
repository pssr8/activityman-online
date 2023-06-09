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


const { model, SchemaTypes, Schema } = require("mongoose");
const { MultiLang } = require("./Lang");
const { Assi } = require("./Assi");



const ActiSchema = new Schema({
    name: {
        type: MultiLang,
        required: true,
    },
    description: {
        type: MultiLang,
        required: true
    },
    assis: {
        type: [SchemaTypes.ObjectId],
        ref: 'Assi'
    },
    date: Date,
    tags: {
        type: [String],
        required: true,
        default: () => []
    },

    created: Date,
    updated: Date,

    /**
     * @type { 'd' | 'l' | string } - dirigé, libre ou autre
    */
    type: String,

    results: String,

    note: String

})
/* ActiSchema.pre('save', (next) => {
    this.updated = new Date();
    next();
}) 
Didn't work; idk why
*/

ActiSchema.methods.modify = async function (changes) {
    try {

        for (const key in changes) {
            if (key in this) {
                if (this[key].multilang) { /* MULTILANG */
                    // console.log(this[key].values)
                    for (const lang in changes[key]) {
                        await this[key].rename(lang, changes[key][lang])
                        console.log("modified lang '" + lang + "' of property '" + key + "' in activity " + this.id);
                    }
                } else if (key === 'date') {
                    if (changes[key] instanceof Date) {
                        this[key] = changes[key];
                    } else {
                        throw new Error("Provided date is not a Date object")
                    }
                } else if (key === 'type') {
                    if (typeof changes[key] === 'string') {
                        this[key] = changes[key];
                    } else {
                        throw new Error("Provided "+key+" must be either {'d' | 'l' | string}. Using: " + (typeof changes[key]))
                    }
                } else if (key === 'results' || key === 'note') {
                    if (typeof changes[key] === 'string') {
                        this[key] = changes[key];
                    } else {
                        throw new Error("Provided "+key+" must be {string}. Using: " + (typeof changes[key]))
                    }
                }

            }
        }
        this.updated = new Date();
        await this.save();
    } catch (e) {
        console.error(e.message);
    }
}
ActiSchema.methods.assi_add = async function (oid) {
    try {
        let assi = await Assi.findById(oid)
        if (assi) {
            if (this.assis.findIndex(a => a == oid) < 0) { /* if is not already in the activity */
                this.assis = [...this.assis, assi.id]
                console.log("Added assistant " + assi.id + " to activity " + this.id)
                await this.save();
            } else {
                throw ("Assi already in the activity. OID: '" + oid + "'");
            }
        } else {
            throw ("Trying to add non existing assistant. OID: '" + oid + "'");
        }
    } catch (e) {
        if (typeof e == 'string') {
            throw new Error(e);
        } else {
            throw e;
        }
    }
}
ActiSchema.methods.assi_remove = async function (oid) {
    try {
        let index = this.assis.findIndex(v => v == oid);
        if (index >= 0) {
            this.assis.splice(index, 1);
            console.log("Deleted assistant " + oid + " from activity " + this.id)
            await this.save();
        }
    } catch (e) {
        throw e;
    }
}
ActiSchema.methods.assi_list = function () {
    return this.assis;
}

const Acti = model('Acti', ActiSchema);

module.exports = { Acti };