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


const app = require("./app");

const port = app.get('port');
app.listen(port, () => {
    console.log(`
Activityman-online  Copyright (C) <year>  <name of author>
This program comes with ABSOLUTELY NO WARRANTY; for details type \`npm run show:w'.
This is free software, and you are welcome to redistribute it
under certain conditions; type \`npm run show:c' for details.
`)
    console.log('ActivityMan Online\n\n\tListening on port ' + port + '\n\n')
})