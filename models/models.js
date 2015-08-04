var path = require('path');

//obtenemos info de conexión a bd a través de las var de entorno
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name  = (url[6]||null);
var user     = (url[2]||null);
var pwd      = (url[3]||null);
var protocol = (url[1]||null);
var dialect  = (url[1]||null);
var port     = (url[5]||null);
var host     = (url[4]||null);
var storage  = process.env.DATABASE_STORAGE;

//carga modelo orm
var Sequelize = require('sequelize');

//usar BBDD sqlite o Postgre
var sequelize = new Sequelize(DB_name, user, pwd,{
  dialect: dialect,
  protocol: protocol,
  port: port,
  host: host,
  storage: storage, //solo sqlite (.env)
  omitNull: true //solo Postgre
});

//importar la definición de la tabla quiz en quiz.js
var quiz_path = path.join(__dirname, 'quiz');
var Quiz = sequelize.import(quiz_path);

//Importar la definición de la tabla Comment
var comment_path = path.join(__dirname, 'comment');
var Comment = sequelize.import(comment_path);

//Relación entre tablas
Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

//Exportar tablas
exports.Quiz = Quiz;
exports.Comment = Comment;
exports.Sequelize = Sequelize;

//crea e inicializa la tabla de preguntas
sequelize.sync().then(function(){
  Quiz.count().then(function(count){
    if(count===0){
      Quiz.create({
        pregunta: 'Capital de Italia',
        respuesta: 'Roma',
        tema: 'humanidades'
      });

      Quiz.create({
        pregunta: 'Capital de Portugal',
        respuesta: 'Lisboa',
        tema: 'humanidades'
      }).then(function(){console.log('Base de datos inicializada')});
    }
  });
});
