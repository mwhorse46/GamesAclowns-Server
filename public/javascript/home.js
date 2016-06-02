var logger = function()
{
    var oldConsoleLog = null;
    var pub = {};

    pub.enableLogger =  function enableLogger()
    {
        if(oldConsoleLog == null)
            return;

        window['console']['log'] = oldConsoleLog;
    };

    pub.disableLogger = function disableLogger()
    {
        oldConsoleLog = console.log;
        window['console']['log'] = function() {};
    };

    return pub;
}();

$('document').ready(function () {

    console.log("Please stop.");
    console.log("This is a browser feature intended for developers.");
    console.log("Please contact CollaborativeClouds Ltd for further information");
    logger.disableLogger();

    document.onmousedown=disableclick;
    function disableclick(event)
    {
        if(event.button==2){
            return false;
        }
    }


    $("#progress").hide();
    var url      = window.location.href;
    if(url.indexOf("choosed/reaction/") == -1 && url.indexOf("angryadmin") == -1 && url.indexOf("uploader") == -1) {
        FB.init({
            appId: '1059351237466429',
            version: 'v2.6',
            xfbml: true
        });
    }
    function postToFeed(title, desc, url, image){

        FB.init({
            appId: '1059351237466429',
            version    : 'v2.6',
            xfbml: true
        });

        var obj = {method: 'feed',link: url, picture: image,name: title,description: desc};
        function callback(response){
            console.log(response)
        }
        FB.ui(obj, callback);
    }


    var imageUploadTapped   =   false;

    $("#fileInput").change(function () {
        imageUploadTapped   =   true;
    });
    $("#upload").click(function () {
        $("#progress").show();
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
                        $("#progress").hide();
                        if(success != false) {
                            alert("Success");
                            window.location.replace('/admin/uploader');
                        }
                        else
                            alert("Failed")
                    }
                });

            }else{
                alert("Failed to upload");
                $("#progress").hide();
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

    $('.btnShare').click(function(){
        elem = $(this);
        var choice  =   $("#cache_choice").attr("choice");
        //alert(choice)
        $.ajax({
            url:'/hitshare',
            type:'POST',
            data:{choiceid:choice},
            success:function (data) {

            }
        });
        postToFeed(elem.data('title'), elem.data('desc'), elem.prop('href'), elem.data('image'));

        return false;
    });
    $('#go-to-app').click(function(){
        window.location.replace('/dash');
    });

    var url_      = window.location.href;


    if(url_.indexOf("/choosed/reaction" != -1))
    {

        var img_src =   $("#image_other").attr("src");
        //alert(img_src)
        checkImage(img_src);
    }
    function checkImage(src) {
        // if(url_.indexOf("/choosed/reaction" != -1))
        // {
            var img = new Image();
            img.onload = function () {

            };
            img.onerror = function () {

                $("#image_other").attr("src","http://games.angryclowns.com/images/default.jpg")
            };
        //}

        img.src = src; // fires off loading of image
    }




});