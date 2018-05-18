// Write your Javascript code.
$(function () {
    $("#search-btn").on("click", function (e) {
        // var url = $("#search-input").val() || "";
        // var keyword = $("#keyword-input").val() || "";
        // var method = $("#crawl-dropdownMenuButton").attr("data-selected") || "";
        // var limit = $("#limit-dropdownMenuButton").attr("data-selected") || 0;
        // var queryStr = "?url=" + url + "&keyword=" + keyword + "&method=" + method.toLowerCase() + "&limit=" + limit;
        // window.location.href = "/results" + queryStr;

        var url = $("#search-input").val() || "";
        var keyword = $("#keyword-input").val() || "";
        var ac;    
        document.cookie = url + "=" + keyword + ";";
            

        return false;
    });

    $("#crawl-dd-menu a").click(function (e) {
        //do something
        e.preventDefault();
        var selectedText = $(this).text();
        changeSelectedText("#crawl-dropdownMenuButton", selectedText);
        changeSelectedText("#limit-dropdownMenuButton", "Limit");
        if (selectedText.toLowerCase() == "breadth-first") {
            createLimitDDitem(2);
        } else {
            createLimitDDitem(10);
        }
    });
    
});
$(function (){
    var data = [];
    var data2 = [];
    var cookies = document.cookie;
    cookies = cookies.replace(/=/g, " ");
    cookies = cookies.replace(/;/g, "");
    cookies = cookies.split(" ");
    
    var i;
    for(i = 0; i < cookies.length; i=i+2){
        data.push(cookies[i]);
    }
    var j;
    for(j = 1; j < cookies.length; j=j+2){
        data2.push(cookies[j]);
    }
    console.log(data.length);
    $("#search-input").autocomplete({
        source: data,
        minLength: 0
    });
    $("#keyword-input").autocomplete({
        source: data2,
        minLength: 0
    });
    $("#search-input").click(function(e){
        if(cookies.length > 1){
            $("#search-input").autocomplete( "search", "" );
        }else{
            e.preventDefault();
        }
    });
    $("#keyword-input").click(function(e){
        if(cookies.length > 1){
            $("#keyword-input").autocomplete( "search", "" );
        }else{
            e.preventDefault();
        }
    }); 
});

function createLimitDDitem(len) {
    var items = "";
    var aEle;
    var i;
    for (i = 0; i < len; i++) {
        
        aEle = $("<a>").attr({
            "class": "dropdown-item",
            "href": "#"
        }).text(i + 1);
        items += aEle[0].outerHTML;
    }
    aEle = "";
    $("#limit-ctn").find(".dropdown-menu").html(items);

    $("#limit-dd-menu a").off("click").on("click", function (e) {
        //do something
        e.preventDefault();
        var selectedText = $(this).text();
        changeSelectedText("#limit-dropdownMenuButton", selectedText);
    });
}

function changeSelectedText(id, text) {
    $(id).text(text).attr("data-selected", text);
}