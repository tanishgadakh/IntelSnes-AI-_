import os
import logging
import smtplib
from email.message import EmailMessage
from typing import Optional

from app.core.config import settings

logger = logging.getLogger(__name__)


def _send_email_raw(subject: str, body: str, to: str, html: Optional[str] = None) -> bool:
    if not to:
        logger.debug("No recipient provided for email")
        return False
    msg = EmailMessage()
    if html:
        msg.add_alternative(html, subtype='html')
    else:
        msg.set_content(body)
    msg["Subject"] = subject
    msg["From"] = settings.ALERT_EMAIL_FROM or os.environ.get("ALERT_EMAIL_FROM") or f"no-reply@{settings.APP_NAME.lower().replace(' ', '')}.local"
    msg["To"] = to

    host = os.environ.get("SMTP_HOST") or settings.SMTP_HOST or "localhost"
    port = int(os.environ.get("SMTP_PORT") or settings.SMTP_PORT or 25)
    username = os.environ.get("SMTP_USERNAME") or settings.SMTP_USERNAME
    password = os.environ.get("SMTP_PASSWORD") or settings.SMTP_PASSWORD
    use_tls = os.environ.get("SMTP_USE_TLS", str(settings.SMTP_USE_TLS)).lower() in ("1", "true", "yes")

    try:
        with smtplib.SMTP(host, port, timeout=10) as s:
            if use_tls:
                try:
                    s.starttls()
                except Exception:
                    logger.debug("STARTTLS failed or not supported")
            if username and password:
                s.login(username, password)
            s.send_message(msg)
        return True
    except Exception:
        logger.exception("Failed to send email")
        return False


def send_password_reset(email: str, token: str) -> bool:
    reset_url = f"{settings.APP_URL.rstrip('/')}/reset-password?token={token}"
    subject = f"🔐 {settings.APP_NAME} - Secure Password Verification Link"
    body = f"Password Reset Request\n\nWe received a request to reset your password. Click the link to reset:\n\n{reset_url}\n\nThis link will expire in 5 minutes.\n\nIf you didn't request this, ignore this email and your password will remain unchanged.\n\nFor security, never share this link with anyone."
    
    html = f"""
    <html>
    <head>
        <style>
            body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f7fa; margin: 0; padding: 0; }}
            .container {{ max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow: hidden; }}
            .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; text-align: center; }}
            .header h1 {{ margin: 0; font-size: 28px; font-weight: 600; }}
            .header p {{ margin: 8px 0 0 0; font-size: 14px; opacity: 0.9; }}
            .content {{ padding: 40px; }}
            .content h2 {{ color: #333333; font-size: 22px; margin: 0 0 16px 0; }}
            .message {{ color: #555555; font-size: 15px; line-height: 1.6; margin: 16px 0; }}
            .alert {{ background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 12px 16px; margin: 20px 0; border-radius: 4px; font-size: 13px; color: #856404; }}
            .button-container {{ text-align: center; margin: 32px 0; }}
            .reset-button {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: 600; display: inline-block; transition: transform 0.2s; }}
            .reset-button:hover {{ transform: scale(1.05); }}
            .reset-url {{ background-color: #f8f9fa; padding: 12px; border-radius: 4px; word-break: break-all; font-family: 'Courier New', monospace; font-size: 12px; color: #666666; margin: 16px 0; }}
            .footer {{ background-color: #f5f7fa; padding: 20px; text-align: center; border-top: 1px solid #e0e0e0; font-size: 12px; color: #999999; }}
            .footer p {{ margin: 4px 0; }}
            .security-tips {{ background-color: #e8f4f8; border-left: 4px solid #0288d1; padding: 12px 16px; margin: 20px 0; border-radius: 4px; font-size: 13px; color: #01579b; }}
            .security-tips strong {{ display: block; margin-bottom: 4px; }}
            .timer {{ color: #d32f2f; font-weight: 600; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🔐 Secure Password Reset</h1>
                <p>Protect your {settings.APP_NAME} account</p>
            </div>
            
            <div class="content">
                <h2>Password Reset Requested</h2>
                
                <div class="message">
                    <p>Hello,</p>
                    <p>We received a request to reset the password for your {settings.APP_NAME} account. This is a secure verification link that will allow you to create a new password.</p>
                </div>
                
                <div class="alert">
                    <strong>⏱️ Time-Sensitive:</strong> This link expires in <span class="timer">5 minutes</span>. Act quickly to secure your account.
                </div>
                
                <div class="button-container">
                    <a href="{reset_url}" class="reset-button">Reset Your Password</a>
                </div>
                
                <p style="text-align: center; color: #999999; font-size: 13px; margin: 16px 0;">Or copy and paste this link in your browser:</p>
                <div class="reset-url">{reset_url}</div>
                
                <div class="security-tips">
                    <strong>🛡️ Security Tips:</strong>
                    <ul style="margin: 8px 0; padding-left: 20px;">
                        <li>Never share this link with anyone</li>
                        <li>Make sure you visit this link from a secure device</li>
                        <li>Use a strong password with uppercase, numbers, and special characters</li>
                        <li>If you didn't request this, ignore this email</li>
                    </ul>
                </div>
                
                <div class="message" style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
                    <p style="color: #999999; font-size: 13px;">
                        <strong>Didn't request this?</strong><br>
                        If you didn't request a password reset, your account is safe. Simply ignore this email and your password will remain unchanged. 
                        If you believe your account has been compromised, please contact our support team immediately.
                    </p>
                </div>
            </div>
            
            <div class="footer">
                <p><strong>{settings.APP_NAME}</strong> - Enterprise AI Analytics Platform</p>
                <p>This is an automated security email. Please do not reply to this message.</p>
                <p>© 2026 {settings.APP_NAME}. All rights reserved. | <a href="{settings.APP_URL}" style="color: #0288d1; text-decoration: none;">Visit Platform</a></p>
            </div>
        </div>
    </body>
    </html>
    """
    return _send_email_raw(subject, body, email, html)


