var express=require("express");
var exe=require("./../conn");
var router=express.Router();
router.get("/",async function(req,res){
    var data=await exe(`SELECT * FROM home_page`);
    var about=await exe(`SELECT * FROM about_page`);
    var certificate=await exe(`SELECT * FROM certificate_page`);
    var project=await exe(`SELECT * FROM project_page`);
    var count=await exe(`SELECT * FROM  count_section `);
    var client_list=await exe(`SELECT * FROM client_list`);
    var contact_self=await exe(`SELECT * FROM contact_myself`);
    var obj={"home":data[0],"about":about[0],"certificate":certificate[0],"project":project[0],"count":count[0],"client_list":client_list[0],"contact_self":contact_self[0]};
    // res.send(data)
    res.render("user/home.ejs",obj)
});
router.post("/contact_now",async function(req,res){
    var d=req.body;
    var date=new Date().toISOString().slice(0,10).split("-").reverse().join("-");
    var sql=`INSERT INTO contact( name  , email , mobile , subject , message , date ) VALUES ('${d.name}' , '${d.email}' , '${d.mobile}' ,'${d.subject}' , '${d.message}', '${date}')`;
    var data=await exe(sql);
    // res.send(data)
    res.redirect("/");
})
module.exports=router;