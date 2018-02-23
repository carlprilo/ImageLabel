var editMode = false; //check whether deleted or not
var oldX = new Array();  //four dots of box
var oldY = new Array();
var newX = new Array();
var newY = new Array();
var enable = new Array();
var pure_name_g;        //name of image without suffix
var changed = false;
var w_g; //image width
var h_g;  //image height
var label_g = new Array();
var label_num=0;
var xml_content=null;
var pathGlobal = null;

function checkMouse(ev) {
    if (!editMode)
        return;

    oldX.push(ev.offsetX);
    oldY.push(ev.offsetY);
}

function draw(ev) {
    if(!editMode)
        return;

    newX.push(ev.offsetX);
    newY.push(ev.offsetY);
    enable.push(true);
    var canvas = document.getElementById("canvas_"+label_num);
    var ctx = canvas.getContext('2d');
    ctx.strokeStyle="green";
    ctx.strokeRect(oldX[oldX.length-1],oldY[oldY.length-1],newX[newX.length -1]-oldX[oldX.length-1],newY[newY.length-1]-oldY[oldY.length-1]);
    changed=true;
}

function draw_rect(name,xmin,ymin,xmax,ymax) {
    var canvas = document.getElementById("canvas_"+label_num);
    var ctx = canvas.getContext('2d');
    ctx.strokeStyle = "orange";
    ctx.strokeRect(xmin,ymin,xmax-xmin,ymax-ymin);
    console.log(name.toString());
}


function showCoordinates(evt) {
    var p = document.getElementById('cood');
    if (evt.offsetX > w_g)
        return;
    p.innerHTML = "x:"+evt.offsetX+"\n"+ "y:"+evt.offsetY+"\n";
}

function changeEditMode() {
    editMode = !editMode;
    var edit_button;
    if(editMode) {
        edit_button = document.getElementById("create_button");
        edit_button.src="icons/quit.png";
        addDivOnImage();
    } else {
        edit_button = document.getElementById("create_button");
        edit_button.src="icons/objects.png";
    }
}

function addDivOnImage() {
    label_num += 1;
    var new_div = document.createElement("div");
    var new_canvas = document.createElement("canvas");
    var base_div = document.getElementById("main")
    new_div.id="label_"+label_num;
    new_div.style.cssText = "width:max-content;height:max-content;position:absolute;left:150px;opacity:1";
    new_canvas.id="canvas_"+label_num;
    new_canvas.width=w_g;
    new_canvas.height=h_g;
    new_canvas.addEventListener("mousemove",showCoordinates,false);
    new_canvas.addEventListener("mousedown",checkMouse,false);
    new_canvas.addEventListener("mouseup",draw,false);
    new_div.appendChild(new_canvas);
    var canvas = document.getElementById("canvas_"+label_num);
    base_div.appendChild(new_div);
}

function hideDraw() {
    for(var i=1;i<=label_num;i++) {
        var sub_c = document.getElementById("canvas_"+i);
        sub_c.hidden=true;
    }
}

function showDraw() {
   var test = oldX.length;
   if(test>0){
       for(var i=1;i<=label_num;i++) {
       var sub_c = document.getElementById("canvas_"+i);
       sub_c.hidden=false;
       }
   }
    else
        alert("没有绘制");
}


function praseXML(xmlDoc) {
    for(var i = 0;i<xmlDoc.getElementsByTagName("name").length;i++) {

        var label_name = xmlDoc.getElementsByTagName("name")[i].childNodes[0].nodeValue;
        var x_min = xmlDoc.getElementsByTagName("xmin")[i].childNodes[0].nodeValue;
        var y_min = xmlDoc.getElementsByTagName("ymin")[i].childNodes[0].nodeValue;
        var x_max = xmlDoc.getElementsByTagName("xmax")[i].childNodes[0].nodeValue;
        var y_max = xmlDoc.getElementsByTagName("ymax")[i].childNodes[0].nodeValue;
        oldX.push(x_min);
        oldY.push(y_min);
        newX.push(x_max);
        newY.push(y_max);
        label_g.push(label_name);
        enable.push(true);
        changeEditMode();
        var canvas = document.getElementById("canvas_" + label_num);
        var ctx_sub = canvas.getContext('2d');
        ctx_sub.font = "24px serif";
        ctx_sub.fillText(label_name+"["+label_num+"]", x_max, y_min);
        draw_rect(label_name, x_min, y_min, x_max, y_max);
        changeEditMode();
    }
}

