var models = require('../models/models.js');

exports.show = function(req, res){
  var nquiz = models.Quiz.count();
  var ncom  = models.Comment.count();
  var quizConCom = models.Comment.findAll({
    attributes:[models.Sequelize.literal('DISTINCT "QuizId"')]
  }).then(function(result){
    var qcc=0;
    for(r in result)qcc++;
    return qcc;
  });

  Promise.all([nquiz, ncom, quizConCom]).then(function(st){
    res.render('quizes/statistics', {
      totalQuizes:st[0],
      totalComments: st[1],
      mediaComXPreg: st[1]/st[0],
      quizConCom: st[2],
      quizSinCom: st[0]-st[2],
      errors:[]
    });
  })
}
