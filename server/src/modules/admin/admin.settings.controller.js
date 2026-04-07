import { pool } from "../../config/db.js";

export async function getSettings(req, res) {
  const client = await pool.connect();

  try {
    const result = await client.query(`
      select setting_key, setting_value, updated_at
      from public.platform_settings
      order by setting_key asc
    `);

    return res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error("getSettings error:", error);
    return res.status(400).json({
      success: false,
      message: "Failed to fetch settings"
    });
  } finally {
    client.release();
  }
}

export async function updateSettings(req, res) {
  const client = await pool.connect();

  try {
    const { key, value } = req.body;

    if (!key) {
      return res.status(400).json({
        success: false,
        message: "Setting key is required"
      });
    }

    await client.query(
      `
      insert into public.platform_settings (setting_key, setting_value, updated_at)
      values ($1, $2, now())
      on conflict (setting_key)
      do update set
        setting_value = excluded.setting_value,
        updated_at = now()
      `,
      [key, value ?? {}]
    );

    return res.json({
      success: true,
      message: "Setting updated successfully"
    });
  } catch (error) {
    console.error("updateSettings error:", error);
    return res.status(400).json({
      success: false,
      message: "Failed to update setting"
    });
  } finally {
    client.release();
  }
}

export async function getAiLimits(req, res) {
  const client = await pool.connect();

  try {
    const result = await client.query(`
      select * from public.ai_limits
      limit 1
    `);

    return res.json({
      success: true,
      data: result.rows[0] || null
    });
  } catch (error) {
    console.error("getAiLimits error:", error);
    return res.status(400).json({
      success: false,
      message: "Failed to fetch AI limits"
    });
  } finally {
    client.release();
  }
}

export async function updateAiLimits(req, res) {
  const client = await pool.connect();

  try {
    const { images_per_day, videos_per_day, tokens_limit } = req.body;

    await client.query(`
      update public.ai_limits
      set
        images_per_day = $1,
        videos_per_day = $2,
        tokens_limit = $3
    `, [
      Number(images_per_day || 0),
      Number(videos_per_day || 0),
      Number(tokens_limit || 0)
    ]);

    return res.json({
      success: true,
      message: "AI limits updated successfully"
    });
  } catch (error) {
    console.error("updateAiLimits error:", error);
    return res.status(400).json({
      success: false,
      message: "Failed to update AI limits"
    });
  } finally {
    client.release();
  }
}

export async function getBlockedWords(req, res) {
  const client = await pool.connect();

  try {
    const result = await client.query(`
      select *
      from public.blocked_words
      order by created_at desc
    `);

    return res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error("getBlockedWords error:", error);
    return res.status(400).json({
      success: false,
      message: "Failed to fetch blocked words"
    });
  } finally {
    client.release();
  }
}

export async function addBlockedWord(req, res) {
  const client = await pool.connect();

  try {
    const { word } = req.body;

    if (!word?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Word is required"
      });
    }

    await client.query(`
      insert into public.blocked_words (word)
      values ($1)
      on conflict (word) do nothing
    `, [word.trim().toLowerCase()]);

    return res.json({
      success: true,
      message: "Blocked word added successfully"
    });
  } catch (error) {
    console.error("addBlockedWord error:", error);
    return res.status(400).json({
      success: false,
      message: "Failed to add blocked word"
    });
  } finally {
    client.release();
  }
}

export async function deleteBlockedWord(req, res) {
  const client = await pool.connect();

  try {
    await client.query(`
      delete from public.blocked_words
      where id = $1
    `, [req.params.id]);

    return res.json({
      success: true,
      message: "Blocked word removed successfully"
    });
  } catch (error) {
    console.error("deleteBlockedWord error:", error);
    return res.status(400).json({
      success: false,
      message: "Failed to delete blocked word"
    });
  } finally {
    client.release();
  }
}