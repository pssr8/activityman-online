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


const express = require('express');
const { sensitiveHeaders } = require('http2');
const app = express();
const path = require('path');
const auth = require('./auth');


// settings
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.set('port', process.env.PORT)


// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
auth.useMiddleware(app);
app.use('/', express.static(path.join(__dirname, '../public')))
app.use(require('./middlewares/app-chassis'))

// routes
app.use('/', require('./routes'))


module.exports = app;