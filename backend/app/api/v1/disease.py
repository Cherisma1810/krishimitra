from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from app.api.deps import get_current_user
from app.models.user import User
from app.services.disease_service import disease_engine

router = APIRouter(prefix="/disease", tags=["Plant Disease AI Diagnosis"])

@router.post("/diagnose")
async def diagnose_leaf_image(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="దయచేసి సరైన ఫోటో (JPG/PNG) అప్‌లోడ్ చేయండి.")

    image_bytes = await file.read()
    if len(image_bytes) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="ఫోటో పరిమాణం 10MB కంటే తక్కువగా ఉండాలి.")

    result = disease_engine.diagnose(image_bytes)
    return result