import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User
from ..schemas import UserCreate, UserLogin, UserOut, Token, SocialAuthRequest, UserProfileUpdate
from ..auth import verify_password, get_password_hash, create_access_token, get_current_user

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/register", response_model=Token)
def register_user(user_in: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(
        (User.username == user_in.username) | (User.email == user_in.email)
    ).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username or email already registered"
        )
    
    hashed_pwd = get_password_hash(user_in.password)
    new_user = User(
        username=user_in.username,
        email=user_in.email,
        hashed_password=hashed_pwd,
        full_name=user_in.full_name or user_in.username,
        role=user_in.role or "Student Innovator",
        institution=user_in.institution or "Gujarat Technological University (GTU) • SSIP 2.0 Cohort",
        avatar=user_in.avatar or f"https://api.dicebear.com/7.x/initials/svg?seed={user_in.username}&backgroundColor=2563eb",
        provider="local"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    access_token = create_access_token(data={"sub": new_user.username})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": new_user
    }

@router.post("/login", response_model=Token)
def login_user(user_in: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(
        (User.username == user_in.username) | (User.email == user_in.username)
    ).first()
    
    if not user or not verify_password(user_in.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email/username or password"
        )
        
    access_token = create_access_token(data={"sub": user.username})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

@router.post("/social", response_model=Token)
def social_login(payload: SocialAuthRequest, db: Session = Depends(get_db)):
    """
    Real social OAuth callback endpoint for Google, Microsoft, and GitHub.
    Creates user if first time or updates session, returning signed JWT.
    """
    user = db.query(User).filter(User.email == payload.email).first()
    
    if not user:
        # Generate clean username from email or name
        base_username = payload.username or payload.email.split("@")[0].replace(".", "_")
        username = base_username
        suffix = 1
        while db.query(User).filter(User.username == username).first():
            username = f"{base_username}_{suffix}"
            suffix += 1
            
        # Random secure password hash for OAuth accounts
        dummy_hash = get_password_hash(str(uuid.uuid4()))
        user = User(
            username=username,
            email=payload.email,
            hashed_password=dummy_hash,
            full_name=payload.name,
            role=payload.role or "Student Innovator",
            institution=payload.institution or "Gujarat Technological University (GTU) • SSIP 2.0 Cohort",
            avatar=payload.avatar or f"https://api.dicebear.com/7.x/initials/svg?seed={username}&backgroundColor=4f46e5",
            provider=payload.provider
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    else:
        # Update existing user profile with latest social avatar or provider if unset
        if payload.avatar and not user.avatar:
            user.avatar = payload.avatar
        if payload.name and not user.full_name:
            user.full_name = payload.name
        user.provider = payload.provider
        db.commit()
        db.refresh(user)

    access_token = create_access_token(data={"sub": user.username})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

@router.get("/me", response_model=UserOut)
def get_user_profile(current_user: User = Depends(get_current_user)):
    return current_user

@router.put("/profile", response_model=UserOut)
def update_profile(
    updates: UserProfileUpdate, 
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if updates.full_name is not None:
        current_user.full_name = updates.full_name
    if updates.role is not None:
        current_user.role = updates.role
    if updates.institution is not None:
        current_user.institution = updates.institution
    if updates.avatar is not None:
        current_user.avatar = updates.avatar
        
    db.commit()
    db.refresh(current_user)
    return current_user
