import { pool } from "../../config/db.js";
import { successResponse, errorResponse } from "../../utils/response.js";

export async function getDashboard(req, res) {
  const client = await pool.connect();

  try {
    const [subResult, convoCountResult, jobsCountResult, walletResult] = await Promise.all([
      client.query(
        `
        select p.name as plan_name
        from public.subscriptions s
        join public.plans p on p.id = s.plan_id
        where s.user_id = $1
        order by s.created_at desc
        limit 1
        `,
        [req.user.id]
      ),
      client.query(
        `select count(*)::int as total from public.conversations where user_id = $1`,
        [req.user.id]
      ),
      client.query(
        `select count(*)::int as total from public.ai_jobs where user_id = $1`,
        [req.user.id]
      ),
      client.query(
        `
        select
          chat_credits_remaining,
          image_credits_remaining,
          video_credits_remaining
        from public.usage_wallets
        where user_id = $1
        limit 1
        `,
        [req.user.id]
      )
    ]);

    return successResponse(res, "Dashboard fetched successfully", {
      stats: {
        totalConversations: convoCountResult.rows[0]?.total || 0,
        totalJobs: jobsCountResult.rows[0]?.total || 0,
        currentPlan: subResult.rows[0]?.plan_name || "No Plan",
        chatCreditsRemaining: walletResult.rows[0]?.chat_credits_remaining || 0,
        imageCreditsRemaining: walletResult.rows[0]?.image_credits_remaining || 0,
        videoCreditsRemaining: walletResult.rows[0]?.video_credits_remaining || 0
      }
    });
  } catch (error) {
    return errorResponse(res, error.message, 400);
  } finally {
    client.release();
  }
}