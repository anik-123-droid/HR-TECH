from sqlalchemy.ext.asyncio import AsyncSession
from app.models.audit import AuditLog

async def log_action(
    db: AsyncSession,
    action: str,
    user_id: int = None,
    organization_id: int = None,
    details: str = None,
    ip_address: str = None
):
    """Log critical actions to the audit trail (Layer 8)"""
    log_entry = AuditLog(
        action=action,
        user_id=user_id,
        organization_id=organization_id,
        details=details,
        ip_address=ip_address
    )
    db.add(log_entry)
    await db.commit()
    await db.refresh(log_entry)
    return log_entry
