export function otpEmailTemplate({ name = "User", code, title, subtitle }) {
  return `
    <div style="margin:0;padding:0;background:#0b0b0b;font-family:Arial,sans-serif;color:#fff;">
      <div style="max-width:560px;margin:0 auto;padding:40px 20px;">
        <div style="background:#131313;border:1px solid rgba(83,245,231,0.18);border-radius:24px;padding:32px;">
          <div style="font-size:28px;font-weight:800;letter-spacing:0.04em;color:#53f5e7;margin-bottom:12px;">Mahi AI</div>
          <div style="font-size:22px;font-weight:700;margin-bottom:10px;">${title}</div>
          <div style="font-size:14px;line-height:1.7;color:#b9b9b9;margin-bottom:28px;">
            Hi ${name},<br/>${subtitle}
          </div>

          <div style="text-align:center;margin:28px 0;">
            <div style="display:inline-block;background:#0f1d1c;border:1px solid rgba(83,245,231,0.25);border-radius:18px;padding:18px 28px;font-size:32px;font-weight:800;letter-spacing:0.45em;color:#53f5e7;">
              ${code}
            </div>
          </div>

          <div style="font-size:13px;line-height:1.7;color:#9a9a9a;margin-top:22px;">
            This code expires in 10 minutes.<br/>
            If you did not request this, please ignore this email.
          </div>
        </div>
      </div>
    </div>
  `;
}