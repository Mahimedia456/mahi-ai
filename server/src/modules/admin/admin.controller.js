import bcrypt from "bcryptjs";
import { pool } from "../../config/db.js";
import { successResponse, errorResponse } from "../../utils/response.js";

export async function getOverview(req, res) {
  const client = await pool.connect();

  try {
    const [
      usersRes,
      activeUsersRes,
      suspendedUsersRes,
      plansRes,
      jobsRes,
      conversationsRes,
      proEnterpriseRes
    ] = await Promise.all([
      client.query(`select count(*)::int as total from public.users`),
      client.query(`select count(*)::int as total from public.users where status = 'active'`),
      client.query(`select count(*)::int as total from public.users where status = 'suspended'`),
      client.query(`select count(*)::int as total from public.plans where is_active = true`),
      client.query(`select count(*)::int as total from public.ai_jobs`),
      client.query(`select count(*)::int as total from public.conversations`),
      client.query(`
        select count(distinct s.user_id)::int as total
        from public.subscriptions s
        join public.plans p on p.id = s.plan_id
        where s.status = 'active'
          and lower(p.slug) in ('pro', 'enterprise')
      `)
    ]);

    return successResponse(res, "Admin overview fetched successfully", {
      stats: {
        totalUsers: usersRes.rows[0]?.total || 0,
        activeUsers: activeUsersRes.rows[0]?.total || 0,
        suspendedUsers: suspendedUsersRes.rows[0]?.total || 0,
        activePlans: plansRes.rows[0]?.total || 0,
        totalJobs: jobsRes.rows[0]?.total || 0,
        totalConversations: conversationsRes.rows[0]?.total || 0,
        proEnterpriseUsers: proEnterpriseRes.rows[0]?.total || 0
      }
    });
  } catch (error) {
    return errorResponse(res, error.message, 400);
  } finally {
    client.release();
  }
}

export async function getUsers(req, res) {
  const client = await pool.connect();

  try {
    const search = (req.query.search || "").trim().toLowerCase();
    const status = (req.query.status || "").trim().toLowerCase();

    const values = [];
    const conditions = [];

    if (search) {
      values.push(`%${search}%`);
      const idx = values.length;
      conditions.push(`(
        lower(u.full_name) like $${idx}
        or lower(u.email) like $${idx}
        or lower(coalesce(p.name, '')) like $${idx}
      )`);
    }

    if (status) {
      values.push(status);
      conditions.push(`u.status = $${values.length}`);
    }

    const whereClause = conditions.length ? `where ${conditions.join(" and ")}` : "";

    const result = await client.query(
      `
      select
        u.id,
        u.full_name as name,
        u.email,
        u.role,
        u.status,
        u.country,
        u.date_of_birth,
        u.notes,
        u.created_at,
        u.last_login_at,
        coalesce(p.name, 'No Plan') as plan,
        coalesce(uw.chat_credits_remaining, 0) as chat_credits_remaining,
        coalesce(uw.image_credits_remaining, 0) as image_credits_remaining,
        coalesce(uw.video_credits_remaining, 0) as video_credits_remaining
      from public.users u
      left join public.usage_wallets uw on uw.user_id = u.id
      left join lateral (
        select p.name
        from public.subscriptions s
        join public.plans p on p.id = s.plan_id
        where s.user_id = u.id
        order by s.created_at desc
        limit 1
      ) p on true
      ${whereClause}
      order by u.created_at desc
      `,
      values
    );

    return successResponse(res, "Users fetched successfully", {
      users: result.rows
    });
  } catch (error) {
    return errorResponse(res, error.message, 400);
  } finally {
    client.release();
  }
}

