import uuid
import os
from fastapi import Request, Response

COOKIE_SECURE = os.getenv("COOKIE_SECURE", "true").lower() == "true"

def get_anonymous_session(request: Request, response: Response) -> str:
    """
    Returns the anonymous session ID from the cookie.
    If it doesn't exist, generates a new one and sets the cookie.
    """
    session_id = request.cookies.get("charex_anon_session")
    if not session_id:
        session_id = uuid.uuid4().hex
        response.set_cookie(
            key="charex_anon_session",
            value=session_id,
            httponly=True,
            secure=COOKIE_SECURE,
            samesite="lax",
            path="/"
        )
    return session_id
