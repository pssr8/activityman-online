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


module.exports = {
    AllFieldsRequiredByDefautlt(schema) {
        for (var i in schema.paths) {
            var attribute = schema.paths[i]
            if (attribute.isRequired == undefined) {
                attribute.required(true);
            }
        }
    },
    postalCodeS2N(str) { // PostalCode string to number
        try {
            if (str.length == 6) {
                return parseInt(str, 36);
            } else {
                throw new Error('Postal Code must have 6 characters length.')
            }
        } catch (e) {
            throw e;
        }
    },
    postalCodeN2S(num) { // PostalCode number to string 
        return num.toString(36);
    }
}