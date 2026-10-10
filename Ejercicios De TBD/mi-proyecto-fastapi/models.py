from sqlalchemy import Column, Integer, String, Float, Boolean
from database import Base

class Producto(Base):
    __tablename__ = "productos"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False, index=True)
    descripcion = Column(String(255), nullable=True)
    precio = Column(Float, nullable=False)
    disponible = Column(Boolean, default=True)