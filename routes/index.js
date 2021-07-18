var express = require('express');
var router = express.Router();
const nodemailer = require("nodemailer");
var fs = require('fs');
const { errorMonitor } = require('stream');
 

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
  res.render('feedback', { title: 'Feedback | Suraj Rimal', error: req.query.error });
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
        var data = JSON.stringify(req.body, null, 2);
        fs.writeFile('feedback.json', data, 'ascii', function(err){
          if(err){
            console.log("Error:" + err)
          }
          else{
            let mailTransporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'rimalsuraj50@gmail.com',
                    pass: '9841312224'
                }
            });
            
            let mailDetails = {
                from: 'rimalsuraj50@gmail.com',
                to: email,
                subject: 'Feedback received!',
                text: `Dear ${fullname}, Thank you for your feedback! From surajrimal@herokuapp.com`
            };
              
            mailTransporter.sendMail(mailDetails, function(err, data) {
                if(err) {
                  console.log(err);
                    return res.redirect("/feedback?error=Error posting feedback, please check again later!" );
                } else{
                  console.log(data)
                  return res.redirect('/feedback_received');
                }
            });
        }
  });
  }
});

module.exports = router;
