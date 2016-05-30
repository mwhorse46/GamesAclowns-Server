/**
 * Created by anooj on 30/05/16.
 */
$('document').ready(function () {


    $.ajax({
        url:'/fetchimage',
        type:'GET',
        success:function (stat) {
            console.log(stat)
            setGallery(stat)
        }
    });


    function setGallery(imageArray) {

        var male    =   0, female   =   0;
        for(var i=0;i<imageArray.length;i++){

            var gender  =   imageArray[i].gender==1 ? "Male":"Female";

            if(imageArray[i].gender == 1){
                male++;
            }else{
                female++;
            }
            var form    =   "<tr>"+
                "<td>"+(i+1)+"</td>"+
                "<td><img src='http://games.angryclowns.com/images/"+imageArray[i].image+"' width='100px' height='100px'></td>"+
                "<td>"+imageArray[i].dialogue+"</td>"+
                "<td>"+gender+"</td>"+
                "<td>"+imageArray[i].username+"</td>"+
                "</tr>";
            $("#table_container").append(form);
        }

        $("#count_").text("MALE: "+male+" , FEMALE: "+female)
    }
});