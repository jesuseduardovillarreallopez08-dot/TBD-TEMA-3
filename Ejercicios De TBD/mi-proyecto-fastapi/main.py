from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

import models
import schemas
from database import engine, get_db

# Crea la tabla automáticamente en PostgreSQL si no existe
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="API de Productos con FastAPI y PostgreSQL",
    version="1.0.0"
)

@app.get("/api/productos", response_model=List[schemas.ProductoResponse])
def obtener_productos(db: Session = Depends(get_db)):
    return db.query(models.Producto).all()

@app.get("/api/productos/{producto_id}", response_model=schemas.ProductoResponse)
def obtener_producto_por_id(producto_id: int, db: Session = Depends(get_db)):
    producto = db.query(models.Producto).filter(models.Producto.id == producto_id).first()
    if not producto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Producto con ID {producto_id} no encontrado"
        )
    return producto

@app.post("/api/productos", response_model=schemas.ProductoResponse, status_code=status.HTTP_201_CREATED)
def crear_producto(producto: schemas.ProductoCreate, db: Session = Depends(get_db)):
    nuevo_producto = models.Producto(**producto.model_dump())
    db.add(nuevo_producto)
    db.commit()
    db.refresh(nuevo_producto)
    return nuevo_producto

@app.put("/api/productos/{producto_id}", response_model=schemas.ProductoResponse)
def actualizar_producto(producto_id: int, datos: schemas.ProductoCreate, db: Session = Depends(get_db)):
    query = db.query(models.Producto).filter(models.Producto.id == producto_id)
    producto_existente = query.first()
    
    if not producto_existente:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Producto con ID {producto_id} no encontrado"
        )
    
    query.update(datos.model_dump(), synchronize_session=False)
    db.commit()
    return query.first()

@app.delete("/api/productos/{producto_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_producto(producto_id: int, db: Session = Depends(get_db)):
    query = db.query(models.Producto).filter(models.Producto.id == producto_id)
    producto = query.first()
    
    if not producto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Producto con ID {producto_id} no encontrado"
        )
    
    query.delete(synchronize_session=False)
    db.commit()
    return None