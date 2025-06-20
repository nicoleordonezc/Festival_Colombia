# 🎸 Taller de MongoDB: Consultas, Funciones, Transacciones e Índices

Este taller aplica conceptos clave de MongoDB en un contexto de eventos musicales: expresiones regulares, agregaciones, funciones almacenadas, transacciones e índices.

---
## Nombre de Autor:

* Nicole Ordoñez

## 🔍 Consultas

### 1. **Expresiones Regulares**
- Buscar bandas cuyo nombre **empiece por la letra “A”**:
```js
db.bandas.find({nombre: {$regex: "^A"}})
````
![1](https://github.com/user-attachments/assets/fed8846e-8776-439f-bcaf-f62fab5e0a9b)

* Buscar asistentes cuyo **nombre contenga "Gómez"**:

```js
db.asistentes.find({nombre: {$regex: "G...z$"}})
```
![2](https://github.com/user-attachments/assets/de450e2c-ab4f-4484-ae91-34ea63e04c0b)

### 2. **Operadores de Arreglos**

* Buscar asistentes que tengan `"Rock"` dentro de su campo `generos_favoritos`:

```js
db.asistentes.find({generos_favoritos: {$eq: "Rock"}})
```
![3](https://github.com/user-attachments/assets/f32d04ec-e89e-409a-83e1-a5343e8d1156)
![3 1](https://github.com/user-attachments/assets/ad047d38-5f23-4c4b-8972-4168c0a4bbda)


### 3. **Aggregation Framework**

* Agrupar presentaciones por `escenario` y contar cuántas presentaciones hay por cada uno:

```js
db.presentaciones.aggregate([
  {$group: {_id: "$escenario", totalPresentaciones: {$sum: 1}}}
])
```
![4](https://github.com/user-attachments/assets/b0bcfccc-a1a9-4636-b128-ba8c68b3ccbd)

* Calcular el **promedio de duración** de las presentaciones:

```js
db.presentaciones.aggregate([
  {$group: {_id: null, promedioDuracion: {$avg: "$duracion_minutos"}}}
])
```
![5](https://github.com/user-attachments/assets/9f99ef84-fded-4340-bf20-43301045fdd9)

---

## ⚙️ Funciones en `system.js`

### 1. `escenariosPorCiudad(ciudad)`

```js
db.system.js.insertOne({
  _id: "consulta", 
  value: new Code("function(valor){ return db.escenarios.findOne({ciudad: valor}); }")
})

const consulta = db.system.js.findOne({_id: "consulta"})
const escenariosPorCiudad = new Function("return " + consulta.value.code)()
escenariosPorCiudad("Cali")
```
![6](https://github.com/user-attachments/assets/f6ab17a2-7f8e-400a-bca3-601b939a346c)

### 2. `bandasPorGenero(genero)`

```js
db.system.js.insertOne({
  _id: "c2", 
  value: new Code("function(valor){ return db.bandas.findOne({genero: valor, activa: true}); }")
})

const c2 = db.system.js.findOne({_id: "c2"})
const bandasPorGenero = new Function("return " + c2.value.code)()
bandasPorGenero("Rock")
```
![7](https://github.com/user-attachments/assets/d7c0c10a-cff8-41bd-8e8f-6eb2bf8f6117)

---

## 🔁 Transacciones *(requiere replica set)*

### 1. Simular compra de un boleto

#### a. Insertar nuevo boleto:

```js
const session = db.getMongo().startSession();
const dbSession = session.getDatabase("Festival_de_Conciertos");

session.startTransaction();

try {
  dbSession.asistentes.updateOne(
    {nombre: "Juan Pérez"},
    {$push: {boletos_comprados: {escenario: "Escenario Principal", dia: "2025-06-19"}}}
  );
  session.commitTransaction();
  print("Boleto insertado");
} catch (e) {
  session.abortTransaction();
  print(error);
} finally {
  session.endSession();
}
print("Fin")
```
![8](https://github.com/user-attachments/assets/03bf5644-1af1-4cfc-852c-2b3cd285be34)

#### b. Disminuir capacidad del escenario:

```js
const session = db.getMongo().startSession();
const dbSession = session.getDatabase("Festival_de_Conciertos");

session.startTransaction();

try {
  dbSession.escenarios.updateOne(
    {nombre: "Escenario Principal"},
    {$inc: {capacidad: -1}}
  );
  session.commitTransaction();
  print("Capacidad actualizada");
} catch (e) {
  session.abortTransaction();
  print(error);
} finally {
  session.endSession();
}
print("Fin")
```
![9](https://github.com/user-attachments/assets/f02babd2-94e4-445c-8049-f730eb36f714)

### 2. Reversar la compra

#### a. Eliminar boleto insertado:

```js
const session = db.getMongo().startSession();
const dbSession = session.getDatabase("Festival_de_Conciertos");

session.startTransaction();

try {
  dbSession.asistentes.updateOne(
    {nombre: "Juan Pérez"},
    {$pull: {boletos_comprados: {dia: "2025-06-19"}}}
  );
  session.commitTransaction();
  print("Boleto eliminado");
} catch (e) {
  session.abortTransaction();
  print(error);
} finally {
  session.endSession();
}
print("Fin")
```
![10](https://github.com/user-attachments/assets/48b9c106-80ee-42ff-85b0-75908fbfb73d)

#### b. Incrementar la capacidad del escenario:

```js
const session = db.getMongo().startSession();
const dbSession = session.getDatabase("Festival_de_Conciertos");

session.startTransaction();

try {
  dbSession.escenarios.updateOne(
    {nombre: "Escenario Principal"},
    {$inc: {capacidad: 1}}
  );
  session.commitTransaction();
  print("Capacidad incrementada");
} catch (e) {
  session.abortTransaction();
  print(error);
} finally {
  session.endSession();
}
print("Fin")
```
![11](https://github.com/user-attachments/assets/94706e87-2625-47e1-8c13-c27f0447b46b)

---

## 📈 Índices + Consultas

### 1. Crear un índice en `bandas.nombre` y buscar una banda específica:

```js
db.bandas.createIndex({nombre: "text"})
db.bandas.find({$text: {$search: "Bomba"}})
```
![12](https://github.com/user-attachments/assets/0a2198c7-2289-4112-8b3d-4113de20d14f)

### 2. Crear un índice en `presentaciones.escenario` y contar presentaciones:

```js
db.presentaciones.createIndex({escenario: 1})
db.presentaciones.aggregate([
  {$match: {escenario: "Escenario Principal"}},
  {$group: {_id: "$escenario", totalPresentaciones: {$sum: 1}}}
])
```
![13](https://github.com/user-attachments/assets/ce5893ba-0c5f-4dbd-855a-b6d2be0450de)

### 3. Crear índice compuesto en `asistentes.ciudad` y `edad`, consultar asistentes:

```js
db.asistentes.find({ciudad: "Bogotá", edad: {$lt: 30}})
db.asistentes.createIndex({ciudad: 1, edad: 1})
```
![14](https://github.com/user-attachments/assets/16ff83fb-c779-42b7-8c34-699308d50936)

