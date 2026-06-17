var express=require('express');
var query1=require('../db.js');

var router=express.Router();

router.get('/',async(req,res)=>{
       // res.send('Welcome Website Panel');
       var sql='select * from blog';
       var blog=await query1(sql);
       var ser_sql='select * from service';
       var service_data=await query1(ser_sql);
   res.render('web/index.ejs',{blog:blog,service:service_data});
})
router.post('/book_appointment',async(req,res)=>{
   var {name,email,service_id,appointment_date}=req.body;
   var sql='insert into appointment_enquiry(name,email,service_id,appointment_date,status) values(?,?,?,?,?) ';
   var data=await query1(sql,[name,email,service_id,appointment_date,'pending']);
   res.redirect('/');
     // res.send(appointment_date);

})
router.get('/whyus',(req,res)=>{
   res.render('web/whyus.ejs')
})
router.get('/service',(req,res)=>{
   res.render('web/service.ejs')
})
router.get('/team',(req,res)=>{
   res.render('web/team.ejs')
})
router.get('/Pricing',(req,res)=>{
   res.render('web/Pricing.ejs')
})
router.get('/DentalSolutions',async(req,res)=>{
   var sql=`select * from dentalsolutions`;
    var data=await query1(sql);
    res.render('web/DentalSolutions.ejs',{data:data});
})

module.exports=router;
