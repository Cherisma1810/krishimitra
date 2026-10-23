from sqlalchemy.orm import Session
from geoalchemy2.elements import WKTElement
from fastapi import HTTPException, status

from app.models.user import User, FarmerProfile
from app.schemas.user import UserRegisterRequest
from app.core.security import get_password_hash, verify_password

# Known reference coordinates for Tirupati / Rayalaseema mandals
MANDAL_CENTROIDS = {
    "Tirupati Urban": (79.4192, 13.6288),
    "Tirupati Rural": (79.3800, 13.6000),
    "Chandragiri": (79.3142, 13.5851),
    "Renigunta": (79.5167, 13.6500),
    "Yerpedu": (79.6000, 13.6833),
    "Srikalahasti": (79.6983, 13.7498),
    "Puttur": (79.5530, 13.4420),
    "Nagari": (79.5880, 13.3270),
    "Venkatagiri": (79.5800, 13.9667),
    "Sullurpeta": (80.0200, 13.7000),
    "Madanapalle": (78.5000, 13.5500),
    "Chittoor": (79.1003, 13.2172),
    "Pileru": (78.9333, 13.6833),
    "Rayachoti": (78.7500, 14.0500)
}

def register_new_user(db: Session, request: UserRegisterRequest) -> User:
    existing_user = db.query(User).filter(User.phone_number == request.phone_number).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A user with this phone number is already registered."
        )

    hashed_pwd = get_password_hash(request.password)

    new_user = User(
        phone_number=request.phone_number,
        hashed_password=hashed_pwd,
        full_name=request.full_name,
        role=request.role
    )
    db.add(new_user)
    db.flush()

    # Determine spatial location:
    # 1. Farmer provided direct GPS OR
    # 2. Derive automatically from Mandal Centroid
    if request.profile.farm_location:
        lng = request.profile.farm_location.longitude
        lat = request.profile.farm_location.latitude
    else:
        lng, lat = MANDAL_CENTROIDS.get(request.profile.mandal, (79.4192, 13.6288))
        
    spatial_point = WKTElement(f"POINT({lng} {lat})", srid=4326)

    new_profile = FarmerProfile(
        user_id=new_user.id,
        state=request.profile.state,
        district=request.profile.district,
        mandal=request.profile.mandal,
        village=request.profile.village,
        khata_number=request.profile.khata_number,
        survey_number=request.profile.survey_number,
        preferred_language=request.profile.preferred_language,
        total_acreage=request.profile.total_acreage,
        irrigation_source=request.profile.irrigation_source,
        farm_location=spatial_point
    )
    db.add(new_profile)
    db.commit()
    db.refresh(new_user)
    return new_user

def authenticate_user(db: Session, phone_number: str, plain_password: str) -> User:
    user = db.query(User).filter(User.phone_number == phone_number).first()
    if not user:
        return None
    if not verify_password(plain_password, user.hashed_password):
        return None
    return user