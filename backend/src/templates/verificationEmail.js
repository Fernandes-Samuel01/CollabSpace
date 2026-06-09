export const verificationEmailTemplate = ({ name, code }) => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Verify your email</title>
  </head>
  <body style="margin:0;padding:0;background:#f4f6f8;font-family:Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
      <tr>
        <td align="center">
          <table width="480" cellpadding="0" cellspacing="0"
                 style="background:#ffffff;border-radius:12px;padding:32px;box-shadow:0 2px 8px rgba(0,0,0,0.05);">
            <tr>
              <td>
                <h1 style="margin:0 0 12px;color:#111;font-size:22px;">Welcome to CollabSpace 👋</h1>
                <p style="color:#444;font-size:15px;line-height:1.5;">
                  Hi <strong>${name}</strong>, thanks for signing up. Please use the verification code below to activate your account.
                </p>

                <div style="margin:28px 0;text-align:center;">
                  <span style="display:inline-block;font-size:32px;letter-spacing:8px;
                               font-weight:bold;color:#4f46e5;background:#eef2ff;
                               padding:14px 24px;border-radius:10px;">
                    ${code}
                  </span>
                </div>

                <p style="color:#666;font-size:13px;line-height:1.5;">
                  This code will expire in <strong>10 minutes</strong>. If you didn't create an account, you can safely ignore this email.
                </p>

                <hr style="border:none;border-top:1px solid #eee;margin:28px 0;" />
                <p style="color:#999;font-size:12px;text-align:center;">
                  © ${new Date().getFullYear()} CollabSpace
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;