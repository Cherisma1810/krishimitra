from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool
from alembic import context
import geoalchemy2  # Ensures PostGIS geometry types are registered with Alembic

# Import your settings and SQLAlchemy Base
from app.core.config import settings
from app.core.database import Base
# Import all models so Base.metadata knows about them
import app.models.user  # noqa: F401

config = context.config

# Set the SQLAlchemy connection string from our centralized Pydantic settings
config.set_main_option("sqlalchemy.url", settings.DATABASE_URL)

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata

def run_migrations_offline() -> None:
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        include_object=lambda obj, name, type_, reflected, compare_to: not (
            type_ == "table" and name in ["spatial_ref_sys"]
        ),  # Do not drop or alter PostGIS internal tables
    )

    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online() -> None:
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            include_object=lambda obj, name, type_, reflected, compare_to: not (
                type_ == "table" and name in ["spatial_ref_sys"]
            ),
        )

        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()