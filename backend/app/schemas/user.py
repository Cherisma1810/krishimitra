import re
from typing import Optional
from pydantic import BaseModel, Field, field_validator, ConfigDict
from app.models.user import UserRole

# ----------------- Profile Schemas -----------------
class LocationPoint(BaseModel):
    longitude: float = Field(..., ge=75.0, le=85.0)
    latitude: float = Field(..., ge=12.0, le=20.0)

class FarmerProfileCreate(BaseModel):
    state: str = Field(default="Andhra Pradesh")
    district: str = Field(default="Tirupati", examples=["Tirupati", "Chittoor", "Annamayya"])
    mandal: str = Field(..., min_length=2, max_length=50, examples=["Chandragiri", "Renigunta", "Yerpedu"])
    village: str = Field(..., min_length=2, max_length=50)
    # AP Meebhoomi passbook details
    khata_number: Optional[str] = Field(None, max_length=30, description="Pattadar Passbook Khata Number")
    survey_number: Optional[str] = Field(None, max_length=30, description="Village Land Survey / Sub-division Number")
    preferred_language: str = Field(default="te", pattern=r"^(te|en)$")
    total_acreage: Optional[str] = Field(None, max_length=20)
    irrigation_source: Optional[str] = Field(None, max_length=50)
    farm_location: Optional[LocationPoint] = None

class FarmerProfileResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    state: str
    district: str
    mandal: str
    village: str
    khata_number: Optional[str] = None
    survey_number: Optional[str] = None
    preferred_language: str
    total_acreage: Optional[str]
    irrigation_source: Optional[str]
    latitude: Optional[float] = None
    longitude: Optional[float] = None

# ----------------- User Schemas -----------------
class UserRegisterRequest(BaseModel):
    phone_number: str = Field(..., description="10-digit Indian mobile number")
    password: str = Field(..., min_length=8)
    full_name: str = Field(..., min_length=2, max_length=100)
    role: UserRole = Field(default=UserRole.FARMER)
    profile: FarmerProfileCreate

    @field_validator("phone_number")
    @classmethod
    def validate_indian_phone(cls, v: str) -> str:
        cleaned = re.sub(r"[\s\-\+]", "", v)
        if cleaned.startswith("91") and len(cleaned) == 12:
            cleaned = cleaned[2:]
        if not re.fullmatch(r"[6-9]\d{9}", cleaned):
            raise ValueError("Phone number must be a valid 10-digit Indian mobile number starting with 6-9.")
        return cleaned

class UserLoginRequest(BaseModel):
    phone_number: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: int
    full_name: str
    role: str

class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    phone_number: str
    full_name: str
    role: str
    is_active: bool
    profile: Optional[FarmerProfileResponse] = None