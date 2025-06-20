Consultas

db.bandas.find({nombre:{$regex:"^A"}})
db.asistentes.find({nombre:{$regex:"G...z$"}})
db.asistentes.find({generos_favoritos:{$eq:"Rock"}})
db.presentaciones.aggregate([{$group:{_id:"$escenario",totalPresentaciones:{$sum:1}}}])
db.presentaciones.aggregate([{$group:{_id:null, promedioDuracion:{$avg:"$duracion_minutos"}}}])

System.js

db.system.js.insertOne({_id:"consulta", value: new Code("function(valor){return db.escenarios.findOne({ciudad:valor});}")})
const consulta = db.system.js.findOne({_id:"consulta"})
const escenariosPorCiudad = new Function("return "+consulta.value.code)()
escenariosPorCiudad("Cali")

db.system.js.insertOne({_id:"c2", value: new Code("function(valor){return db.bandas.findOne({genero:valor, activa:true});}")})
const c2 = db.system.js.findOne({_id:"c2"})
const bandasPorGenero = new Function("return "+c2.value.code)()
bandasPorGenero("Rock")

Transacciones

const session = db.getMongo().startSession();
const dbSession = session.getDatabase("Festival_de_Conciertos");
session.startTransaction();
try{
    dbSession.asistentes.updateOne({nombre:"Juan Pérez"},{$push:{boletos_comprados:{escenario: "Escenario Principal",
      dia: "2025-06-19"}}});
    session.commitTransaction();
    print("Boleto insertado");
}catch(e){
    session.abortTransaction();
    print(error);
}finally{
    session.endSession();
}print("Fin")


const session = db.getMongo().startSession();
const dbSession = session.getDatabase("Festival_de_Conciertos");
session.startTransaction();
try{
    dbSession.escenarios.updateOne({nombre:"Escenario Principal"},{$inc:{capacidad:-1}});
    session.commitTransaction();
    print("Capacidad actualizada");
}catch(e){
    session.abortTransaction();
    print(error);
}finally{
    session.endSession();
}print("Fin")

const session = db.getMongo().startSession();
const dbSession = session.getDatabase("Festival_de_Conciertos");
session.startTransaction();
try{
    dbSession.asistentes.updateOne({nombre:"Juan Pérez"},{$pull:{boletos_comprados:{dia:"2025-06-19"}}});
    session.commitTransaction();
    print("Boleto eliminado");
}catch(e){
    session.abortTransaction();
    print(error);
}finally{
    session.endSession();
}print("Fin")

const session = db.getMongo().startSession();
const dbSession = session.getDatabase("Festival_de_Conciertos");
session.startTransaction();
try{
    dbSession.escenarios.updateOne({nombre:"Escenario Principal"},{$inc:{capacidad:1}});
    session.commitTransaction();
    print("Capacidad incremetada");
}catch(e){
    session.abortTransaction();
    print(error);
}finally{
    session.endSession();
}print("Fin")

Index

db.bandas.createIndex({nombre:"text"})
db.bandas.find({$text:{$search:"Bomba"}})

db.presentaciones.createIndex({escenario:1})
db.presentaciones.aggregate([{$match:{escenario:"Escenario Principal"}}, {$group:{_id:"$escenario", totalPresentaciones: {$sum:1}}}])

db.asistentes.find({ciudad:"Bogotá", edad:{$lt:30}})
db.asistentes.createIndex({ciudad:1, edad:1})
