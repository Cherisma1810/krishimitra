import sys
from app.core.database import engine, Base
from app.models.user import User, FarmerProfile

def verify():
    print("Connecting to PostgreSQL and creating tables...")
    try:
        Base.metadata.create_all(bind=engine)
        print("Success: Tables 'users' and 'farmer_profiles' created with PostGIS spatial column!")
    except Exception as e:
        print(f"Error connecting or creating tables: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    verify()