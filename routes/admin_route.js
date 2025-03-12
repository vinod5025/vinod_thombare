var express=require("express");
var exe=require("./../conn");
const { log } = require("util");
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
function checkLogin(req, res, next) {
    // req.session.admin_login_id=1;
    if (req.session.user_id == undefined) {
      res.redirect("/admin/admin_login");
    } else {
      next();
    }
  }
router.get("/logout_admin", function (req, res) {
    req.session.destroy(function (err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/admin/admin_login");
        }
    });
});

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
router.get("/manage_home_page",checkLogin,async function(req,res){
    var sql=`SELECT * FROM home_page `;
    var data=await exe(sql);
    var obj={"home":data[0]}
    res.render("admin/manage_home_page.ejs",obj)
})
// home page update
router.post("/update_home_page",checkLogin, async function (req, res) {
    var d = req.body;
    var file_name = "";
    function sanitizeInput(input) {
        return input ? input.replaceAll("'", "").replaceAll('"', "").trim() : null;
    }
    if (req.files && req.files.backgound_image) {
        file_name = new Date().getTime() + ".png";
        req.files.backgound_image.mv("public/uploads/" + file_name);
        var sql2 = `UPDATE home_page SET backgound_image = '${file_name}' WHERE user_id = 1`;
        await exe(sql2);
    }
    var sql = `UPDATE home_page SET 
        user_name_in_short = ${d.user_name_in_short ? `'${sanitizeInput(d.user_name_in_short)}'` : "NULL"}, 
        user_name = ${d.user_name ? `'${sanitizeInput(d.user_name)}'` : "NULL"},  
        position_1 = ${d.position_1 ? `'${sanitizeInput(d.position_1)}'` : "NULL"}, 
        position_2 = ${d.position_2 ? `'${sanitizeInput(d.position_2)}'` : "NULL"}, 
        position_3 = ${d.position_3 ? `'${sanitizeInput(d.position_3)}'` : "NULL"} 
    WHERE user_id = 1`;
    await exe(sql);
    res.redirect("/admin/manage_home_page");
});
// about section
router.get("/manage_about_page",checkLogin, async function(req, res) {
    var sql = `SELECT * FROM about_section`;
    var skill = `SELECT * FROM skills`;

    var data = await exe(sql);
    var skillsData = await exe(skill); 

    var obj = { "about": data[0], "skills": skillsData };
    res.render("admin/manage_about_page.ejs", obj);
});

router.post("/update_about", checkLogin,async (req, res) => {
    let d = req.body;
    let about_profile_name = d.about_profile_name.replaceAll("'", "''");
    let about_profile_position = d.about_profile_position.replaceAll("'", "''");
    let about_profile_email = d.about_profile_email.replaceAll("'", "''");
    let about_profile_mo = d.about_profile_mo.replaceAll("'", "''");
    let about_profile_summary = d.about_profile_summary.replaceAll("'", "''");
    let profile_photo = "";
    if (req.files && req.files.about_profile_photo) {
        let file = req.files.about_profile_photo;
        profile_photo = new Date().getTime() + "_" + file.name;
        file.mv("public/uploads/" + profile_photo);
    }
    let sql;
    if (profile_photo !== "") {
        sql = `UPDATE about_section SET 
            about_profile_name = '${about_profile_name}',
            about_profile_position = '${about_profile_position}',
            about_profile_email = '${about_profile_email}',
            about_profile_mo = '${about_profile_mo}',
            about_profile_summary = '${about_profile_summary}',
            about_profile_photo = '${profile_photo}'
            WHERE id = 1`;
    } else {
        sql = `UPDATE about_section SET 
            about_profile_name = '${about_profile_name}',
            about_profile_position = '${about_profile_position}',
            about_profile_email = '${about_profile_email}',
            about_profile_mo = '${about_profile_mo}',
            about_profile_summary = '${about_profile_summary}'
            WHERE id = 1`;
    }
    await exe(sql);
    res.redirect("/admin/manage_about_page");
});
// skill section
router.post("/add_skill",checkLogin, async(req, res) => {
    let d = req.body;
    let tech_name = d.tech_name.replaceAll("'", "''");
    let tech_range = d.tech_range.replaceAll("'", "''");
    let sql = `INSERT INTO skills (tech_name, tech_range) VALUES ('${tech_name}', '${tech_range}')`;
    var data=await exe(sql);
    res.redirect("/admin/manage_about_page");
});
// delete skill
router.get("/delete_skill/:id",checkLogin,async function(req,res){
var data=await exe(`DELETE FROM skills WHERE id='${req.params.id}'`);
res.redirect("/admin/manage_about_page")
});
// edit skill
router.get("/edit_skill/:id",checkLogin,async function(req,res){
    var data=await exe(`SELECT * FROM skills WHERE id ='${req.params.id}'`);
    res.render("admin/edit_skill.ejs",{"skills":data[0]});
});
router.post("/update_skill/:id",checkLogin,async function(req,res){
    var d=req.body;
    var sql=`UPDATE skills SET tech_name = ? , tech_range = ? WHERE id ='${req.params.id}'`;
    var data=await exe(sql,[d.tech_name,d.tech_range]);
    res.redirect("/admin/manage_about_page");
});
// edit skill end

