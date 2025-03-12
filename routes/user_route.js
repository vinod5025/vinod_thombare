var express=require("express");
var exe=require("./../conn");
var router=express.Router();
router.get("/",async function(req,res){
    var data=await exe(`SELECT * FROM home_page`);
    var about=await exe(`SELECT * FROM about_section`);
    var skills=await exe(`SELECT * FROM skills`);
    var intern_and_web_dev=await exe(`SELECT * FROM intern_and_web_dev`);
    var a2z_certificate=await exe(`SELECT * FROM a2z_certificate`);
    var project=await exe(`SELECT * FROM project_section`);
    var count=await exe(`SELECT * FROM  project_counts `);
    var client_list=await exe(`SELECT * FROM client_information`);
    var contact_self=await exe(`SELECT * FROM contact_myself`);
    var obj={"home":data[0],"about":about[0],"skills":skills,"intern_and_web_dev":intern_and_web_dev,"cert":a2z_certificate,"project":project,"count":count[0],"client_list":client_list,"contact_self":contact_self[0]};
    res.render("user/home.ejs",obj)
});
router.post("/contact_now", async function (req, res) {
   
        var d = req.body;
        var date = new Date().toISOString().slice(0, 10).split("-").reverse().join("-");
        var time = new Date().toLocaleTimeString();
        var sql = `INSERT INTO contact (name, email, mobile, subject, message, date, time) 
                   VALUES (?, ?, ?, ?, ?, ?, ?)`;
        await exe(sql, [d.name, d.email, d.mobile, d.subject, d.message, date, time]);
        res.redirect("/");
    
});

module.exports=router;