export async function getUserById(req, res) {
  const client = await pool.connect();

  try {
    const { id } = req.params;

    const userRes = await client.query(
      `
      select
        u.id,
        u.full_name as name,
        u.email,
        u.role,
        u.status,
        u.country,
        u.date_of_birth,
        u.notes,
        u.avatar_url,
        u.email_verified_at,
        u.last_login_at,
        u.created_at,
        u.updated_at,
        coalesce(uw.chat_credits_remaining, 0) as chat_credits_remaining,
        coalesce(uw.image_credits_remaining, 0) as image_credits_remaining,
        coalesce(uw.video_credits_remaining, 0) as video_credits_remaining,
        coalesce(uw.storage_used_mb, 0) as storage_used_mb
      from public.users u
      left join public.usage_wallets uw on uw.user_id = u.id
      where u.id = $1
      limit 1
      `,
      [id]
    );

    if (!userRes.rows.length) {
      return errorResponse(res, "User not found", 404);
    }

    const subscriptionRes = await client.query(
      `
      select
        s.id,
        s.status,
        s.billing_cycle,
        s.start_date,
        s.end_date,
        p.name as plan_name,
        p.slug as plan_slug
      from public.subscriptions s
      join public.plans p on p.id = s.plan_id
      where s.user_id = $1
      order by s.created_at desc
      limit 1
      `,
      [id]
    );

    const billingRes = await client.query(
      `
      select
        id,
        amount,
        currency,
        status,
        provider_reference,
        transaction_type,
        created_at
      from public.payments
      where user_id = $1
      order by created_at desc
      `,
      [id]
    );

    return successResponse(res, "User fetched successfully", {
      user: userRes.rows[0],
      subscription: subscriptionRes.rows[0] || null,
      billingHistory: billingRes.rows
    });
  } catch (error) {
    return errorResponse(res, error.message, 400);
  } finally {
    client.release();
  }
}

export async function createUser(req, res) {
  const client = await pool.connect();

  try {
    const {
      fullName,
      email,
      password,
      role = "user",
      status = "active",
      dateOfBirth = null,
      country = null,
      notes = null,
      planSlug = "starter"
    } = req.body;

    const existing = await client.query(
      `select id from public.users where lower(email) = lower($1) limit 1`,
      [email]
    );

    if (existing.rows.length) {
      return errorResponse(res, "Email already exists", 400);
    }

    const passwordHash = await bcrypt.hash(password || "User@123456", 10);

    const userRes = await client.query(
      `
      insert into public.users (
        full_name, email, password_hash, role, status, email_verified_at, date_of_birth, country, notes
      )
      values ($1, $2, $3, $4, $5, now(), $6, $7, $8)
      returning id, full_name as name, email, role, status, country, date_of_birth, notes, created_at
      `,
      [fullName, email.toLowerCase(), passwordHash, role, status, dateOfBirth, country, notes]
    );

    const user = userRes.rows[0];

    await client.query(
      `
      insert into public.usage_wallets (
        user_id, chat_credits_remaining, image_credits_remaining, video_credits_remaining, storage_used_mb
      )
      values ($1, 0, 0, 0, 0)
      `,
      [user.id]
    );

    const planRes = await client.query(
      `select id, chat_messages_limit, image_generations_limit, video_generations_limit from public.plans where slug = $1 limit 1`,
      [planSlug]
    );

    if (planRes.rows.length) {
      const plan = planRes.rows[0];

      await client.query(
        `
        insert into public.subscriptions (
          user_id, plan_id, billing_cycle, status, start_date, auto_renew
        )
        values ($1, $2, 'monthly', 'active', now(), false)
        `,
        [user.id, plan.id]
      );

      await client.query(
        `
        update public.usage_wallets
        set
          chat_credits_remaining = $2,
          image_credits_remaining = $3,
          video_credits_remaining = $4
        where user_id = $1
        `,
        [user.id, plan.chat_messages_limit, plan.image_generations_limit, plan.video_generations_limit]
      );
    }

    return successResponse(res, "User created successfully", { user }, 201);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  } finally {
    client.release();
  }
}

