$('document').ready(function () {


    var imageUploadTapped   =   false;

    $("#fileInput").change(function () {
        imageUploadTapped   =   true;
    });
    $("#upload").click(function () {
        ImageUpload("fileInput",function (err, data) {
            //alert(data)
            if(!err) {
                var dialog  =   $("#dialogueInput").val();
                var image   =   data;
                var gender  =   $("input[name=gender]:checked").val();
                var data    =   {
                    image   :   image,
                    dialog  :   dialog,
                    gender  :   gender
                };

                $.ajax({
                    url     :   '/insertimage',
                    type    :   'POST',
                    data    :   data,
                    success :   function (success) {
                        console.log(success)
                        if(success != false) {
                            alert("Success");
                            window.location.replace('/uploader');
                        }
                        else
                            alert("Failed")
                    }
                });

            }else{
                alert("Failed to upload");
            }
        });


    });

    $("#login").click(function () {

        var username    =   $("#username").val();
        var pass        =   $("#password").val();

        if(username != "" && pass != ""){
            $.ajax({
               url:'/login/admin',
               type:'POST',
                data:{
                    username:username,
                    password:pass
                },
                success:function (data) {
                    window.location.reload('/angryadmin')
                }
            });
        }
    });


    function ImageUpload(imageId, callback) {
        if (imageUploadTapped == true) {
            ImageUploadData = new FormData();
            jQuery.each(jQuery('#' + imageId)[0].files, function (i, file) {
                ImageUploadData.append('file-' + i, file);
            });
            $.ajax({
                url: '/imageUpload',
                data: ImageUploadData,
                cache: false,
                processData: false,
                contentType: false,
                type: 'POST',
                success: function (data, status, req) {
                    imageUploadTapped = false;
                    if(data == "session"){
                        window.location.replace('/angryadmin');
                    }
                    callback(false, data);
                },
                error: function (req, status, error) {
                    imageUploadTapped = false;
                    callback(true, error);
                }
            });
        } else {
            callback(true, false);
        }
    }

});