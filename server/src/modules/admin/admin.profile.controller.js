import { pool } from "../../config/db.js";

export async function getAdminProfile(req, res) {
  const client = await pool.connect();

  try {
    const userId = req.user?.id;

    const result = await client.query(`
      select
        id,
        full_name,
        email,
        avatar_url,
        phone,
        role,
        updated_at
      from public.users
      where id = $1
      limit 1
    `, [userId]);

    return res.json({
      success: true,
      data: result.rows[0] || null
    });
  } catch (error) {
    console.error("getAdminProfile error:", error);
    return res.status(400).json({
      success: false,
      message: "Failed to fetch admin profile"
    });
  } finally {
    client.release();
  }
}

export async function updateAdminProfile(req, res) {
  const client = await pool.connect();

  try {
    const userId = req.user?.id;
    const { full_name, phone, avatar_url } = req.body;

    const result = await client.query(`
      update public.users
      set
        full_name = $1,
        phone = $2,
        avatar_url = $3,
        updated_at = now()
      where id = $4
      returning id, full_name, email, avatar_url, phone, role, updated_at
    `, [full_name || "", phone || "", avatar_url || "", userId]);

    return res.json({
      success: true,
      message: "Profile updated successfully",
      data: result.rows[0] || null
    });
  } catch (error) {
    console.error("updateAdminProfile error:", error);
    return res.status(400).json({
      success: false,
      message: "Failed to update admin profile"
    });
  } finally {
    client.release();
  }
}