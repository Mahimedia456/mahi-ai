import bcrypt from "bcryptjs";
import { pool } from "../../config/db.js";
import { generateOtp, otpExpiry } from "../../utils/otp.js";
import { signAccessToken, signRefreshToken } from "../../utils/jwt.js";
import { sendMail } from "../../config/mailer.js";
import { otpEmailTemplate } from "../../utils/emailTemplates.js";

export async function registerUser({ fullName, email, password }) {
  const client = await pool.connect();

  try {
    const existing = await client.query(
      `select id from public.users where lower(email) = lower($1) limit 1`,
      [email]
    );

    if (existing.rows.length > 0) {
      throw new Error("Email already registered");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const userResult = await client.query(
      `
      insert into public.users (
        full_name,
        email,
        password_hash,
        role,
        status
      )
      values ($1, $2, $3, 'user', 'pending')
      returning id, full_name, email, role, status
      `,
      [fullName, email.toLowerCase(), passwordHash]
    );

    const user = userResult.rows[0];

    await client.query(
      `
      insert into public.usage_wallets (
        user_id,
        chat_credits_remaining,
        image_credits_remaining,
        video_credits_remaining,
        storage_used_mb
      )
      values ($1, 0, 0, 0, 0)
      `,
      [user.id]
    );

    const code = generateOtp();

    await client.query(
      `
      insert into public.otp_verifications (
        user_id,
        email,
        code,
        type,
        expires_at
      )
      values ($1, $2, $3, 'register', $4)
      `,
      [user.id, email.toLowerCase(), code, otpExpiry(10)]
    );

    await sendMail({
      to: email.toLowerCase(),
      subject: "Mahi AI Verification Code",
      html: otpEmailTemplate({
        name: fullName,
        code,
        title: "Verify your account",
        subtitle: "Use the verification code below to activate your Mahi AI account."
      })
    });

    return { user, code };
  } finally {
    client.release();
  }
}

export async function verifyRegisterOtp({ email, code }) {
  const client = await pool.connect();

  try {
    const otpResult = await client.query(
      `
      select *
      from public.otp_verifications
      where lower(email) = lower($1)
        and code = $2
        and type = 'register'
        and verified_at is null
      order by created_at desc
      limit 1
      `,
      [email, code]
    );

    if (otpResult.rows.length === 0) {
      throw new Error("Invalid OTP");
    }

    const otp = otpResult.rows[0];

    if (new Date(otp.expires_at) < new Date()) {
      throw new Error("OTP expired");
    }

    await client.query(
      `update public.otp_verifications set verified_at = now() where id = $1`,
      [otp.id]
    );

    const userResult = await client.query(
      `
      update public.users
      set status = 'active', email_verified_at = now()
      where id = $1
      returning id, full_name, email, role, status
      `,
      [otp.user_id]
    );

    const user = userResult.rows[0];

    const starterPlanResult = await client.query(
      `
      select id, chat_messages_limit, image_generations_limit, video_generations_limit
      from public.plans
      where slug = 'starter'
      limit 1
      `
    );

    if (starterPlanResult.rows.length > 0) {
      const starter = starterPlanResult.rows[0];

      const activeSub = await client.query(
        `select id from public.subscriptions where user_id = $1 and status = 'active' limit 1`,
        [user.id]
      );

      if (activeSub.rows.length === 0) {
        await client.query(
          `
          insert into public.subscriptions (
            user_id, plan_id, billing_cycle, status, start_date, auto_renew
          )
          values ($1, $2, 'monthly', 'active', now(), false)
          `,
          [user.id, starter.id]
        );
      }

      await client.query(
        `
        update public.usage_wallets
        set
          chat_credits_remaining = $2,
          image_credits_remaining = $3,
          video_credits_remaining = $4
        where user_id = $1
        `,
        [
          user.id,
          starter.chat_messages_limit,
          starter.image_generations_limit,
          starter.video_generations_limit
        ]
      );
    }

    return user;
  } finally {
    client.release();
  }
}

export async function loginUser({ email, password }) {
  const client = await pool.connect();

  try {
    const userResult = await client.query(
      `
      select id, full_name, email, password_hash, role, status
      from public.users
      where lower(email) = lower($1)
      limit 1
      `,
      [email]
    );

    if (userResult.rows.length === 0) {
      throw new Error("Invalid email or password");
    }

    const user = userResult.rows[0];

    if (user.status !== "active") {
      throw new Error("Account is not active");
    }

    const matched = await bcrypt.compare(password, user.password_hash);

    if (!matched) {
      throw new Error("Invalid email or password");
    }

    await client.query(
      `update public.users set last_login_at = now() where id = $1`,
      [user.id]
    );

    const safeUser = {
      id: user.id,
      fullName: user.full_name,
      email: user.email,
      role: user.role
    };

    const accessToken = signAccessToken(safeUser);
    const refreshToken = signRefreshToken(safeUser);

    return { user: safeUser, accessToken, refreshToken };
  } finally {
    client.release();
  }
}

export async function getMe(userId) {
  const client = await pool.connect();

  try {
    const userResult = await client.query(
      `
      select
        u.id,
        u.full_name,
        u.email,
        u.role,
        u.status,
        u.avatar_url,
        u.email_verified_at,
        u.last_login_at,
        uw.chat_credits_remaining,
        uw.image_credits_remaining,
        uw.video_credits_remaining,
        uw.storage_used_mb
      from public.users u
      left join public.usage_wallets uw on uw.user_id = u.id
      where u.id = $1
      limit 1
      `,
      [userId]
    );

    const subResult = await client.query(
      `
      select
        s.id,
        s.status,
        s.billing_cycle,
        s.start_date,
        s.end_date,
        p.id as plan_id,
        p.name as plan_name,
        p.slug as plan_slug
      from public.subscriptions s
      join public.plans p on p.id = s.plan_id
      where s.user_id = $1
      order by s.created_at desc
      limit 1
      `,
      [userId]
    );

    return {
      ...userResult.rows[0],
      subscription: subResult.rows[0] || null
    };
  } finally {
    client.release();
  }
}

export async function forgotPassword({ email }) {
  const client = await pool.connect();

  try {
    const userResult = await client.query(
      `
      select id, full_name, email
      from public.users
      where lower(email) = lower($1)
      limit 1
      `,
      [email]
    );

    if (userResult.rows.length === 0) {
      throw new Error("No account found with this email");
    }

    const user = userResult.rows[0];
    const code = generateOtp();

    await client.query(
      `
      insert into public.otp_verifications (
        user_id,
        email,
        code,
        type,
        expires_at
      )
      values ($1, $2, $3, 'forgot_password', $4)
      `,
      [user.id, user.email, code, otpExpiry(10)]
    );

    await sendMail({
      to: user.email,
      subject: "Mahi AI Reset Password Code",
      html: otpEmailTemplate({
        name: user.full_name,
        code,
        title: "Reset your password",
        subtitle: "Use the code below to verify your password reset request."
      })
    });

    return { email: user.email, code };
  } finally {
    client.release();
  }
}

export async function verifyForgotOtp({ email, code }) {
  const client = await pool.connect();

  try {
    const otpResult = await client.query(
      `
      select *
      from public.otp_verifications
      where lower(email) = lower($1)
        and code = $2
        and type = 'forgot_password'
        and verified_at is null
      order by created_at desc
      limit 1
      `,
      [email, code]
    );

    if (otpResult.rows.length === 0) {
      throw new Error("Invalid OTP");
    }

    const otp = otpResult.rows[0];

    if (new Date(otp.expires_at) < new Date()) {
      throw new Error("OTP expired");
    }

    await client.query(
      `update public.otp_verifications set verified_at = now() where id = $1`,
      [otp.id]
    );

    return { email };
  } finally {
    client.release();
  }
}

export async function resetPassword({ email, password }) {
  const client = await pool.connect();

  try {
    const verifiedOtp = await client.query(
      `
      select id, user_id
      from public.otp_verifications
      where lower(email) = lower($1)
        and type = 'forgot_password'
        and verified_at is not null
      order by created_at desc
      limit 1
      `,
      [email]
    );

    if (verifiedOtp.rows.length === 0) {
      throw new Error("Verification required before reset");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await client.query(
      `
      update public.users
      set password_hash = $2
      where id = $1
      `,
      [verifiedOtp.rows[0].user_id, passwordHash]
    );

    return { email };
  } finally {
    client.release();
  }
}