function genXML() {
    if(!changed){
        alert("Not changed!");
        return;
    }
    else {
        if (window.XMLHttpRequest)
        {// code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp=new XMLHttpRequest();
        }
        else
        {// code for IE6, IE5
            xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
        }

        xmlhttp.open("GET","index.xml",false);
        xmlhttp.send();
        xmldoc=xmlhttp.responseXML;

        var root = xmldoc.documentElement;
        var filename = xmldoc.createElement("filename");
        var filenameTxt = xmldoc.createTextNode(pure_name_g);
        filename.appendChild(filenameTxt);

        var size = xmldoc.createElement("size");
        var width = xmldoc.createElement("width");
        var widthTxt = xmldoc.createTextNode(w_g);
        var height = xmldoc.createElement("height");
        var heightTxt = xmldoc.createTextNode(h_g);
        width.appendChild(widthTxt);
        height.appendChild(heightTxt);
        size.appendChild(width);
        size.appendChild(height);

        var object = xmldoc.createElement("object");
        for(var i=0;i<label_num;i++) {
            if(!enable[i])
                continue;
            var name = xmldoc.createElement("name");
            var nameTxt = xmldoc.createTextNode(label_g[i].toString());
            name.appendChild(nameTxt);
            var box = xmldoc.createElement("box");
            var xmin = xmldoc.createElement("xmin");
            var xminTxt = xmldoc.createTextNode(oldX[i].toString());
            var xmax = xmldoc.createElement("xmax");
            var xmaxTxt = xmldoc.createTextNode(newX[i].toString());
            var ymin = xmldoc.createElement("ymin");
            var yminTxt = xmldoc.createTextNode(oldY[i].toString());
            var ymax = xmldoc.createElement("ymax");
            var ymaxTxt = xmldoc.createTextNode(newY[i].toString());
            xmin.appendChild(xminTxt);
            xmax.appendChild(xmaxTxt);
            ymin.appendChild(yminTxt);
            ymax.appendChild(ymaxTxt);
            box.appendChild(xmin);
            box.appendChild(ymin);
            box.appendChild(xmax);
            box.appendChild(ymax);
            object.appendChild(name);
            object.appendChild(box);
        }
        root.appendChild(filename);
        root.appendChild(size);
        root.appendChild(object);
        console.log(root.outerHTML.toString());
        xml_content = root.outerHTML.toString();
        console.log(root);

        $.post("hello",{"type":"saveXml","path":pathGlobal,"xml_content":xml_content},
        function (data) {
            console.log(data);
            if("success!" !== data)
                alert("Fail!");
            else
                alert("Success!");
        });
    }
}

function addLabel() {
    var input = document.getElementById("input_label");
    label_g.push(input.value);
    var canvas = document.getElementById("canvas_"+label_num);
    console.log(label_num);
    console.log(label_g);
    console.log(newX+" "+oldY);
    var ctx_sub = canvas.getContext('2d');
    ctx_sub.font="24px serif";
    if(newX[label_num-1]+5<=w_g)
        ctx_sub.fillText(label_g[label_num-1]+"["+label_num+"]",newX[label_num-1]+5,oldY[label_num-1],50);
    else
        ctx_sub.fillText(label_g[label_num-1]+"["+label_num+"]",newX[label_num-1]-50,oldY[label_num-1],50)
}



function readFilelist() {
    console.log("read many files!");
    path = prompt("请输入路径","192.168.1.203:9000:/Output/image/");
    if(path == null)
        alert("请输入路径！(host:port:path)");
    else {
        $.post("hello",{"type":"readDir","path":path},function (data) {
            console.log(data);
        });
    }
}

function readImage() {
    console.log("read image");
    path = prompt("请输入图片路径以及文件名","192.168.1.203:9000:/Output/image/index.jpg");
    if(path == null)
        alert("请输入地址！(host:port:path)");
    else{
        pathGlobal = path;
        console.log(path);
        $.get("hello",{"type":"readImage","path":path},
            function (data) {
                console.log(data);
                clearCanvas();      //initialize canvas before loading new image
                initVar();          //initialize variables before loading new images

                var c = document.getElementById("main_canvas");
                var ctx = c.getContext("2d");
                ctx.clearRect(0,0,c.width,c.height);
                var img =new Image();
                img.onload = function () {
                    c.height=img.height;
                    c.width=img.width;
                    w_g=img.width;
                    h_g=img.height;
                    ctx.drawImage(img,0,0);
                    console.log("try draw");
                    $.get("hello",{"type":"readXml","path":path},function (data) {
                        var xmlResponse = data;
                        console.log(xmlResponse);
                        praseXML(xmlResponse);
                    })
                }
                img.src = "data:image;base64,"+data;
            });
    }
}

function initVar() {   //initialize the variables
    editMode = false;
    oldX = new Array();
    oldY = new Array();
    newX = new Array();
    newY = new Array();
    enable = new Array();
    changed = false;
    label_g = new Array();
    label_num=0;
}

function clearCanvas() {
    for(var i=1;i<=label_num;i++) {
        var c = document.getElementById("canvas_"+i);
        var ctx = c.getContext("2d");
        ctx.clearRect(0,0,c.width,c.height);
    }
}

function deleteLabel() {

    var input = document.getElementById("input_label_num");
    var delete_label = input.value;
    if(delete_label>label_num){
        alert("请输入要删除的label编号");
        return;
    }
    enable[delete_label-1] = false;  //label_num begin with 1 but others begin with 0
    var c = document.getElementById("canvas_"+delete_label);
    var ctx = c.getContext("2d");
    ctx.clearRect(0,0,c.width,c.height);
    changed=true;
}