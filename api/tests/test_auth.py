import httpx
import json
import time

BASE_URL = "http://localhost:8000"

def run_tests():
    print("--- 1. Testing Registration ---")
    email = f"test_{int(time.time())}@example.com"
    r = httpx.post(f"{BASE_URL}/auth/signup", json={"username": "testuser", "email": email, "password": "password123"})
    print("Signup Status:", r.status_code)
    print("Signup Response:", r.json())
    assert r.status_code == 200, "Registration failed"
    
    print("\n--- 2. Checking Mail Spool for OTP ---")
    # In dev, the OTP is saved to mail.log
    with open("mail.log", "r") as f:
        lines = f.readlines()
        last_line = lines[-1]
        otp = last_line.split("OTP: ")[1].strip()
    print("Extracted OTP:", otp)
    
    print("\n--- 3. Testing Login Unverified Block ---")
    r = httpx.post(f"{BASE_URL}/auth/login", json={"email": email, "password": "password123"})
    print("Login Status (Expected 403):", r.status_code)
    print("Login Response:", r.json())
    assert r.status_code == 403, "Login did not block unverified user"

    print("\n--- 4. Testing Wrong OTP Attempt ---")
    r = httpx.post(f"{BASE_URL}/auth/verify-email", json={"email": email, "otp": "000000"})
    print("Verify Status (Expected 400):", r.status_code)
    print("Verify Response:", r.json())
    assert r.status_code == 400, "Wrong OTP was accepted"
    
    print("\n--- 5. Testing Resend Cooldown ---")
    r = httpx.post(f"{BASE_URL}/auth/resend-verification", json={"email": email})
    print("Resend Status (Expected 429):", r.status_code)
    print("Resend Response:", r.json())
    assert r.status_code == 429, "Resend cooldown was not enforced"

    print("\n--- 6. Testing Correct OTP ---")
    r = httpx.post(f"{BASE_URL}/auth/verify-email", json={"email": email, "otp": otp})
    print("Verify Status (Expected 200):", r.status_code)
    print("Verify Response:", r.json())
    assert r.status_code == 200, "Correct OTP was rejected"
    assert "access_token" in r.json(), "Did not return access token"

    print("\n--- 7. Testing OTP Reuse Protection ---")
    r = httpx.post(f"{BASE_URL}/auth/verify-email", json={"email": email, "otp": otp})
    print("Reuse Status (Expected 400):", r.status_code)
    print("Reuse Response:", r.json())
    assert r.status_code == 400, "OTP was reused"
    
    print("\n--- 8. Testing Enumeration (Existing Verified User) ---")
    r = httpx.post(f"{BASE_URL}/auth/signup", json={"username": "testuser", "email": email, "password": "password123"})
    print("Signup Status (Expected 200 generic):", r.status_code)
    print("Signup Response:", r.json())
    assert r.status_code == 200, "Enumeration failed"
    assert "we've sent a verification code" in r.json().get("detail", ""), "Did not return generic response"
    
    print("\n--- 9. Testing Enumeration (Existing Unverified User) ---")
    email_unverified = f"unverified_{int(time.time())}@example.com"
    httpx.post(f"{BASE_URL}/auth/signup", json={"username": "testuser", "email": email_unverified, "password": "password123"})
    
    r2 = httpx.post(f"{BASE_URL}/auth/signup", json={"username": "testuser", "email": email_unverified, "password": "password123"})
    print("Signup Status 2nd time (Expected 200 generic):", r2.status_code)
    print("Signup Response:", r2.json())
    assert r2.status_code == 200, "Enumeration failed on unverified user"
    assert "we've sent a verification code" in r2.json().get("detail", ""), "Did not return generic response"

    print("\nAll Email Verification Backend Tests Passed!")

if __name__ == "__main__":
    run_tests()
