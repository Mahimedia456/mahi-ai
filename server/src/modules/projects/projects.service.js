import { pool } from "../../config/db.js";

export async function listProjectsService({ userId }) {

  const result = await pool.query(
    `
    select *
    from projects
    where owner_user_id = $1
    order by created_at desc
  `,
    [userId]
  );

  return result.rows;
}

export async function createProjectService({ userId, name }) {

  const result = await pool.query(
    `
    insert into projects (
      owner_user_id,
      name
    )
    values ($1,$2)
    returning *
  `,
    [userId, name]
  );

  return result.rows[0];
}