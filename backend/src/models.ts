import {INTEGER, STRING} from "sequelize";
import * as Sequelize from "sequelize";

// Connect to the database.
const sequelize = new Sequelize("", "", "");

// NOTE: this is just a hack to get type inference in VS code so I can be
// lazy and autocomplete field names :P
function column(config: Sequelize.DefineAttributeColumnOptions): Sequelize.DefineAttributeColumnOptions {
    return config;
}

export const Users = sequelize.define("user", {
    // users.id
    id: column({
        type: INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    }),

    // users.name
    name: column({
        type: STRING,
    }),

    // users.handle
    handle: column({
        type: STRING,
        allowNull: false,
    }),

    // users.pass_hash
    pass_hash: column({
        type: STRING,
        allowNull: false,
    }),

    // users.pass_salt
    pass_salt: column({
        type: STRING,
        allowNull: false,
    }),
});

export const Models = sequelize.define("models", {
    // models.id
    id: column({
        type: INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    }),

    // models.name
    name: column({
        type: STRING,
        allowNull: false,
    }),

    // models.owner (foreign key to users.id)
    owner: column({
        type: INTEGER,
        allowNull: false,
    }),

    // models.parent (refers to models.id of parent, or NULL if no parent)
    parent: column({
        type: INTEGER,
    }),
});

export const Stars = sequelize.define("stars", {
    // stars.user (foreign key to users.id)
    user: column({
        type: INTEGER,
        allowNull: false,
    }),

    // stars.model (foreign key to models.id)
    model: column({
        type: INTEGER,
        allowNull: false,
    }),
});