def send_otp(email: str, code: str) -> bool:
    """Send OTP code via email for two-factor authentication."""
    subject = f"✓ {settings.APP_NAME} - Your {code} Verification Code"
    body = f"Your One-Time Verification Code: {code}\n\nThis code will expire in 10 minutes.\n\nIf you didn't request this, ignore this email and your account remains secure."
    
    html = f"""
    <html>
    <head>
        <style>
            body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f7fa; margin: 0; padding: 0; }}
            .container {{ max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow: hidden; }}
            .header {{ background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); color: white; padding: 40px 20px; text-align: center; }}
            .header h1 {{ margin: 0; font-size: 28px; font-weight: 600; }}
            .header p {{ margin: 8px 0 0 0; font-size: 14px; opacity: 0.9; }}
            .content {{ padding: 40px; text-align: center; }}
            .message {{ color: #555555; font-size: 15px; line-height: 1.6; margin: 16px 0; }}
            .code-box {{ background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); color: white; padding: 30px; border-radius: 8px; margin: 30px 0; }}
            .code-box .label {{ font-size: 12px; opacity: 0.9; margin-bottom: 8px; }}
            .code-box .code {{ font-size: 42px; font-weight: 700; letter-spacing: 8px; font-family: 'Courier New', monospace; }}
            .timer {{ background-color: #fff3cd; color: #856404; padding: 12px; border-radius: 4px; margin: 20px 0; font-size: 13px; font-weight: 600; }}
            .footer {{ background-color: #f5f7fa; padding: 20px; text-align: center; border-top: 1px solid #e0e0e0; font-size: 12px; color: #999999; }}
            .footer p {{ margin: 4px 0; }}
            .security-note {{ background-color: #e8f4f8; border-left: 4px solid #0288d1; padding: 12px 16px; margin: 20px 0; border-radius: 4px; font-size: 12px; color: #01579b; }}
            .dont-share {{ background-color: #ffe0e0; border-left: 4px solid #d32f2f; padding: 12px 16px; margin: 20px 0; border-radius: 4px; font-size: 12px; color: #b71c1c; font-weight: 600; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>✓ Verify Your Identity</h1>
                <p>Secure Two-Step Authentication</p>
            </div>
            
            <div class="content">
                <div class="message">
                    <p>Your verification code has arrived! Enter this code in the {settings.APP_NAME} platform to complete your secure login.</p>
                </div>
                
                <div class="code-box">
                    <div class="label">YOUR VERIFICATION CODE</div>
                    <div class="code">{code}</div>
                </div>
                
                <div class="timer">
                    ⏱️ This code expires in <strong>10 minutes</strong>
                </div>
                
                <div class="dont-share">
                    🔒 <strong>Never share this code with anyone</strong> - not even {settings.APP_NAME} support staff will ask for it
                </div>
                
                <div class="security-note">
                    <strong>💡 Tip:</strong> You requested this code when logging into your {settings.APP_NAME} account. If this wasn't you, your account is secure. Simply ignore this email.
                </div>
                
                <div class="message" style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 13px;">
                    <p style="color: #999999;">
                        <strong>Didn't request this code?</strong><br>
                        If you're not trying to log in, no action is needed. Your account remains secure.
                    </p>
                </div>
            </div>
            
            <div class="footer">
                <p><strong>{settings.APP_NAME}</strong> - Enterprise AI Analytics Platform</p>
                <p>This is an automated security email. Please do not reply to this message.</p>
                <p>© 2026 {settings.APP_NAME}. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    """
    return _send_email_raw(subject, body, email, html)
