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


const mongoose = require("mongoose");
const { model, Schema } = mongoose;


const ContactEmailSchema = new Schema({
    address: String,
    note: String
});

const ContactPhoneSchema = new Schema({
    number: String,
    note: String
});

const ContactSchema = new Schema({
    lien: String,
    name: String,
    phone: [ContactPhoneSchema],
    email: [ContactEmailSchema],
});


/* 
class AddressPostalCode extends mongoose.SchemaType {
    constructor(key, options) {
        super(key, options, 'AddressPostalCode');
    }

    // `cast()` takes a parameter that can be anything. You need to
    // validate the provided `val` and throw a `CastError` if you
    // can't convert it.
    cast(val) {
        if (typeof val == 'number') {
            return val;
        } else if (typeof val == 'string') {
            return postalCodeS2N(val);
        } else {
            throw new Error("Param must be either a string or a number");
        }
    }
}
mongoose.Schema.Types.AddressPostalCode = AddressPostalCode;
 */


const AddressSchema = new Schema({
    province: { type: String, uppercase: true },
    city: String,
    street: String,
    postalcode: String
});

const AssiSchema = new Schema({
    name: {
        type: {
            first: String, last: String
        },
        required: true
    },
    contacts: {
        type: [ContactSchema],
        default: [],
        required: true
    },
    address: {
        type: AddressSchema,
        required: true
    },

    /**
     * 0 - no school
     * 
     * Preschool
     * 1 - Pre-Kindergarten
     * 2 - Kindergarten
     * 
     * Primary
     * One
     * 3 - Grade 1
     * 4 - Grade 2
     * Two
     * 5 - Grade 3
     * 6 - Grade 4
     * Three
     * 7 - Grade 5
     * 8 - Grade 6
     * 
     * Secondary
     * One
     * 9 - Secondary I
     * 10 - Secondary II
     * Two
     * 11 - Secondary III
     * 12 - Secondary IV
     * 13 - Secondary V
     * 
     * 14 - Other
     */
    grade: Number,

    birth: Date,

    /**
     * 0 - Other
     * 1 - Male
     * 2 - Female
     */
    sexe: Number,

    note: String,

    created: Date,
    updated: Date
});

AssiSchema.methods.modify = async function (changes) {
    try {
        for (const key in changes) {
            if (key in this) {
                if (key === 'name') {
                    if (changes[key].first)
                        this[key].first = changes[key].first
                    if (changes[key].last)
                        this[key].last = changes[key].last
                } else if (key === 'address') {
                    for (const addressProp of ['province', 'city', 'street', 'postalcode']) {
                        if (changes[key][addressProp]) {
                            this[key][addressProp] = changes[key][addressProp]
                        }
                    }
                } else if (key === 'grade' || key === 'sexe') {
                    if (typeof changes[key] === 'number') {
                        this[key] = changes[key];
                    } else {
                        throw new Error("Provided " + key + " must be {string}. Using: " + (typeof changes[key]))
                    }
                } else if (key === 'birth') {
                    if (changes[key] instanceof Date) {
                        this[key] = changes[key];
                    } else {
                        throw new Error("Provided " + key + " must be {string}. Using: " + (typeof changes[key]))
                    }
                } else if (key === 'note') {
                    if (typeof changes[key] === 'string') {
                        this[key] = changes[key];
                    } else {
                        throw new Error("Provided " + key + " must be {string}. Using: " + (typeof changes[key]))
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

// console.log(AssiSchema);

const Assi = model('Assi', AssiSchema);



module.exports = { Assi };