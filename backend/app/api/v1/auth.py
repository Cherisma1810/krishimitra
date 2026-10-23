from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from geoalchemy2.shape import to_shape

from app.core.database import get_db
from app.schemas.user import (
    UserRegisterRequest, 
    UserResponse, 
    TokenResponse, 
    FarmerProfileResponse
)
from app.services.auth_service import register_new_user, authenticate_user
from app.core.security import create_access_token
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter(prefix="/auth", tags=["Authentication & Profile"])

def _format_user_response(user: User) -> UserResponse:
    profile_data = None
    if user.profile:
        lat, lng = None, None
        if user.profile.farm_location is not None:
            shapely_point = to_shape(user.profile.farm_location)
            lng = shapely_point.x
            lat = shapely_point.y
            
        profile_data = FarmerProfileResponse(
            id=user.profile.id,
            state=user.profile.state,
            district=user.profile.district,
            mandal=user.profile.mandal,
            village=user.profile.village,
            khata_number=user.profile.khata_number,
            survey_number=user.profile.survey_number,
            preferred_language=user.profile.preferred_language,
            total_acreage=user.profile.total_acreage,
            irrigation_source=user.profile.irrigation_source,
            latitude=lat,
            longitude=lng
        )

    return UserResponse(
        id=user.id,
        phone_number=user.phone_number,
        full_name=user.full_name,
        role=user.role.value if hasattr(user.role, "value") else str(user.role),
        is_active=user.is_active,
        profile=profile_data
    )

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(payload: UserRegisterRequest, db: Session = Depends(get_db)):
    user = register_new_user(db=db, request=payload)
    return _format_user_response(user)

@router.post("/login", response_model=TokenResponse)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(db, phone_number=form_data.username, plain_password=form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect phone number or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Inactive user")

    access_token = create_access_token(subject=user.id)
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user_id=user.id,
        full_name=user.full_name,
        role=user.role.value if hasattr(user.role, "value") else str(user.role)
    )

@router.get("/me", response_model=UserResponse)
def get_authenticated_profile(current_user: User = Depends(get_current_user)):
    return _format_user_response(current_user)