// project section start
router.get("/project_section",checkLogin,async function(req,res){
    var data=await exe(`SELECT * FROM project_section`);
    res.render("admin/project_section.ejs",{projects:data});
});
router.post("/save_project",checkLogin, async function (req, res) {
    var d = req.body;
    var sql = `INSERT INTO project_section (project_link, project_name, project_description) VALUES (?, ?, ?)`;
    var data = await exe(sql, [d.project_link, d.project_name, d.project_description]);
    res.redirect("/admin/project_section");
});
router.get("/delete_project/:id",checkLogin, async function(req,res){
    var data=await exe(`DELETE FROM project_section WHERE id ='${req.params.id}'`);
    res.redirect("/admin/project_section");
})
// project section end

// couner sections start
router.post("/admin_update_count_of_down_of_project_secton", checkLogin,async (req, res) => {
    const {  project_completed, y_of_exp, total_clients } = req.body;
    const sql = "UPDATE project_counts SET project_completed = ?, years_of_experience = ?, total_clients = ? WHERE id = 1";
    await exe(sql, [project_completed, y_of_exp, total_clients]);
    res.redirect("/admin/project_section");
});
// couner sections end

// internship start
router.get("/internship",checkLogin,async function(req,res){
    var data=await exe(`SELECT * FROM intern_and_web_dev`);
    res.render("admin/internship.ejs",{"intern_and_web":data});
});

// Route to update certificates
router.post("/internship_and_web_dev_certificate",checkLogin, async function (req, res) {
    if (!req.files) {
        res.send("No files uploaded");
    } else {
        var internship_certificate = "";
        var web_developer_certificate = "";

        // Internship Certificate
        if (req.files.internship_certificate) {
            internship_certificate = new Date().getTime()+".png";
            req.files.internship_certificate.mv("public/uploads/" + internship_certificate);
        }

        // Web Developer Certificate
        if (req.files.web_developer_certificate) {
            web_developer_certificate =new Date().getTime()+".png";
            req.files.web_developer_certificate.mv("public/uploads/" + web_developer_certificate);
        }

        // Update record (Assuming only one record with ID = 1)
        var updateSQL = `UPDATE intern_and_web_dev SET 
            internship_certificate = ?, 
            web_developer_certificate = ? 
            WHERE id = 1`;  // Change ID based on your logic

        await exe(updateSQL, [internship_certificate, web_developer_certificate]);

        res.redirect("/admin/internship");
    }
});

// certificate start
router.post("/add_certificate",checkLogin,function(req,res){
    // console.log(req.files)
    var file_name="";
    if(req.files){
        file_name=new Date().getTime()+".png";
        req.files.certificate.mv("public/uploads/"+file_name);
        var sql=`INSERT INTO a2z_certificate(id INT PRIMARY KEY AUTO_INCREMENT, certificate TEXT ,tech_name TEXT )`
    }
});
router.get("/certificate_section",checkLogin,async function(req,res){
    var data=await exe(`SELECT * FROM a2z_certificate`)
    res.render("admin/certificate_section.ejs",{"certificate":data});
});
router.post("/save_all_certificates",checkLogin,async function(req,res){
    var d=req.body;
    var file_name=new Date().getTime()+".png";
    req.files.certificate.mv("public/uploads/"+file_name);
    var sql=`INSERT INTO a2z_certificate(certificate, tech_name) VALUES(?,?)`;
    var data=await exe(sql,[file_name,d.tech_name])
  res.redirect("/admin/certificate_section");
   
});
router.get("/delete_a2z_certificate/:id",checkLogin,async function(req,res){
    var data=await exe(`DELETE FROM a2z_certificate WHERE id ='${req.params.id}' `);
    res.redirect("/admin/certificate_section");
})
// certificate end








