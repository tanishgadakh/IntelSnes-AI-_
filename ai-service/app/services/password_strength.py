import re


def check_password_strength(password: str) -> dict:
    """Check password strength and return score and messages."""
    score = 0
    feedback = []
    
    if len(password) < 8:
        feedback.append("At least 8 characters required")
    else:
        score += 1
    
    if len(password) >= 12:
        score += 1
    
    if re.search(r'[a-z]', password):
        score += 1
    else:
        feedback.append("Add lowercase letters")
    
    if re.search(r'[A-Z]', password):
        score += 1
    else:
        feedback.append("Add uppercase letters")
    
    if re.search(r'[0-9]', password):
        score += 1
    else:
        feedback.append("Add numbers")
    
    if re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        score += 1
    else:
        feedback.append("Add special characters (!@#$%^&*)")
    
    strength = "weak"
    if score >= 4:
        strength = "good"
    if score >= 5:
        strength = "strong"
    if score >= 6:
        strength = "very_strong"
    
    return {
        "score": score,
        "strength": strength,
        "feedback": feedback
    }


def is_password_strong_enough(password: str) -> bool:
    """Check if password meets minimum strength requirements."""
    return check_password_strength(password)["score"] >= 4
