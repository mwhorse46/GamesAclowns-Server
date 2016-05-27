$('document').ready(function () {


    window.fbAsyncInit = function () {
        FB.init({
            appId: '1635446443444270',
            xfbml: true,
            version: 'v2.5'
        });
    };
    (function (d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {
            return;
        }
        js = d.createElement(s);
        js.id = id;
        js.src = "https://connect.facebook.net/en_us/all.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
    
    function postToFeed(title, desc, url, image){
        var obj = {method: 'feed',link: url, picture: image,name: title,description: desc};
        function callback(response){}
        FB.ui(obj, callback);
    }
    function scrapeLink(url){
        var masterdfd = $.Deferred();
        FB.api('https://graph.facebook.com/', 'post', {
            id: [url],
            scrape: true
        }, function(response) {
            console.log(response)
            if(!response || response.error){
                masterdfd.reject(response);
            }else{
                masterdfd.resolve(response);
            }
        });
        return masterdfd;
    }


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

    var url_to_scrap    =   $("#storage").attr('url');
    var img_url_scrap   =   $("#storage_image").attr('url');
    console.log(url_to_scrap);
    console.log(img_url_scrap);

    if(url_to_scrap != "" && url_to_scrap != undefined){
        // $.post(
        //     'https://graph.facebook.com/989506491086988',
        //     {
        //         id: url_to_scrap,
        //         scrape: true
        //     },
        //     function(response){
        //         console.log("SCRAP")
        //         console.log(response);
        //     }
        // );
        scrapeLink(url_to_scrap);
        scrapeLink(img_url_scrap)
    }


    $('.btnShare').click(function(){
        elem = $(this);
        postToFeed(elem.data('title'), elem.data('desc'), elem.prop('href'), elem.data('image'));

        return false;
    });
    $('#go-to-app').click(function(){
    //$("body").on('click','#',function (e) {
        window.location.replace('/dash');
    });

    //$("#goto").click(function () {
        //alert("hh")

        // setTimeout(function () {
        //     $('html, body').animate({
        //         scrollTop: $("#app-section").offset().top
        //     }, 800);
        // },5000)

    //});



});