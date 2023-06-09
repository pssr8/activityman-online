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

const { model, SchemaTypes, Schema, Types } = require("mongoose");

let langscache = [/* {code, oid} */]
langscache.add = (code, id) => {
    langscache.push({code, id});
}

const Lang = model('Lang', {
    'code': {
        type: String,
        required: true,
        lowercase: true
    },
    'name': {
        type: String,
        required: true,
    },
    main: {
        type: Boolean,
        required: true,
        default: () => false
    }
});

const LangString = new Schema({
    lang: {
        type: SchemaTypes.ObjectId,
        ref: "lang"
    },
    text: String
});

const MultiLang = new Schema({
    values: [LangString],
    multilang: {
        type: Boolean,
        default: () => true
    },
});

MultiLang.methods.rename = async function (langcode, newText) {
    try {
        let langQuery;
        let lang = langscache.find(l => l.code == langcode)
        if (lang) {
            langQuery = lang;
        } else {
            langQuery = await Lang.findOne({ code: langcode });
        }

        if (!langQuery) {
            throw new Error("Couldn't find the requested language in the database. Query: '" + langcode + "'");
        }
        
        for (const langkey in this.values) {
            let oids = this.values[langkey].lang, // all langs int the MultiString
                oidQuery = langQuery.id; // the lang we are looking for

            if (oids == oidQuery) {
                this.values[langkey].text = newText;
                // console.log(this.values[langkey], newText)
                return true;
            }
        }
        /* else if notFound { addNewLang() } */
        this.values = [...this.values, {
            lang: langQuery.id,
            text: newText
        }]
    } catch(e) {
        throw e;
    }
}

module.exports = { MultiLang, Lang }