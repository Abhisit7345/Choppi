/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function(knex) {
    if(knex.schema.hasTable('users')){
        knex.schema.dropTable('users');
    }

    knex.schema.createTable('users', function(table) {
        table.increments('id').primary();
        table.string('email');
  })

  knex.schema.createTable('profilePicture', function(table){
    table.integer('id').unsigned().references('id').inTable('users');
    table.string('url');
  })
}
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  export const down = function(knex) {
    return knex.schema.dropTableIfExists('users');
  };