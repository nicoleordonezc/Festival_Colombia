Consultas

db.bandas.find({nombre:{$regex:"^A"}})
db.asistentes.find({nombre:{$regex:"G...z$"}})
db.asistentes.find({generos_favoritos:{$eq:"Rock"}})
db.presentaciones.aggregate([{$group:{_id:"$escenario",totalPresentaciones:{$sum:1}}}])
db.presentaciones.aggregate([{$group:{_id:null, promedioDuracion:{$avg:"$duracion_minutos"}}}])

db.bandas.createIndex({nombre:"text"})
db.bandas.find({$text:{$search:"Bomba"}})

db.presentaciones.createIndex({escenario:1})
db.presentaciones.aggregate([{$match:{escenario:"Escenario Principal"}}, {$group:{_id:"$escenario", totalPresentaciones: {$sum:1}}}])

db.asistentes.find({ciudad:"Bogotá", edad:{$lt:30}})
db.asistentes.createIndex({ciudad:1, edad:1})
