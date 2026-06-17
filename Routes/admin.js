var express=require('express');
var router=express.Router();
var query1=require('../db.js');
var path=require('path');
var fs=require('fs');

router.get('/',async(req,res)=>{
   // res.send('Welcome Admin Panel');
//    var sql='select * from login';
//    var data=await q(sql);
//    res.send(data);
   res.render('admin/login.ejs');
})
router.post('/login_check',async(req,res)=>{
   // res.send(req.body);
    var {username,password}=req.body;
    var sql='select * from login where username=? and password=?';
    var data=await query1(sql,[username,password]);
    if(data[0]){
       // res.send(data);
        //session
        req.session.lid=data[0].lid;
        req.session.admin_name=data[0].admin_name;
        //res.send(req.session);
        res.redirect('/admin/index');
    }else{
        res.redirect('/admin/');
    }
})
router.use((req,res,next)=>{
    res.locals.session=req.session;
    next();
})
router.get('/logout',(req,res)=>{
    req.session.destroy();
    res.redirect('/admin/');
})
router.get('/forgot',(req,res)=>{
    res.render('admin/forgot.ejs');
})
router.get('/index',(req,res)=>{
    var name=req.session.admin_name;
    //res.send(name);
    res.render('admin/index.ejs',{aname:name});
})
router.get('/DentalSolutions',async(req,res)=>{
    var sql=`select * from dentalsolutions`;
    var data=await query1(sql);
    res.render('admin/DentalSolutions.ejs',{data:data});
})
router.post('/DentalSolutions_save',async(req,res)=>{
   // res.send(req.body);
    var{title,desc}=req.body;
    var sql=`insert into dentalsolutions(title,description) values(?,?)`;
    var data=await query1(sql,[title,desc]);
   // res.send(data);
   res.redirect('/admin/DentalSolutions'); 

})
router.get('/DentalSolutions_delete/:id',async(req,res)=>{
    var id=req.params.id;
    var sql=`delete from dentalsolutions where ds_id=?`;
    var data=await query1(sql,[id]);
    res.redirect('/admin/DentalSolutions'); 

})
router.get('/DentalSolutions_edit/:id',async(req,res)=>{
    var id=req.params.id;
    var sql=`select * from dentalsolutions where ds_id=?`;
    var data=await query1(sql,[id]);
    res.render('admin/DentalSolutions_edit.ejs',{data:data[0]});
})
router.post('/DentalSolutions_edit_save/:id',async(req,res)=>{
   // res.send(req.body);
    var id=req.params.id;
    var{title,desc}=req.body;
    var sql=`update  dentalsolutions set title=?,description=? where ds_id=?`;
    var data=await query1(sql,[title,desc,id]);
   // res.send(data);
   res.redirect('/admin/DentalSolutions'); 
})
router.get('/Blog',async(req,res)=>{
    var sql="select * from blog";
    var data=await query1(sql);
    res.render('admin/Blog.ejs',{data:data});
})
router.post('/Blog_save',async(req,res)=>{
  // res.send(req.body);
   var{bdate,btitle,bdesc}=req.body;
   //res.send(req.files);
   var fname=Date.now()+req.files.bphoto.name;
   var uploadpath=path.join(__dirname,'../','public/images/',fname);
   req.files.bphoto.mv(uploadpath);
  // res.send(uploadpath);
  var sql="Insert into blog(bdate,btitle,bdesc,bphoto)values(?,?,?,?)";
  var data=await query1(sql,[bdate,btitle,bdesc,fname]);
  //res.send(data);
   res.redirect('/admin/blog');
})
router.get('/blog_delete/:id/:img',async(req,res)=>{
    var id=req.params.id;
    var img=req.params.img;
    var imgpath=path.join(__dirname,'../','public/images/',img);
    fs.unlink(imgpath,(err)=>{});
    //res.send(imgpath);
    var sql="delete from blog where bid=?";
    var data=await query1(sql,[id]);
    res.redirect('/admin/blog');
})
router.get('/blog_edit/:id',async(req,res)=>{
    var id=req.params.id;
    var sql=`select * from blog where bid=? `;
    var data=await query1(sql,[id]);
    res.render('admin/blog_edit.ejs',{data:data[0]})
})
router.post('/Blog_edit_save/:id/:img',async(req,res)=>{
    var id=req.params.id;
    var img=req.params.img;
     var { bdate, btitle, bdesc } = req.body;
   // res.send(req.files);
   if(req.files){
        //res.send(req.files);
        var newimg=Date.now()+req.files.bphoto.name;
         var uploadpath=path.join(__dirname,'../','public/images/',newimg);
         req.files.bphoto.mv(uploadpath);
          var imgpath=path.join(__dirname,'../','public/images/',img);
          fs.unlink(imgpath,(err)=>{});
    }else{
       // res.send(req.body);
        var newimg=img;
    }
     var sql='update blog set bdate=?,btitle=?,bdesc=?,bphoto=? where bid=?';
     var data=await query1(sql,[bdate,btitle,bdesc,newimg,id]);
    res.redirect('/admin/blog');
})

router.get('/Appointment_pending',async(req,res)=>{
       var sql=`select * 
    from appointment_enquiry 
    LEFT JOIN service
     ON appointment_enquiry.service_id = service.sid where appointment_enquiry.status=? `
    //var sql=`select * from appointment_enquiry where status=? `;
    var data=await query1(sql,['pending']);
    res.render('admin/Appointment_pending.ejs',{data:data}) 
})
router.get('/ap_conf/:id',async(req,res)=>{
     var id=req.params.id;
    var sql=`update  appointment_enquiry set status=? where aid=?`;
    var data=await query1(sql,['confirm',id]);
   res.redirect('/admin/Appointment_pending'); 
})
router.get('/ap_rejct/:id',async(req,res)=>{
     var id=req.params.id;
    var sql=`update  appointment_enquiry set status=? where aid=?`;
    var data=await query1(sql,['reject',id]);
   res.redirect('/admin/Appointment_pending'); 
})
router.get('/Appointment_confirm',async(req,res)=>{
    var sql=`select * 
    from appointment_enquiry 
    LEFT JOIN service
     ON appointment_enquiry.service_id = service.sid where appointment_enquiry.status=? `
   // var sql=`select * from appointment_enquiry where status=? `;
    var data=await query1(sql,['confirm']);
    // res.send(data);
    res.render('admin/Appointment_confirm.ejs',{data:data}) 
})
router.get('/Appointment_reject',async(req,res)=>{
       var sql=`select * 
    from appointment_enquiry 
    LEFT JOIN service
     ON appointment_enquiry.service_id = service.sid where appointment_enquiry.status=? `
    //var sql=`select * from appointment_enquiry where status=? `;
    var data=await query1(sql,['reject']);
    res.render('admin/Appointment_reject.ejs',{data:data}) 
})
router.get('/Appointment_search',async(req,res)=>{
    //res.send(req.query);
    var from_date=req.query.from_date;
    var to_date=req.query.to_date;
    var status=req.query.status;
    var sql = `SELECT * FROM appointment_enquiry
           WHERE appointment_date BETWEEN ? AND ?
           AND status=?`;
    var data=await query1(sql,[from_date,to_date,status]);
    //res.send(data);
    res.render('admin/Appointment_pending.ejs',{data:data}) 
})



module.exports=router;