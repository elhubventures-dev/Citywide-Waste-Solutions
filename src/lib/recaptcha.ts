const RECAPTCHA_VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";
const MIN_SCORE = 0.5;

interface RecaptchaResponse {
  success: boolean;
  score: number;
  action: string;
  challenge_ts: string;
  hostname: string;
  "error-codes"?: string[];
}

export async function verifyRecaptcha(token: string): Promise<{
  valid: boolean;
  score: number;
  error?: string;
}> {
  if (!process.env.RECAPTCHA_SECRET_KEY) {
    // Skip verification in dev if key not configured
    if (process.env.NODE_ENV === "development") return { valid: true, score: 1 };
    return { valid: false, score: 0, error: "reCAPTCHA not configured" };
  }

  try {
    const res = await fetch(RECAPTCHA_VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: process.env.RECAPTCHA_SECRET_KEY,
        response: token,
      }),
    });

    const data = (await res.json()) as RecaptchaResponse;

    if (!data.success) {
      return {
        valid: false,
        score: 0,
        error: `reCAPTCHA failed: ${data["error-codes"]?.join(", ")}`,
      };
    }

    if (data.score < MIN_SCORE) {
      return { valid: false, score: data.score, error: `Score too low: ${data.score}` };
    }

    return { valid: true, score: data.score };
  } catch (err) {
    console.error("reCAPTCHA verification error:", err);
    return { valid: false, score: 0, error: "Verification request failed" };
  }
}
