//MW de auto-logout
exports.autoLogout = function(req, res, next){
  var actual = new Date();
  var difTiempo = actual-new Date(req.session.user.ultimoacceso)
  console.log("MW auto-logout. Tiempo sin actividad: "+difTiempo);
  req.session.user.ultimoacceso = actual;
  //si tiempo sin actividad >= 2 segundos
  if(difTiempo>=120000) res.redirect('/logout');
  else next();
}

//MW de autorización de accesos HTTP restringidos
exports.loginRequired = function(req, res, next){
  if(req.session.user) next();
  else res.redirect('/login');
}

// GET /login --Formulario login
exports.new = function(req, res){
  var errors = req.session.errors || {};
  req.session.errors = {};

  res.render('session/new', {errors: errors});
}

// POST /login --Crea sesión
exports.create = function(req, res){
  var login = req.body.login;
  var password = req.body.password;

  var userController = require('./user_controller');
  userController.autenticar(login, password, function(error, user){
    //si error retornamos mensaje error de sesión
    if(error){
      req.session.errors =[{"message":"Se ha producido un error"+error}];
      res.redirect("/login");
      return;
    }

    //Crear req.session.user y guardar campos id y username
    //La sesión se define por la existencia de: req.session.user
    req.session.user = {id:user.id, username:user.username, ultimoacceso:new Date()};

    //redirección a path anterior a login
    res.redirect(req.session.redir.toString());
  });
}

// DELETE /logout --Destruir sesión
exports.destroy = function(req, res){
  delete req.session.user;
  //redirección a path anterior a logout
  res.redirect(req.session.redir.toString());
}
