var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home | Suraj Rimal'});
});


router.get('/gallery', function(req, res, next) {
  res.render('gallery', { title: 'Gallery | Suraj Rimal' });
});

router.get('/game', function(req, res, next) {
  res.render('game', { title: 'Game | Suraj Rimal',  layout:'game'  });
});

router.get('/feedback', function(req, res, next) {
  res.render('feedback', { title: 'Feedback | Suraj Rimal' });
});

router.get('/feedback_received', function(req, res, next) {

  if(!req.app.get('isRedirect')){
    return res.redirect('/feedback');
  }

});


router.post('/feedback', function(req, res, next) {

  var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

  fullname = req.body.fname;
  address = req.body.address;
  phone = req.body.phone;
  email = req.body.email;
  review = req.body.review;

  errorMessage = '';
  if(fullname === ''){
      errorMessage += "Name cannot be empty.\n";
  }
  if(phone!== '' && (phone.length !== 10 || phone.startsWith('0'))){
      errorMessage += "Enter a valid phone numner. (Must be 10 digits!)\n";
  }
  if(email === ''){
      errorMessage += "Email cannot be empty.\n";
  }
  else if(!filter.test(email)){
      errorMessage += "Please provide a valid email.\n"
  }

  if(review === ''){
      errorMessage += "Comments cannot be empty.\n";
  }

  if(errorMessage !== ''){
    res.render('feedback', { title: 'Feedback | Suraj Rimal', error: errorMessage });
  }

  else{
    var db = req.db;
    var collection = db.get("feedbacks")
    var deletedCount;
    collection.remove({"email": email}, function(err, obj) {
      if (err) throw err;
      deletedCount =  obj.deletedCount;
      collection.insert(req.body, function(err, obj){
        if(err) throw err
        else{
          collection.count(function(err, obj){
            if(err) throw err;
            else{
              req.app.set('isRedirect', true);
              req.app.set('count', obj);
              req.app.set('deletedCount', deletedCount);
              res.redirect('feedback_received');
            }
          })
        }
      });
    });
  }
});

module.exports = router;