// router.post("/upload_certificate",async function(req,res){
//     var d=req.body;
//     var file_name="";
//     if(req.files){
//         file_name=new Date().getTime()+"png";
//         req.files.client_photo.mv("public/uploads/"+file_name);
//         var sql=`INSERT INTO client_information(client_photo  , client_name  , client_inform ) VALUES (?,?,?)`;
//         var data=await exe(sql,[file_name,d.client_name,d.client_inform]);
//     }
//     else{
//         var sql=`INSERT INTO client_information(client_photo  , client_name  , client_inform ) VALUES (?,?,?)`;
//         var data=await exe(sql,[file_name,d.client_name,d.client_inform]);
//     }
// })
router.get("/manage_certificate_page",checkLogin,async function(req,res){
    var sql=`SELECT * FROM certificate_page`;
    var data=await exe(sql);
    var obj={"certificate":data[0]}
    res.render("admin/manage_certificate_page.ejs",obj)
});
router.post("/update_certificate_page",checkLogin, async function(req,res){
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
    var sql=`SELECT * FROM project_section WHERE id =1`;
    var data=await exe(sql);
    // console.log(data);
    var obj={"project":data[0]}
    res.render("admin/manage_project_page.ejs",obj)
});
router.post("/update_project_page",checkLogin,async function(req,res){
    var d=req.body;
    var sql=`UPDATE  project_page SET project_page_description = '${d.project_page_description}', project_name_1 = '${d.project_name_1}', project_link_1 = '${d.project_link_1}' , project_desc_1  = '${d.project_desc_1}', project_name_2 = '${d.project_name_2}', project_link_2 = '${d.project_link_2}'  , project_desc_2  = '${d.project_desc_2}' , project_name_3 = '${d.project_name_3}', project_link_3  ='${d.project_link_3}' , project_desc_3 = '${d.project_desc_3}' , project_name_4 = '${d.project_name_4}', project_link_4  = '${d.project_link_4}' , project_desc_4 = '${d.project_desc_4}'  , project_name_5 = '${d.project_name_5}', project_link_5 = '${d.project_link_5}' , project_desc_5 = '${d.project_desc_5}' , project_name_6 = '${d.project_name_6}', project_link_6 = '${d.project_link_6}' , project_desc_6 =  '${d.project_desc_6}'`;
     var data=await exe(sql);
    // res.send(data);
    res.redirect("/admin/manage_project_page");
});
router.get("/counter_section_page",checkLogin,async function(req,res){
    var counter=await exe(`SELECT * FROM count_section WHERE user_id =1 `);
    var obj={"counter":counter[0]};
    // console.log(counter);
    res.render("admin/counter_section_page.ejs",obj);
});
router.post("/update_count_section",checkLogin,async function(req,res){
    var d=req.body;
    var sql=`UPDATE count_section SET  project_count = '${d.project_count}' , expe_count = '${d.expe_count}' , clients_count = '${d.clients_count}'`;
    var data=await exe(sql);
    // res.send(data);
    res.redirect("/admin/counter_section_page");
});
router.get("/manage_client_list",checkLogin,async function(req,res){
    var client_list=await exe(`SELECT * FROM client_information`);
    var obj={"client_list":client_list};
    res.render("admin/manage_client_list.ejs",obj);
});

router.post("/add_client",checkLogin, async function(req,res){
    var d=req.body;
    var file_name="";
    if(req.files){
        file_name=new Date().getTime()+"png";
        req.files.client_photo.mv("public/uploads/"+file_name);
        var sql=`INSERT INTO client_information(client_photo  , client_name  , client_inform ) VALUES (?,?,?)`;
        var data=await exe(sql,[file_name,d.client_name,d.client_inform]);
    }
    else{
        var sql=`INSERT INTO client_information(client_photo  , client_name  , client_inform ) VALUES (?,?,?)`;
        var data=await exe(sql,[file_name,d.client_name,d.client_inform]);
    }
    res.redirect("/admin/manage_client_list");
});
router.get("/delete_client/:id",checkLogin,async function(req,res){
    var data=await exe(`DELETE FROM client_information WHERE id ='${req.params.id}'`);
    res.redirect("/admin/manage_client_list")
})

router.get("/manage_contact_information",checkLogin,async function(req,res){
    var sql=`SELECT * FROM contact`;
    var data=await exe(sql);
    var obj={"contact":data};
    res.render("admin/manage_contact_information.ejs",obj);
});
router.get("/delete_contact_inquiry/:id",checkLogin,async function(req,res){
    var sql=`DELETE FROM contact WHERE user_id ='${req.params.id}'`;
    var data=await exe(sql);
    res.redirect("/admin/manage_contact_information")
});
router.get("/manage_myself_contact",checkLogin,async function(req,res){
    var contact_myself=await exe(`SELECT * FROM contact_myself`);
    var obj={"contact_myself":contact_myself[0]};
    res.render("admin/manage_myself_contact.ejs",obj);
});
router.post("/update_myself_information",checkLogin,async function(req,res){
    var d=req.body;
    var sql=`UPDATE contact_myself SET description = '${d.description}', location = '${d.location}', mobile = '${d.mobile}' , email = '${d.email}', facebook_link = '${d.facebook_link}' , instagram_id = '${d.instagram_id}', whatsapp_link = '${d.whatsapp_link}' , linked_in_link = '${d.linked_in_link}'`;
    var data=await exe(sql);
    res.redirect("/admin/manage_myself_contact");

})
module.exports=router;