import os
import logging
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# Configure a basic logger for the mock provider
logger = logging.getLogger("charex.email")
logger.setLevel(logging.INFO)
if not logger.handlers:
    ch = logging.StreamHandler()
    ch.setLevel(logging.INFO)
    formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    ch.setFormatter(formatter)
    logger.addHandler(ch)

EMAIL_PROVIDER = os.getenv("EMAIL_PROVIDER", "mock")
SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SMTP_USERNAME = os.getenv("SMTP_USERNAME", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")

def send_verification_email(to_email: str, otp: str):
    """
    Sends an email with the verification OTP.
    """
    subject = "Verify your email address - Charex"
    body = f"""Charex

Verify your email address

Your verification code is:

{otp}

This code expires in 10 minutes.

If you did not create a Charex account, you can ignore this email.
"""

    if EMAIL_PROVIDER == "mock":
        # Safe logging: do NOT print the OTP to the console, to avoid leaking secrets
        logger.info(f"Verification email requested for <{to_email}>")
        
        # For local dev testing purposes, write the OTP to a .gitignored log file
        # so the developer can actually grab the OTP and test the UI.
        with open("mail.log", "a") as f:
            f.write(f"To: {to_email} | OTP: {otp}\n")
        return

    # Production smtplib flow
    msg = MIMEMultipart()
    msg['From'] = SMTP_USERNAME
    msg['To'] = to_email
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'plain'))

    try:
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(SMTP_USERNAME, SMTP_PASSWORD)
        server.send_message(msg)
        server.quit()
    except Exception as e:
        logger.error(f"Failed to send email to {to_email}: {e}")
        raise
