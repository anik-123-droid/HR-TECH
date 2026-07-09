from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Request
from sqlalchemy.ext.asyncio import AsyncSession
import magic # python-magic for MIME validation
import os
import uuid

from app.config.database import get_db
from app.api.dependencies import get_current_user, require_role
from app.models.user import User
from app.core.rate_limit import limiter

router = APIRouter()

ALLOWED_MIME_TYPES = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
MAX_FILE_SIZE = 10 * 1024 * 1024 # 10 MB

@router.post("/upload-resume")
@limiter.limit("20/hour")
async def upload_resume(
    request: Request,
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["Candidate"]))
):
    """Secure endpoint for uploading resumes (Security Layer 4)"""
    
    # Check file size
    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File too large. Max size is 10MB.")
        
    # Check MIME type securely
    mime = magic.Magic(mime=True)
    file_mime = mime.from_buffer(contents)
    
    if file_mime not in ALLOWED_MIME_TYPES:
        raise HTTPException(status_code=400, detail="Invalid file type. Only PDF and DOCX are allowed.")
        
    # Generate random filename and store outside web root (simulated path here)
    random_filename = f"{uuid.uuid4()}_{file.filename}"
    upload_dir = "/tmp/secure_uploads"
    os.makedirs(upload_dir, exist_ok=True)
    
    file_path = os.path.join(upload_dir, random_filename)
    with open(file_path, "wb") as f:
        f.write(contents)
        
    from app.crud.audit import log_action
    client_host = request.client.host if request.client else None
    await log_action(db, action="upload_resume", user_id=current_user.id, organization_id=current_user.organization_id, details=f"Filename: {file.filename}", ip_address=client_host)
    
    return {"message": "Resume uploaded securely", "filename": random_filename}
