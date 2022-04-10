const { Pool } = require("pg");

const pool = new Pool({
  user: "labber",
  password: "123",
  host: "localhost",
  database: "foodie",
});

const getAllMenuItems = () => {
  // 1
  const queryParams = [];
  // 2
  let queryString = `
  SELECT *
  FROM menu_items
  `;

  return pool.query(queryString, queryParams).then((res) => res.rows);

  /* placeholder
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `WHERE city LIKE $${queryParams.length} `;
  }

  // 4
  queryParams.push(limit);
  queryString += `
  GROUP BY properties.id
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  // 5
  console.log(queryString, queryParams);

  // 6
  */
};

exports.getAllMenuItems = getAllMenuItems;
