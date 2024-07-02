var express=require("express");
var exe=require("./../conn");
var router=express.Router();
router.get("/admin_login",function(req,res){
    res.render("admin/admin_login.ejs");
})
router.get("/",function(req,res){
    if(req.session.user_id == undefined){
        res.redirect("/admin/admin_login");
    }
    else{
    res.render("admin/home.ejs");
    }
});
router.get('/logout',  function (req, res, next)  {
    if (req.session) {
      req.session.destroy(function (err) {
        if (err) {
          return next(err);
        } else {
          return res.redirect('/admin/admin_login');
        }
      });
    }
});
function checklogin(req, res, next) 
{
    if(req.session.user_id != undefined)
        next();
    else 
        res.send("<script> alert('Invalid Login');location.href='/admin/admin_login';</script>")        
}
router.post("/admin_process",async function(req,res){
    var d=req.body;
    var sql=`SELECT * FROM admin_login WHERE username = '${d.username}' AND  password = '${d.password}'`;
    var data=await exe(sql);
    if(data.length > 0)
        {   var id=data[0].user_id;
            req.session.user_id= id;
            res.redirect("/admin")
        }
     else{
        res.redirect("/admin/admin_login");
     
     }   
})
router.get("/manage_home_page",checklogin,async function(req,res){
    var sql=`SELECT * FROM home_page `;
    var data=await exe(sql);
    var obj={"home":data[0]}
    res.render("admin/manage_home_page.ejs",obj)
})
router.post("/update_home_page",async function(req,res){
    var d=req.body;
    if(req.files)
    {
    var file_name=new Date().getTime()+".png";
    req.files.backgound_image.mv("public/uploads/"+file_name);
    var sql2=`UPDATE home_page SET backgound_image = '${file_name}' WHERE user_id = 1`;
    var data = await exe(sql2);
    }
    else
    {
    var sql=`UPDATE home_page SET user_name_in_short = '${d.user_name_in_short}' , user_name = '${d.user_name}'  , position_1 = '${d.position_1}' , position_2 = '${d.position_2}' , position_3 = '${d.position_3}'WHERE user_id = 1 `;

    var data=await exe(sql);
    }
    res.redirect("/admin/manage_home_page")
});
router.get("/manage_about_page",checklogin,async function(req,res){
    var sql=`SELECT * FROM about_page`;
    var data=await exe(sql);
    var obj={"about":data[0]};
    res.render("admin/manage_about_page.ejs",obj)
});
router.post("/update_about_page",async function(req,res){
    var d=req.body;
    if(req.files)
        {
        var file_name=new Date().getTime()+".png";
        req.files.profile_photo.mv("public/uploads/"+file_name);
        var sql2=`UPDATE about_page SET profile_photo = '${file_name}' WHERE user_id = 1`;
        var data = await exe(sql2);
        }
        else
        {
        var sql=`UPDATE about_page SET  profile_name = '${d.profile_name}' , profile_position = '${d.profile_position}' , profile_email = '${d.profile_email}' , profile_phone = '${d.profile_phone}' , skill_persentage_html = '${d.skill_persentage_html}', skill_persentage_css = '${d.skill_persentage_css}' ,skill_persentage_bootstrap = '${d.skill_persentage_bootstrap}' , skill_persentage_javascript = '${d.skill_persentage_javascript}', skill_persentage_jquery = '${d.skill_persentage_jquery}', skill_persentage_angular = '${d.skill_persentage_angular}', skill_persentage_ionic = '${d.skill_persentage_ionic}' ,skill_persentage_node_express = '${d.skill_persentage_node_express}' , skill_persentage_mysql = '${d.skill_persentage_mysql}' , profile_user_desc  = '${d.profile_user_desc}'  WHERE user_id = 1 `;

        }
    var data=await exe(sql);
    // res.send(data);
    res.redirect("/admin/manage_about_page")
});
router.get("/manage_certificate_page",checklogin,async function(req,res){
    var sql=`SELECT * FROM certificate_page`;
    var data=await exe(sql);
    var obj={"certificate":data[0]}
    res.render("admin/manage_certificate_page.ejs",obj)
});
router.post("/update_certificate_page",checklogin, async function(req,res){
    var d=req.body;
    if(req.files)
    {
        var file_name=new Date().getTime()+".png";
        req.files.certificate_photo_1.mv("public/uploads/"+file_name);
        var sql2=`UPDATE certificate_page SET certificate_photo_1 = '${file_name}' WHERE user_id = 1`;
        var data = await exe(sql2);
    }
    {
        var file_name=new Date().getTime()+".png";
        req.files.certificate_photo_2.mv("public/uploads/"+file_name);
        var sql2=`UPDATE certificate_page SET certificate_photo_2 = '${file_name}' WHERE user_id = 1`;
        var data = await exe(sql2);
    }
    {
        var file_name=new Date().getTime()+".png";
        req.files.certificate_photo_3.mv("public/uploads/"+file_name);
        var sql2=`UPDATE certificate_page SET certificate_photo_3 = '${file_name}' WHERE user_id = 1`;
        var data = await exe(sql2);
    }
    {
        var file_name=new Date().getTime()+".png";
        req.files.certificate_photo_4.mv("public/uploads/"+file_name);
        var sql2=`UPDATE certificate_page SET certificate_photo_4 = '${file_name}' WHERE user_id = 1`;
        var data = await exe(sql2);
    }
    {
        var file_name=new Date().getTime()+".png";
        req.files.certificate_photo_5.mv("public/uploads/"+file_name);
        var sql2=`UPDATE certificate_page SET certificate_photo_5 = '${file_name}' WHERE user_id = 1`;
        var data = await exe(sql2);
    }
    {
        var file_name=new Date().getTime()+".png";
        req.files.certificate_photo_6.mv("public/uploads/"+file_name);
        var sql2=`UPDATE certificate_page SET certificate_photo_6 = '${file_name}' WHERE user_id = 1`;
        var data = await exe(sql2);
    }
    {
        var file_name=new Date().getTime()+".png";
        req.files.certificate_photo_7.mv("public/uploads/"+file_name);
        var sql2=`UPDATE certificate_page SET certificate_photo_7 = '${file_name}' WHERE user_id = 1`;
        var data = await exe(sql2);
    }
    {
        var file_name=new Date().getTime()+".png";
        req.files.certificate_photo_8.mv("public/uploads/"+file_name);
        var sql2=`UPDATE certificate_page SET certificate_photo_8 = '${file_name}' WHERE user_id = 1`;
        var data = await exe(sql2);
    }
    {
        var file_name=new Date().getTime()+".png";
        req.files.certificate_photo_9.mv("public/uploads/"+file_name);
        var sql2=`UPDATE certificate_page SET certificate_photo_9 = '${file_name}' WHERE user_id = 1`;
        var data = await exe(sql2);
    }
    {
        var file_name=new Date().getTime()+".png";
        req.files.certificate_photo_10.mv("public/uploads/"+file_name);
        var sql2=`UPDATE certificate_page SET certificate_photo_10 = '${file_name}' WHERE user_id = 1`;
        var data = await exe(sql2);
    }
    {
        var file_name=new Date().getTime()+".png";
        req.files.certificate_photo_11.mv("public/uploads/"+file_name);
        var sql2=`UPDATE certificate_page SET certificate_photo_11 = '${file_name}' WHERE user_id = 1`;
        var data = await exe(sql2);
    }
    {
        var file_name=new Date().getTime()+".png";
        req.files.certificate_photo_12.mv("public/uploads/"+file_name);
        var sql2=`UPDATE certificate_page SET certificate_photo_12 = '${file_name}' WHERE user_id =
        1`;
        var data = await exe(sql2);
    }

    var sql=`UPDATE certificate_page SET  certi_desc = '${d.certi_desc}', certificate_name_1 = '${d.certificate_name_1}' , certificate_date_1  = '${d.certificate_date_1}' ,    certificate_name_2 = '${d.certificate_name_2}' , certificate_date_2  = '${d.certificate_date_2}' , certificate_name_3 = '${d.certificate_name_3}', certificate_date_3 = '${d.certificate_date_3}' ,   certificate_name_4 = '${d.certificate_name_4}' , certificate_date_4  = '${d.certificate_date_4}' , certificate_name_5 = '${d.certificate_name_5}' , certificate_date_5 = '${d.certificate_date_5}' ,certificate_name_6  = '${d.certificate_name_6}', certificate_date_6 = '${d.certificate_date_6}' , certificate_name_7 = '${d.certificate_name_7}' , certificate_date_7 = '${d.certificate_date_7}' , certificate_name_8 = '${d.certificate_name_8}' , certificate_date_8 = '${d.certificate_date_8}' , certificate_name_9  = '${d.certificate_name_9}', certificate_date_9 = '${d.certificate_date_9}' , certificate_name_10  = '${d.certificate_name_10}', certificate_date_10 = '${d.certificate_date_10}' ,    certificate_name_11 = '${d.certificate_name_11}' , certificate_date_11 = '${d.certificate_date_11}' ,    certificate_name_12  = '${d.certificate_name_12}', certificate_date_12 = '${d.certificate_date_12}'`;
    var data=await exe(sql);
    // res.send(data);
    res.redirect("/admin/manage_certificate_page")
});
router.get("/manage_project_page",async function(req,res){
    var sql=`SELECT * FROM project_page WHERE user_id =1`;
    var data=await exe(sql);
    // console.log(data);
    var obj={"project":data[0]}
    res.render("admin/manage_project_page.ejs",obj)
});
router.post("/update_project_page",async function(req,res){
    var d=req.body;
    var sql=`UPDATE  project_page SET project_page_description = '${d.project_page_description}', project_name_1 = '${d.project_name_1}', project_link_1 = '${d.project_link_1}' , project_desc_1  = '${d.project_desc_1}', project_name_2 = '${d.project_name_2}', project_link_2 = '${d.project_link_2}'  , project_desc_2  = '${d.project_desc_2}' , project_name_3 = '${d.project_name_3}', project_link_3  ='${d.project_link_3}' , project_desc_3 = '${d.project_desc_3}' , project_name_4 = '${d.project_name_4}', project_link_4  = '${d.project_link_4}' , project_desc_4 = '${d.project_desc_4}'  , project_name_5 = '${d.project_name_5}', project_link_5 = '${d.project_link_5}' , project_desc_5 = '${d.project_desc_5}' , project_name_6 = '${d.project_name_6}', project_link_6 = '${d.project_link_6}' , project_desc_6 =  '${d.project_desc_6}'`;
     var data=await exe(sql);
    // res.send(data);
    res.redirect("/admin/manage_project_page");
});
router.get("/counter_section_page",async function(req,res){
    var counter=await exe(`SELECT * FROM count_section WHERE user_id =1 `);
    var obj={"counter":counter[0]};
    // console.log(counter);
    res.render("admin/counter_section_page.ejs",obj);
});
router.post("/update_count_section",async function(req,res){
    var d=req.body;
    var sql=`UPDATE count_section SET  project_count = '${d.project_count}' , expe_count = '${d.expe_count}' , clients_count = '${d.clients_count}'`;
    var data=await exe(sql);
    // res.send(data);
    res.redirect("/admin/counter_section_page");
});
router.get("/manage_client_list",async function(req,res){
    var client_list=await exe(`SELECT * FROM client_list WHERE user_id =1`);
    var obj={"client_list":client_list[0]};
    res.render("admin/manage_client_list.ejs",obj);
});
router.post("/update_client_list",async function(req,res){
    var d=req.body;
    if(req.files)
        {
        var file_name=new Date().getTime()+".png";
        req.files.client_photo_1.mv("public/uploads/"+file_name);
        var sql2=`UPDATE client_list SET client_photo_1 = '${file_name}' WHERE user_id = 1`;
        var data = await exe(sql2);
        }
        {
            var file_name=new Date().getTime()+".png";
            req.files.client_photo_2.mv("public/uploads/"+file_name);
            var sql2=`UPDATE client_list SET client_photo_2 = '${file_name}' WHERE user_id = 1`;
            var data = await exe(sql2);
            }
    var sql=`UPDATE  client_list SET  client_name_1 ='${d.client_name_1}', client_inform_1 = '${d.client_inform_1}' , client_name_2 = '${d.client_name_2}' , client_inform_2  = '${d.client_inform_2}' WHERE user_id = 1`;
    var data=await exe(sql);
    // res.send(data)
    // console.log(data)
    res.redirect("/admin/manage_client_list");
});
router.get("/manage_contact_information",async function(req,res){
    var sql=`SELECT * FROM contact`;
    var data=await exe(sql);
    var obj={"contact":data};
    res.render("admin/manage_contact_information.ejs",obj);
});
router.get("/delete_contact_inquiry/:id",async function(req,res){
    var sql=`DELETE FROM contact WHERE user_id ='${req.params.id}'`;
    var data=await exe(sql);
    res.redirect("/admin/manage_contact_information")
});
router.get("/manage_myself_contact",async function(req,res){
    var contact_myself=await exe(`SELECT * FROM contact_myself`);
    var obj={"contact_myself":contact_myself[0]};
    res.render("admin/manage_myself_contact.ejs",obj);
});
router.post("/update_myself_information",async function(req,res){
    var d=req.body;
    var sql=`UPDATE contact_myself SET description = '${d.description}', location = '${d.location}', mobile = '${d.mobile}' , email = '${d.email}', facebook_link = '${d.facebook_link}' , instagram_id = '${d.instagram_id}', whatsapp_link = '${d.whatsapp_link}' , linked_in_link = '${d.linked_in_link}'`;
    var data=await exe(sql);
    res.redirect("/admin/manage_myself_contact");

})
module.exports=router;