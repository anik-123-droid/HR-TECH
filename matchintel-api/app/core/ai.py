import json
import re

class AIGuardrails:
    """Security Layer 6: AI Prompt Security & Layer 13: Abuse Protection"""
    
    @staticmethod
    def sanitize_input(text: str) -> str:
        """Strip potentially malicious instructions from candidate text."""
        # Simple example: block common prompt injection phrases
        blocked_phrases = ["ignore previous instructions", "system prompt", "return all"]
        sanitized = text.lower()
        for phrase in blocked_phrases:
            if phrase in sanitized:
                raise ValueError("Potential prompt injection detected.")
        return text
        
    @staticmethod
    def structured_prompt(candidate_text: str, job_description: str) -> str:
        """Always use structured JSON formats for AI processing."""
        return f\"\"\"
        You are an AI assistant. Analyze the candidate data against the job description.
        Output exactly in JSON format matching the schema provided.
        
        <CANDIDATE_DATA>
        {AIGuardrails.sanitize_input(candidate_text)}
        </CANDIDATE_DATA>
        
        <JOB_DESCRIPTION>
        {AIGuardrails.sanitize_input(job_description)}
        </JOB_DESCRIPTION>
        \"\"\"

import redis
import os
from fastapi import HTTPException

# Configure Redis connection
redis_url = os.getenv("REDIS_URL", "redis://localhost:6379/0")
redis_client = redis.from_url(redis_url)

class AITokenTracker:
    @staticmethod
    def check_quota(organization_id: int, requested_tokens: int) -> bool:
        """Check organizational token limits and block if exceeded (Layer 13)"""
        # Hardcoded daily quota for demo purposes
        DAILY_QUOTA = 100_000 
        quota_key = f"org:{organization_id}:tokens_used_today"
        
        try:
            current_usage = redis_client.get(quota_key)
            current_usage = int(current_usage) if current_usage else 0
            
            if current_usage + requested_tokens > DAILY_QUOTA:
                raise HTTPException(status_code=429, detail="Daily AI Token quota exceeded. Please upgrade your plan.")
                
            # Increment and set 24h expiry if new
            redis_client.incrby(quota_key, requested_tokens)
            if current_usage == 0:
                redis_client.expire(quota_key, 86400) # 24 hours
            return True
        except redis.ConnectionError:
            # Fallback open if redis is down, or choose to block
            print("WARNING: Redis unavailable. Bypassing token quota.")
            return True