export async function updateUser(req, res) {
  const client = await pool.connect();

  try {
    const { id } = req.params;
    const { fullName, role, status, dateOfBirth, country, notes, planSlug } = req.body;

    const existing = await client.query(
      `select id from public.users where id = $1 limit 1`,
      [id]
    );

    if (!existing.rows.length) {
      return errorResponse(res, "User not found", 404);
    }

    const userRes = await client.query(
      `
      update public.users
      set
        full_name = coalesce($2, full_name),
        role = coalesce($3, role),
        status = coalesce($4, status),
        date_of_birth = coalesce($5, date_of_birth),
        country = coalesce($6, country),
        notes = coalesce($7, notes),
        updated_at = now()
      where id = $1
      returning
        id,
        full_name as name,
        email,
        role,
        status,
        country,
        date_of_birth,
        notes,
        updated_at
      `,
      [id, fullName || null, role || null, status || null, dateOfBirth || null, country || null, notes || null]
    );

    if (planSlug) {
      const planRes = await client.query(
        `select id, chat_messages_limit, image_generations_limit, video_generations_limit from public.plans where slug = $1 limit 1`,
        [planSlug]
      );

      if (planRes.rows.length) {
        const plan = planRes.rows[0];

        await client.query(
          `delete from public.subscriptions where user_id = $1`,
          [id]
        );

        await client.query(
          `
          insert into public.subscriptions (
            user_id, plan_id, billing_cycle, status, start_date, auto_renew
          )
          values ($1, $2, 'monthly', 'active', now(), false)
          `,
          [id, plan.id]
        );

        await client.query(
          `
          update public.usage_wallets
          set
            chat_credits_remaining = $2,
            image_credits_remaining = $3,
            video_credits_remaining = $4
          where user_id = $1
          `,
          [id, plan.chat_messages_limit, plan.image_generations_limit, plan.video_generations_limit]
        );
      }
    }

    return successResponse(res, "User updated successfully", {
      user: userRes.rows[0]
    });
  } catch (error) {
    return errorResponse(res, error.message, 400);
  } finally {
    client.release();
  }
}

export async function deleteUser(req, res) {
  const client = await pool.connect();

  try {
    const { id } = req.params;
    await client.query(`delete from public.users where id = $1`, [id]);
    return successResponse(res, "User deleted successfully", { deletedUserId: id });
  } catch (error) {
    return errorResponse(res, error.message, 400);
  } finally {
    client.release();
  }
}

export async function getUserActivity(req, res) {
  try {
    const result = await client.query(`
      SELECT
        id,
        'User Activity' as title,
        description,
        created_at as time
      FROM public.user_activity
      ORDER BY created_at DESC
      LIMIT 30
    `);

    return res.json({
      success: true,
      data: {
        activity: result.rows
      }
    });
  } catch (err) {
    console.error("User activity error:", err);
    return res.status(400).json({
      success: false,
      message: "Failed to fetch user activity"
    });
  }
}
export async function getPlans(req, res) {
  const client = await pool.connect();

  try {
    const plans = await client.query(`
      select
        p.id,
        p.name,
        p.slug,
        p.description,
        p.price_monthly,
        p.price_yearly,
        p.credits_monthly,
        p.image_generations_limit,
        p.video_generations_limit,
        p.chat_messages_limit,
        p.max_file_upload_mb,
        p.features_json,
        p.is_active,
        p.sort_order,
        (
          select count(*)::int
          from public.subscriptions s
          where s.plan_id = p.id
            and s.status = 'active'
        ) as subscribers
      from public.plans p
      order by p.sort_order asc, p.created_at asc
    `);

    return successResponse(res, "Plans fetched successfully", {
      plans: plans.rows
    });
  } catch (error) {
    return errorResponse(res, error.message, 400);
  } finally {
    client.release();
  }
}

export async function getPlanById(req, res) {
  const client = await pool.connect();

  try {
    const { id } = req.params;

    const planRes = await client.query(
      `
      select
        p.*,
        (
          select count(*)::int
          from public.subscriptions s
          where s.plan_id = p.id and s.status = 'active'
        ) as subscribers
      from public.plans p
      where p.id = $1
      limit 1
      `,
      [id]
    );

    if (!planRes.rows.length) {
      return errorResponse(res, "Plan not found", 404);
    }

    const subscribersRes = await client.query(
      `
      select
        u.id,
        u.full_name as name,
        u.email,
        u.status
      from public.subscriptions s
      join public.users u on u.id = s.user_id
      where s.plan_id = $1
      order by u.created_at desc
      `,
      [id]
    );

    return successResponse(res, "Plan fetched successfully", {
      plan: planRes.rows[0],
      subscribers: subscribersRes.rows
    });
  } catch (error) {
    return errorResponse(res, error.message, 400);
  } finally {
    client.release();
  }
}

