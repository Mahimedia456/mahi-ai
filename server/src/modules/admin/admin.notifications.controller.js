import { pool } from "../../config/db.js";

export async function getAdminNotifications(req, res) {
  const client = await pool.connect();

  try {
    const result = await client.query(`
      select *
      from public.admin_notifications
      order by created_at desc
      limit 100
    `);

    return res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error("getAdminNotifications error:", error);
    return res.status(400).json({
      success: false,
      message: "Failed to fetch notifications"
    });
  } finally {
    client.release();
  }
}

export async function markAdminNotificationRead(req, res) {
  const client = await pool.connect();

  try {
    await client.query(`
      update public.admin_notifications
      set is_read = true
      where id = $1
    `, [req.params.id]);

    return res.json({
      success: true,
      message: "Notification marked as read"
    });
  } catch (error) {
    console.error("markAdminNotificationRead error:", error);
    return res.status(400).json({
      success: false,
      message: "Failed to update notification"
    });
  } finally {
    client.release();
  }
}

export async function markAllAdminNotificationsRead(req, res) {
  const client = await pool.connect();

  try {
    await client.query(`
      update public.admin_notifications
      set is_read = true
      where is_read = false
    `);

    return res.json({
      success: true,
      message: "All notifications marked as read"
    });
  } catch (error) {
    console.error("markAllAdminNotificationsRead error:", error);
    return res.status(400).json({
      success: false,
      message: "Failed to update notifications"
    });
  } finally {
    client.release();
  }
}