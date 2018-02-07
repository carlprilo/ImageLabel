var editMode = false;
var oldX = new Array();
var oldY = new Array();
var newX = new Array();
var newY = new Array();
var pure_name_g;
var changed = false;
var w_g; //image width
var h_g;  //image height
var label_g = new Array();
var label_num=0;
var xml_content=null;

function checkMouse(ev) {
    if (!editMode)
        return

    oldX.push(ev.offsetX);
    oldY.push(ev.offsetY);
}

function draw(ev) {
    if(!editMode)
        return

    newX.push(ev.offsetX);
    newY.push(ev.offsetY);
    var canvas = document.getElementById("canvas_"+label_num);
    var ctx = canvas.getContext('2d');
    ctx.strokeRect(oldX[oldY.length-1],oldY[label_num-1],newX[label_num -1]-oldX[label_num-1],newY[label_num-1]-oldY[label_num-1]);
    changed=true;
}

function draw_rect(name,xmin,ymin,xmax,ymax) {
    var canvas = document.getElementById("canvas_"+label_num);
    var ctx = canvas.getContext('2d');
    ctx.strokeStyle = "orange";
    ctx.strokeRect(xmin,ymin,xmax-xmin,ymax-ymin);
    console.log(name.toString());
    ctx.fillText(name.toString(),xmin+1,ymin+5,50);
}

var result = document.getElementById("result");
var file = document.getElementById("file");

//判断浏览器是否支持FileReader接口
if(typeof FileReader == 'undefined')  {
    result.InnerHTML = "<p>你的浏览器不支持FileReader接口！</p>";
    //使选择控件不可操作
    file.setAttribute("disabled", "disabled"); //使得之前操作失效，重新启动
}

function readAsDataURL() {
    //检验是否为图像文件
    var file = document.getElementById("file").files[0];
    console.log("image name:"+file.name);
    var pure_file = file.name.split(".");
    console.log("pure file name:"+pure_file[0]);
    pure_name_g=pure_file[0];
    if(!/image\/\w+/.test(file.type)) {
        alert("这不是图片文件！请检查！");
        return false;
    }
    var url = window.URL.createObjectURL(file);

    var c = document.getElementById("main_canvas");
    var ctx = c.getContext("2d");

    var img =new Image();
    img.onload = function () {
        c.height=img.height;
        c.width=img.width;
        w_g=img.width;
        h_g=img.height;
        ctx.drawImage(img,0,0);
    }
    img.src = url;

    changed=false;
}

function readFilelist() {
    console.log("read many files!");
}
function openDialog() {
    document.getElementById("file").click();
}

function openDialogMulti() {
    document.getElementById("files").click();
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
    base_div.appendChild(new_div);
}

function hideDraw() {
    for(var i=1;i<=label_num;i++) {
        var sub_c = document.getElementById("canvas_"+i);
        sub_c.hidden=true;
    }
}

function showDraw() {
   var test = oldX+oldY+newY+newX;
   if(test>0){
       for(var i=1;i<=label_num;i++) {
       var sub_c = document.getElementById("canvas_"+i);
       sub_c.hidden=false;
       }
   }
    else
        alert("没有绘制");
}

function praseXML() {
    if (window.XMLHttpRequest)
    {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp=new XMLHttpRequest();
    }
    else
    {// code for IE6, IE5
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }

    var file = document.getElementById("xml_input").files[0];
    var url = window.URL.createObjectURL(file);
    console.log("xml name:"+file.name);
    var pure_name = file.name.split(".");
    console.log("xml pure name:"+pure_name[0]);
    xmlhttp.open("GET",url,false);
    xmlhttp.send();
    xmlDoc=xmlhttp.responseXML;

    var label_name=xmlDoc.getElementsByTagName("name")[0].childNodes[0].nodeValue;
    var x_min=xmlDoc.getElementsByTagName("xmin")[0].childNodes[0].nodeValue;
    var y_min=xmlDoc.getElementsByTagName("ymin")[0].childNodes[0].nodeValue;
    var x_max=xmlDoc.getElementsByTagName("xmax")[0].childNodes[0].nodeValue;
    var y_max=xmlDoc.getElementsByTagName("ymax")[0].childNodes[0].nodeValue;
    oldX.push(x_min);
    oldY.push(y_min);
    newX.push(x_max);
    newY.push(y_max);
    label_g.push(label_name);
    //label_g=label_name;
    changeEditMode();
    addLabelWithName(label_name);
    draw_rect(label_name,x_min,y_min,x_max,y_max);
    changeEditMode();
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

            var name = xmldoc.createElement("name");
            var nameTxt = xmldoc.createTextNode(label_g.pop());
            name.appendChild(nameTxt);
            var box = xmldoc.createElement("box");
            var xmin = xmldoc.createElement("xmin");
            var xminTxt = xmldoc.createTextNode(oldX.pop().toString());
            var xmax = xmldoc.createElement("xmax");
            var xmaxTxt = xmldoc.createTextNode(newX.pop().toString());
            var ymin = xmldoc.createElement("ymin");
            var yminTxt = xmldoc.createTextNode(oldY.pop().toString());
            var ymax = xmldoc.createElement("ymax");
            var ymaxTxt = xmldoc.createTextNode(newY.pop().toString());
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
    ctx_sub.strokeRect(oldX[label_num-1],oldY[label_num-1],10,20);
    ctx_sub.fillText(label_g[label_num-1],newX[label_num-1]+5*label_num,oldY[label_num-1],50);
}

function setLabel() {

    var canvas = document.getElementById("canvas_"+label_num);
    console.log(label_num);
    console.log(label_g);
    console.log(newX[label_num-1]+" "+oldY[label_num-1]);
    var ctx_sub = canvas.getContext('2d');
    ctx_sub.font="24px serif";
    ctx_sub.strokeRect(oldX,oldY,10,20);
    ctx_sub.fillText(label_g,newX[label_num-1]+5*label_num,oldY[label_num-1],50);
}

function addLabelWithName(name) {
    var canvas = document.getElementById("canvas_"+label_num);
    var ctx_sub = canvas.getContext('2d');
    ctx_sub.font="24px serif";
   // ctx_sub.strokeRect(oldX,oldY,10,20);
    ctx_sub.strokeText(name,newX[label_num-1]+5*label_num,oldY[label_num-1]);
}

function getTest()
{
    console.log("touch head");
    var xmlhttp;
    if (window.XMLHttpRequest)
    {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp=new XMLHttpRequest();
    }
    else
    {// code for IE6, IE5
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.open("GET","/hello",true);
    xmlhttp.send("xml=apple");
    console.log("touch here\n");
}

function setXMLtoJava() {
    console.log("set xml to java");
    // var xmlhttp;
    // if (window.XMLHttpRequest)
    // {// code for IE7+, Firefox, Chrome, Opera, Safari
    //     xmlhttp=new XMLHttpRequest();
    // }
    // else
    // {// code for IE6, IE5
    //     xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    // }
    // xmlhttp.open("GET","/hello",true);
    // xmlhttp.setRequestHeader("Content-type","post_request")
    // var content = "xml="+xml_content;
    // xmlhttp.send(content);

    $.post("hello",{"xml":xml_content});
}