var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controllers');
var commentController = require('../controllers/comment_controller');
var sessionController = require('../controllers/session_controller');
var statisticsController = require('../controllers/statistics_controller')

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz', errors:[]});
});

//Autoload de comandos con params
router.param('quizId', quizController.load);
router.param('commentId', commentController.load);

// Definir rutas de sesión
router.get('/login', sessionController.new); //formulario login
router.post('/login', sessionController.create); //crea sesión
router.get('/logout', sessionController.destroy); //destruir sesión

//Definición de rutas de /quizes
router.get('/quizes', quizController.index);
router.get('/quizes/:quizId(\\d+)', quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);
router.get('/quizes/new',                sessionController.loginRequired, sessionController.autoLogout, quizController.new);
router.post('/quizes/create',            sessionController.loginRequired, sessionController.autoLogout, quizController.create);
router.get('/quizes/:quizId(\\d+)/edit', sessionController.loginRequired, sessionController.autoLogout, quizController.edit);
router.put('/quizes/:quizId(\\d+)',      sessionController.loginRequired, sessionController.autoLogout, quizController.update);
router.delete('/quizes/:quizId(\\d+)',   sessionController.loginRequired, sessionController.autoLogout, quizController.destroy);

//Definición de rutas de estadísticas
router.get('/quizes/statistics', statisticsController.show);

//Definición de rutas de comentarios
router.get('/quizes/:quizId(\\d+)/comments/new', commentController.new);
router.post('/quizes/:quizId(\\d+)/comments', commentController.create);
router.get('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/publish', sessionController.loginRequired, sessionController.autoLogout, commentController.publish);


router.get('/author',quizController.author);

module.exports = router;