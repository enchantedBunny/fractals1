var length = 700,
    width = 700,
    julia_c = [-0.52 , 0.5], 
    maxIterate = 300,
    canvas = null,
    status = 0;

function draw(pos, color){
    var c = 100*color;
    if (c>100)c = 100;
    var h= Math.floor((c/100) * 300 );
    var s = 1;
    var v = 1;
    var col = HSVtoRGB(h,s,v);
    if (color == 1)col = "#000000"   
    canvas.fillStyle=col;
    canvas.fillRect(pos[0], pos[1], 1, 1);
}


function mix(a, b, v)
{
    return (1-v)*a + v*b;
}

function HSVtoRGB(H, S, V)
{
    var V2 = V * (1 - S);
    var r  = ((H>=0 && H<=60) || (H>=300 && H<=360)) ? V : ((H>=120 && H<=240) ? V2 : ((H>=60 && H<=120) ? mix(V,V2,(H-60)/60) : ((H>=240 && H<=300) ? mix(V2,V,(H-240)/60) : 0)));
    var g  = (H>=60 && H<=180) ? V : ((H>=240 && H<=360) ? V2 : ((H>=0 && H<=60) ? mix(V2,V,H/60) : ((H>=180 && H<=240) ? mix(V,V2,(H-180)/60) : 0)));
    var b  = (H>=0 && H<=120) ? V2 : ((H>=180 && H<=300) ? V : ((H>=120 && H<=180) ? mix(V2,V,(H-120)/60) : ((H>=300 && H<=360) ? mix(V,V2,(H-300)/60) : 0)));
    r = Math.round(r * 255).toString(16);
    g = Math.round(g * 255).toString(16);
    b = Math.round(b * 255).toString(16);
    if (r.length == 1) r = '0'+r;
    if (g.length == 1) g = '0'+g;
    if (b.length == 1) b = '0'+b;
    return '#' +  r + g + b;
}
function convertCanvasToImage(canvas) {
	var image = new Image();
	image.src = canvas.toDataURL("image/png");
	return image;
}
function init(){
    
    var R = (Math.sqrt(1+4*Math.sqrt(julia_c[0]*julia_c[0] + julia_c[1]*julia_c[1]))),
        z, x, y, i;
    document.getElementById('julia-text').innerHTML = "Julia fractal with c = "+julia_c[0].toString() + " + " + julia_c[1].toString()+"i";
    canvas = document.getElementById('julia').getContext("2d");
    for (x = 0; x < width; x++){
        for (y = 0; y < length; y++){
            i = 0;
            z = [-2 + 4*x / width, -2 + 4* y / width];
            while (i < maxIterate && z[0]*z[0] + z[1]*z[1] < R*R){
                z = [z[0]*z[0] - z[1] * z[1] + julia_c[0], 2 * z[0] * z[1] + julia_c[1]];
                i++;
            }
            var col =  (8*i) / maxIterate;
            if (col>1)col = 1;
            draw([x, y],col);
        }
    }
    var img = convertCanvasToImage(canvas = document.getElementById('julia'));
    document.getElementById('dJulia').href = img.src.replace(/^data:image\/[^;]/, 'data:application/octet-stream');
    if(status==0){
    canvas = document.getElementById('mandelbrot').getContext("2d");
    for (x = 0; x < width; x++){
        for (y = 0; y < length; y++){
            var x2 = -2 + 4*x/width, y2 =  -2 + 4*y/length;
            
            i = 0;
            z = [x2,y2];
            var a = 0,b = 0;
            p = [a,b];
            while (i < maxIterate && p[0]*p[0] + p[1]*p[1] < 4){
                p =[p[0]*p[0] - p[1] * p[1] + z[0], 2 * p[0] * p[1] + z[1]]
                i++;
            }
            var col =  (4*i) / maxIterate;
            if (col>1)col = 1;
            draw([x, y],col);
        }
    }
     var img = convertCanvasToImage(canvas = document.getElementById('mandelbrot'));
    document.getElementById('dMandelbrot').href = img.src.replace(/^data:image\/[^;]/, 'data:application/octet-stream');
   
    document.getElementById('mandelbrot').addEventListener('click', function(event) {
        var left = document.getElementById('mandelbrot').offsetLeft;
        var top = document.getElementById('mandelbrot').offsetTop;
    var x = -2+4*(event.pageX - left)/700,
        y = 2-4*(event.pageY - top)/700;
    console.log("x " + x.toString()+" y " + y.toString());
    julia_c = [x,y];
    init();

}, false);
    }
    status=1;
}
