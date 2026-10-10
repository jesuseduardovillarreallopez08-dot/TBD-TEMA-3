from pydantic import BaseModel
from typing import Optional

class ProductoBase(BaseModel):
    nombre: str
    descripcion: Optional[str] = None
    precio: float
    disponible: bool = True

class ProductoCreate(ProductoBase):
    pass

class ProductoResponse(ProductoBase):
    id: int

    class Config:
        from_attributes = True