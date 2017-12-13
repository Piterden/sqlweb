/**
 * Project: SqlJs - https://github.com/ujjwalguptaofficial/sqljs
 * Author: Ujjwal Gupta
 * License: MIT
 */ 
var SqlJs;
(function (SqlJs) {
    var Errors;
    (function (Errors) {
        Errors["JsStoreUndefined"] = "Jstore_undefined";
        Errors["UndefinedCon"] = "undefined_connection";
        Errors["Undefined"] = "undefined";
    })(Errors = SqlJs.Errors || (SqlJs.Errors = {}));
    var Error = /** @class */ (function () {
        function Error(type, info) {
            if (info === void 0) { info = null; }
            this.throw = function () {
                throw this.get();
            };
            this.print = function (isWarn) {
                if (isWarn === void 0) { isWarn = false; }
                var error_obj = this.get();
                if (isWarn) {
                    console.warn(error_obj);
                }
                else {
                    console.error(error_obj);
                }
            };
            this.get = function () {
                var error_obj = {
                    _type: this._type,
                    _message: this._message
                };
                switch (this._type) {
                    case Errors.UndefinedCon:
                        error_obj._message = "jsstore connection is not defined";
                        break;
                    case Errors.JsStoreUndefined:
                        error_obj._message = "jsstore is not defined";
                        break;
                    default:
                        error_obj._message = 'the error type is not defined';
                        break;
                }
                return error_obj;
            };
            this._type = type;
            this._info = info;
        }
        return Error;
    }());
    SqlJs.Error = Error;
})(SqlJs || (SqlJs = {}));
var SqlJs;
(function (SqlJs) {
    var Query = /** @class */ (function () {
        function Query(qry) {
            this._maps = [];
            this.getMappedValues = function (keys) {
                var mapped_value = [];
                this._maps.forEach(function (element) {
                    if (keys.indexOf(element._key) >= 0) {
                        mapped_value.push(element);
                    }
                });
                return mapped_value;
            };
            this.getMappedKeys = function () {
                var keys = [];
                this._splittedQry.forEach(function (element) {
                    if (element.indexOf('@') >= 0) {
                        keys.push(element);
                    }
                });
                return keys;
            };
            this.getMapValue = function (key) {
                if (key.indexOf("@") >= 0) {
                    var is_value_exist = false;
                    for (var i = 0, length = this._maps.length; i < length; i++) {
                        if (this._maps[i]._key === key) {
                            is_value_exist = true;
                            return this._maps[i]._value;
                        }
                    }
                    if (is_value_exist === false) {
                        console.error('key does not have any value');
                    }
                }
                else {
                    return key;
                }
            };
            this.map = function (key, value) {
                this._maps.push(new SqlJs.Model.Map(key, value));
            };
            this.getWords = function () {
                return this._stringQry.replace("(", " ( ").replace(/  +/g, ' ').replace(/[=]/g, " ").split(" ");
                // .replace("=", " ").replace("("," ")
            };
            this._stringQry = qry.toLowerCase();
            this._splittedQry = this.getWords();
            this._api = this._splittedQry[0];
        }
        return Query;
    }());
    SqlJs.Query = Query;
})(SqlJs || (SqlJs = {}));
var SqlJs;
(function (SqlJs) {
    var Column = /** @class */ (function () {
        function Column(qry) {
            this._index_for_loop = 0;
            this.getKeyWordsValue = function () {
                var keywords_value = [
                    { value: 'PrimaryKey', rules: 'true' },
                    { value: 'PrimaryKey', rules: 'true' },
                    { value: 'PrimaryKey', rules: 'true' },
                    { value: 'NotNull', rules: 'true' },
                    { value: 'NotNull', rules: 'true' },
                    { value: 'AutoIncrement', rules: 'true' },
                    { value: 'Unique', rules: 'true' },
                    { value: 'Default', rules: 'next' },
                    { value: 'string', rules: 'true' },
                    { value: 'boolean', rules: 'true' },
                    { value: 'object', rules: 'true' },
                    { value: 'number', rules: 'true' }
                ];
                return keywords_value;
            };
            this.getQuery = function () {
                var query = {
                    // Name: this._query._splittedQry[this._index_for_loop++]
                    Name: this.getName()
                };
                var keywords = ['primary key', 'pk', 'primarykey', 'not null', 'notnull',
                    'autoincrement', 'unique', 'default', 'string', 'boolean', 'object', 'number'];
                for (var i = this._index_for_loop, length = this._query._splittedQry.length; i < length;) {
                    var index_of_keywords = keywords.indexOf(this._query._splittedQry[i]);
                    if (index_of_keywords >= 0) {
                        var keywords_value = this.getKeyWordsValue();
                        this._index_for_loop = i;
                        query[keywords_value[index_of_keywords].value] =
                            this.getValue(keywords_value[index_of_keywords].rules);
                        i = this._index_for_loop;
                    }
                    i++;
                }
                var data_type = ['string', 'boolean', 'object', 'number'];
                for (var prop in query) {
                    if (data_type.indexOf(prop) >= 0) {
                        query['DataType'] = prop;
                    }
                }
                return query;
            };
            this.getValue = function (rule) {
                switch (rule) {
                    case 'next':
                        var value = this._query._splittedQry[++this._index_for_loop];
                        return (this._query.getMapValue(value));
                    case 'true':
                        return true;
                    default:
                }
            };
            this._query = qry;
        }
        Column.prototype.getName = function () {
            return this._query._splittedQry[this._index_for_loop + 1].indexOf('@') >= 0 ?
                this._query.getMapValue(this._query._splittedQry[++this._index_for_loop]) :
                this._query._splittedQry[this._index_for_loop];
            // var value = this._query._splittedQry[this._index_for_loop];
            // return value === 'name' ? 
            // this._query.getMapValue(this._query._splittedQry[++this._index_for_loop]) : value;
        };
        return Column;
    }());
    SqlJs.Column = Column;
})(SqlJs || (SqlJs = {}));
var SqlJs;
(function (SqlJs) {
    var Create = /** @class */ (function () {
        function Create(qry) {
            this._index_for_loop = 0;
            this.getDb = function () {
                var queries = this._query._stringQry.split(";");
                var database, tables = [];
                queries.forEach(function (item) {
                    if (item.length > 0) {
                        var query = new SqlJs.Query(item);
                        var keys = query.getMappedKeys();
                        if (keys.length > 0) {
                            var values = this._query.getMappedValues(keys);
                            if (values.length === keys.length) {
                                values.forEach(function (value) {
                                    query.map(value._key, value._value);
                                });
                            }
                        }
                        if (query._stringQry.indexOf('table') >= 0) {
                            tables.push(new Create(query).getQuery());
                        }
                        else {
                            database = new Create(query).getQuery();
                        }
                    }
                }, this);
                database.Tables = tables;
                console.log(database);
                return database;
            };
            this.getKeyWordsValue = function () {
                var keywords_value = [
                    { value: 'Name', rules: 'getName' },
                    { value: 'Name', rules: 'getName' },
                    { value: 'Columns', rules: 'getColumns' }
                ];
                return keywords_value;
            };
            this.getIndexofColumnQuery = function () {
                var index = 0;
                for (var j = this._index_for_loop, length = this._query._stringQry.length; (j > 0 && index < length); index++) {
                    if (this._query._stringQry[index] === " ") {
                        j--;
                    }
                }
                return index;
            };
            this.getColumns = function () {
                var column_query = this._query._stringQry.substr(this.getIndexofColumnQuery()).
                    replace(/[()]/g, '').split(','), columns = [];
                column_query.forEach(function (item) {
                    if (item.length > 0) {
                        var query = new SqlJs.Query(item);
                        columns.push(new SqlJs.Column(query).getQuery());
                    }
                });
                return columns;
            };
            this.getValue = function (rule) {
                switch (rule) {
                    case 'getName':
                        return this.getName();
                    case 'next':
                        var value = this._query._splittedQry[++this._index_for_loop];
                        return (this._query.getMapValue(value));
                    case 'getColumns':
                        var value = this.getColumns();
                        this._index_for_loop = this._query._splittedQry.length;
                        return value;
                    default:
                }
            };
            this.getQuery = function () {
                var query = {};
                var keywords = ['database', 'table', '('];
                for (var i = this._index_for_loop, length = this._query._splittedQry.length; i < length;) {
                    var index_of_keywords = keywords.indexOf(this._query._splittedQry[i]);
                    if (index_of_keywords >= 0) {
                        var keywords_value = this.getKeyWordsValue();
                        this._index_for_loop = i;
                        query[keywords_value[index_of_keywords].value] =
                            this.getValue(keywords_value[index_of_keywords].rules);
                        i = this._index_for_loop;
                    }
                    i++;
                }
                return query;
            };
            this._query = qry;
        }
        Create.prototype.getName = function () {
            var value = this._query._splittedQry[++this._index_for_loop];
            return this._query._splittedQry[this._index_for_loop + 1].indexOf('@') >= 0 ?
                this._query.getMapValue(this._query._splittedQry[++this._index_for_loop]) : value;
            // this._query._splittedQry[this._index_for_loop];
            // return value === 'name' ?
            // this._query.getMapValue(this._query._splittedQry[++this._index_for_loop]) : value;
        };
        return Create;
    }());
    SqlJs.Create = Create;
})(SqlJs || (SqlJs = {}));
var SqlJs;
(function (SqlJs) {
    var Insert = /** @class */ (function () {
        function Insert(qry) {
            this._index_for_loop = 0;
            this.getKeyWordsValue = function () {
                var keywords_value = [
                    { value: 'Into', rules: 'next' },
                    { value: 'Values', rules: 'next' },
                    { value: 'SkipDataCheck', rules: 'true' },
                    { value: 'Return', rules: 'true' }
                ];
                return keywords_value;
            };
            this.getQuery = function () {
                var query = {};
                var keywords = ['into', 'values', 'skipdatacheck', 'return'];
                for (var i = this._index_for_loop, length = this._query._splittedQry.length; i < length;) {
                    var index_of_keywords = keywords.indexOf(this._query._splittedQry[i]);
                    if (index_of_keywords >= 0) {
                        var keywords_value = this.getKeyWordsValue();
                        this._index_for_loop = i;
                        query[keywords_value[index_of_keywords].value] =
                            this.getValue(keywords_value[index_of_keywords].rules);
                        i = this._index_for_loop;
                    }
                    i++;
                }
                return query;
            };
            this.getValue = function (rule) {
                switch (rule) {
                    case 'next':
                        var value = this._query._splittedQry[++this._index_for_loop];
                        return (this._query.getMapValue(value));
                    case 'true':
                        return true;
                    default:
                }
            };
            this._query = qry;
        }
        return Insert;
    }());
    SqlJs.Insert = Insert;
})(SqlJs || (SqlJs = {}));
var SqlJs;
(function (SqlJs) {
    var Select = /** @class */ (function () {
        function Select(msg) {
            // ss
        }
        return Select;
    }());
    SqlJs.Select = Select;
})(SqlJs || (SqlJs = {}));
var SqlJs;
(function (SqlJs) {
    var Instance = /** @class */ (function () {
        function Instance() {
            this._isDbOpened = false;
            this.run = function (qry, onSuccess, onError) {
                var jsstore_query = null;
                switch (qry._api) {
                    case 'insert':
                        jsstore_query = new SqlJs.Insert(qry).getQuery();
                        break;
                    case 'create':
                        var db_1 = new SqlJs.Create(qry).getDb();
                        console.log(db_1);
                        JsStore.isDbExist(db_1.Name, function (isExist) {
                            if (isExist) {
                                this._connection.openDb(db_1.Name);
                            }
                            else {
                                this._connection.createDb(db_1.Name);
                            }
                        }, function (err) {
                            throw err;
                        });
                }
                if (jsstore_query !== null) {
                    this._connection[qry._api](jsstore_query, onSuccess, onError);
                }
                console.log(jsstore_query);
                // this._connection[this._api](jsstore_query, onSuccess, onError);
            };
            if (typeof JsStore === "undefined") {
                new SqlJs.Error(SqlJs.Errors.JsStoreUndefined).throw();
            }
            else {
                this._connection = new JsStore.Instance();
                // if (dbSchemaQry) {
                //     this._connection = new JsStore.Instance();
                //     const dbSchema = this.getDbSchema(dbSchemaQry);
                // }
                // else {
                //     new Error(Errors.UndefinedCon).throw();
                // }
            }
        }
        return Instance;
    }());
    SqlJs.Instance = Instance;
})(SqlJs || (SqlJs = {}));
var SqlJs;
(function (SqlJs) {
    var Model;
    (function (Model) {
        var Map = /** @class */ (function () {
            function Map(key, value) {
                this._key = key.toLowerCase();
                this._value = value;
            }
            return Map;
        }());
        Model.Map = Map;
    })(Model = SqlJs.Model || (SqlJs.Model = {}));
})(SqlJs || (SqlJs = {}));
//# sourceMappingURL=sqljs.js.map