export async function createPlan(req, res) {
  const client = await pool.connect();

  try {
    const {
      name,
      slug,
      description,
      priceMonthly = 0,
      priceYearly = 0,
      creditsMonthly = 0,
      imageGenerationsLimit = 0,
      videoGenerationsLimit = 0,
      chatMessagesLimit = 0,
      maxFileUploadMb = 10,
      featuresJson = [],
      isActive = true,
      sortOrder = 0
    } = req.body;

    const planRes = await client.query(
      `
      insert into public.plans (
        name, slug, description, price_monthly, price_yearly,
        credits_monthly, image_generations_limit, video_generations_limit,
        chat_messages_limit, max_file_upload_mb, features_json, is_active, sort_order
      )
      values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
      returning *
      `,
      [
        name,
        slug,
        description,
        priceMonthly,
        priceYearly,
        creditsMonthly,
        imageGenerationsLimit,
        videoGenerationsLimit,
        chatMessagesLimit,
        maxFileUploadMb,
        JSON.stringify(featuresJson),
        isActive,
        sortOrder
      ]
    );

    return successResponse(res, "Plan created successfully", { plan: planRes.rows[0] }, 201);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  } finally {
    client.release();
  }
}

export async function updatePlan(req, res) {
  const client = await pool.connect();

  try {
    const { id } = req.params;
    const {
      name,
      description,
      priceMonthly,
      priceYearly,
      creditsMonthly,
      imageGenerationsLimit,
      videoGenerationsLimit,
      chatMessagesLimit,
      maxFileUploadMb,
      featuresJson,
      isActive,
      sortOrder
    } = req.body;

    const planRes = await client.query(
      `
      update public.plans
      set
        name = coalesce($2, name),
        description = coalesce($3, description),
        price_monthly = coalesce($4, price_monthly),
        price_yearly = coalesce($5, price_yearly),
        credits_monthly = coalesce($6, credits_monthly),
        image_generations_limit = coalesce($7, image_generations_limit),
        video_generations_limit = coalesce($8, video_generations_limit),
        chat_messages_limit = coalesce($9, chat_messages_limit),
        max_file_upload_mb = coalesce($10, max_file_upload_mb),
        features_json = coalesce($11, features_json),
        is_active = coalesce($12, is_active),
        sort_order = coalesce($13, sort_order),
        updated_at = now()
      where id = $1
      returning *
      `,
      [
        id,
        name ?? null,
        description ?? null,
        priceMonthly ?? null,
        priceYearly ?? null,
        creditsMonthly ?? null,
        imageGenerationsLimit ?? null,
        videoGenerationsLimit ?? null,
        chatMessagesLimit ?? null,
        maxFileUploadMb ?? null,
        featuresJson ? JSON.stringify(featuresJson) : null,
        isActive ?? null,
        sortOrder ?? null
      ]
    );

    return successResponse(res, "Plan updated successfully", { plan: planRes.rows[0] });
  } catch (error) {
    return errorResponse(res, error.message, 400);
  } finally {
    client.release();
  }
}

export async function deletePlan(req, res) {
  const client = await pool.connect();

  try {
    const { id } = req.params;
    await client.query(`delete from public.plans where id = $1`, [id]);
    return successResponse(res, "Plan deleted successfully", { deletedPlanId: id });
  } catch (error) {
    return errorResponse(res, error.message, 400);
  } finally {
    client.release();
  }
}

export async function getTransactions(req, res) {
  const client = await pool.connect();

  try {
    const txRes = await client.query(`
      select
        p.id,
        u.full_name as user_name,
        u.email,
        p.amount,
        p.currency,
        p.status,
        p.provider,
        p.provider_reference,
        p.payment_method,
        p.transaction_type,
        p.created_at
      from public.payments p
      join public.users u on u.id = p.user_id
      where coalesce(p.transaction_type, 'payment') = 'payment'
      order by p.created_at desc
    `);

    return successResponse(res, "Transactions fetched successfully", {
      transactions: txRes.rows
    });
  } catch (error) {
    return errorResponse(res, error.message, 400);
  } finally {
    client.release();
  }
}

export async function getRefunds(req, res) {
  const client = await pool.connect();

  try {
    const refundRes = await client.query(`
      select
        p.id,
        u.full_name as user_name,
        u.email,
        p.amount,
        p.refund_amount,
        p.currency,
        p.status,
        p.refund_reason,
        p.refunded_at,
        p.provider_reference,
        p.created_at
      from public.payments p
      join public.users u on u.id = p.user_id
      where p.refund_amount > 0
         or p.transaction_type = 'refund'
      order by p.created_at desc
    `);

    return successResponse(res, "Refunds fetched successfully", {
      refunds: refundRes.rows
    });
  } catch (error) {
    return errorResponse(res, error.message, 400);
  } finally {
    client.release();
  }
}