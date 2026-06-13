# Instrucciones

Como requisito previo es necesario tener creada una base de datos en **PostgreSQL**.

## Clonar el proyecto

1. Clonar el proyecto
```bash
git clone https://github.com/agcudco/productos-categorias-espam.git
```

2. Instalar las dependencias
```bash
npm install
```
3. Crear el `.env` en la raíz del proyecto.

El archivo debe contener las siguientes variables:

```bash
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=password
DATABASE_NAME=products
```

4. Ejecutar el proyecto
```bash
npm run start:dev
```

## Probar los endpoints de categories

| Método | Endpoint              | Descripción                          | JSON de entrada / Parámetros                                                                                 |
|--------|-----------------------|--------------------------------------|--------------------------------------------------------------------------------------------------------------|
| POST   | /categories           | Crear una nueva categoría            | `json { "name": "Electrónicos", "description": "Dispositivos y gadgets" }`                                   |
| GET    | /categories           | Listar todas las categorías          | -                                                                                                            |
| GET    | /categories/:id       | Obtener una categoría por ID         | `:id` = UUID de la categoría                                                                                 |
| PUT    | /categories/:id       | Actualizar una categoría existente   | `json { "name": "Electrónica", "description": "Productos electrónicos actualizados" }` (campos opcionales)   |
| DELETE | /categories/:id       | Eliminar una categoría por ID        | -                                                                                                            |

## Probar los endpoints de product

| Método | Endpoint              | Descripción                          | JSON de entrada / Parámetros                                                                                 |
|--------|-----------------------|--------------------------------------|--------------------------------------------------------------------------------------------------------------|
| POST   | /product           | Crear una nueva producto            | `json {
  "name": "laptop hp",
  "description": "Laptop potente",
  "price": 1200,
  "stock": 5,
  "categoryId": "33bb1978-1981-4024-a522-4115731f22d6"
}`                                   |
| GET    | /product           | Listar todas las productos          | -                                                                                                            |
| GET    | /product/:id       | Obtener una producto por ID         | `:id` = UUID de la producto                                                                                 |
| PUT    | /product/:id       | Actualizar una producto existente   | `json {
  "name": "laptop hp",
  "description": "Laptop potente",
  "price": 1200.00,
  "stock": 7,
  "categoryId": "33bb1978-1981-4024-a522-4115731f22d6",
  "imageUrl": "https://example.com/laptop.jpg"
}` (campos opcionales)   |
| DELETE | /product/:id       | Eliminar una producto por ID        | -                                                                                                            |