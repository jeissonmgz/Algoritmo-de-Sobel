  var canvas = document.getElementById("micanvas");
var ctx = canvas.getContext("2d");
var img = new Image();
img.src = "123.jpg";
//ctx.drawImage(img, 0, 0);


function RGBA(){
	//Atributos de la clase
	this.r;
	this.g;
	this.b;
	this.a;
	//Métodos GET
	this.getR=function(){
		return this.r;};
	this.getG=function(){
		return this.g;};
	this.getB=function(){
		return this.b;};
	this.getA=function(){
		return this.a;};
	//Métodos SET
	this.setR=function(n){
		this.r=n;};
	this.setG=function(n){
		this.g=n;};
	this.setB=function(n){
		this.b=n;};
	this.setA=function(n){
		this.a=n;};
	this.set=function(x,y,z,w){
		this.r=x;
		this.g=y;
		this.b=z;
		this.a=w;};
	//Pasar a escala grises
	this.toGris=function(){
		var escalagris=this.r* .3 + this.g * .59 + this.b * .11;
		this.r=escalagris;
		this.g=escalagris;
		this.b=escalagris;};
	//Blanco y Negro
	this.toWab=function(umbral){
		var wab=0;
		if(this.r>umbral||this.g>umbral||this.b>umbral)
			wab=255;
		this.r=wab;
		this.g=wab;
		this.b=wab;};
	//Invertir
	this.invertir=function(umbral){
		this.r=255-this.r;
		this.g=255-this.g;
		this.b=255-this.b;};
}

//Matriz RGBA
function matrizRGBA(){
	this.m;//matriz
	this.copia=function(){
		var copy=new Array(this.m.length);
		for (var i=0;i<this.m.length;i++){
			copy[i]=new Array(this.m[i].length);
			for (var j=0;j<this.m[i].length;j++){
				copy[i][j]=new RGBA();
				copy[i][j].set(this.m[i][j].getR(),this.m[i][j].getG(),this.m[i][j].getB(),this.m[i][j].getA());}}
		return copy;
		};
	this.cargar=function(mat,f,c){
		this.m=new Array(f);
		for (var i=0;i<this.m.length;i++){
			this.m[i]=new Array(c);//Porque un x4 aqui????? se esta desperdiciando espacio
			for (var j=0;j<this.m[i].length;j++){
				this.m[i][j]=new RGBA();
				var pos=(i*this.m[i].length+j)*4;
				this.m[i][j].set(mat[pos],mat[pos+1],mat[pos+2],mat[pos+3]);
				}}};
	this.mostrar=function(mat){
		for (var i=0;i<this.m.length;i++)
			for (var j=0;j<this.m[i].length;j++){
				var pos=(i*this.m[i].length+j)*4;//Deberia ser: (i*this.m[i].length+j)*4;
				mat.data[pos]=this.m[i][j].getR();
				mat.data[pos+1]=this.m[i][j].getG();
				mat.data[pos+2]=this.m[i][j].getB();
				mat.data[pos+3]=this.m[i][j].getA();}};
	this.toGris=function(m){
		for (var i=0;i<m.length;i++)
		for (var j=0;j<m[i].length;j++)
			m[i][j].toGris();
		};
	this.sobel=function(){
		var sobel_x= new Array(-1,0,1,-2,0,2,-1,0,1);
		var sobel_y= new Array(1,2,1,0,0,0,-1,-2,-1);
		var copy=this.copia();//Pasa por referncia,hay que copiar
		this.toGris(copy);
		for (var i=1;i<this.m.length-1;i++)
			for (var j=1;j<this.m[i].length-1;j++){
                var pixel_x = 	(sobel_x[0] * copy[i-1][j-1].getR()) + (sobel_x[1] * copy[i-1][j].getR()) + (sobel_x[2] * copy[i-1][j+1].getR()) +
								(sobel_x[3] * copy[i][j-1].getR()  ) + (sobel_x[4] * copy[i][j].getR()  ) + (sobel_x[5] * copy[i][j+1].getR()  ) +
								(sobel_x[6] * copy[i+1][j-1].getR()) + (sobel_x[7] * copy[i+1][j].getR()) + (sobel_x[8] * copy[i+1][j+1].getR());
				
				var pixel_y = (sobel_y[0] * copy[i-1][j-1].getR()) + (sobel_y[1] * copy[i-1][j].getR()) + (sobel_y[2] * copy[i-1][j+1].getR()) +
                    (sobel_y[3] * copy[i][j-1].getR())   + (sobel_y[4] * copy[i][j].getR())   + (sobel_y[5] * copy[i][j+1].getR()) +
                    (sobel_y[6] * copy[i+1][j-1].getR()) + (sobel_y[7] * copy[i+1][j].getR()) + (sobel_y[8] * copy[i+1][j+1].getR());
				var val = parseInt(Math.sqrt((pixel_x * pixel_x) + (pixel_y * pixel_y)));
				if(val > 127){
					val = 0;}
				else{
					val = 255;
				}
				this.m[i][j].setR(val);
				this.m[i][j].setG(val);
				this.m[i][j].setB(val);
				}
		};
	this.doConvolution=function(){
		
	};
	this.getM=function(){
		return this.m;
	};
}
img.onload = function(){
  ctx.drawImage(img, 0, 0);
  var imgData=ctx.getImageData(0,0,canvas.width, canvas.height);
  var matriz=new matrizRGBA();
  matriz.cargar(imgData.data,canvas.height,canvas.width);
  matriz.sobel();
  matriz.mostrar(imgData);
  ctx.putImageData(imgData,0,0);
  
  
	//Escala de grises
	/*
  for (var i=0;i<imgData.data.length;i+=4)
    {
	var grayscale = imgData.data[i  ] * .3 + imgData.data[i+1] * .59 + imgData.data[i+2] * .11;
    imgData.data[i]=grayscale;//R
	imgData.data[i+1]=grayscale;//G
	imgData.data[i+2]=grayscale;//B
    //imgData.data[i]=0;
    //imgData.data[i+1]=0;
    
    //imgData.data[i+3]=255;
    }
  ctx.putImageData(imgData,0,0);
	
	//Blanco y Negro
	/*var umbral = 127;
	
	for (var i=0;i<imgData.data.length;i+=4)
    {
	var wab=0;
	if(imgData.data[i]>umbral||imgData.data[i+1]>umbral||imgData.data[i+2]>umbral)
		wab=255;
	imgData.data[i]=wab;
    imgData.data[i+1]=wab;
    imgData.data[i+2]=wab;
    
    //imgData.data[i+3]=255;
    }*/
	
	//Deteccion de bordes
	/*
	var sobel_x= new Array(-1,0,1,-2,0,2,-1,0,1);
    var sobel_y= new Array(1,2,1,0,0,0,-1,-2,-1);
    var pixel_x;
    var pixel_y;

	var w = canvas.width;
    var h = canvas.height; 
        var copy=ctx.getImageData(0,0,w,h).data;
		
for (var x=4; x < w*4-8; x++) {
            for (var y=4; y < h-8; y++) {
			
			var pos=x*h+y*4;
                pixel_x = (sobel_x[0] * copy[pos-16]) + (sobel_x[1] * copy[pos-12]) + (sobel_x[2] * copy[pos-8]) +
                    (sobel_x[3] * copy[pos-4])   + (sobel_x[4] * copy[pos])   + (sobel_x[5] * copy[pos+4]) +
                    (sobel_x[6] * copy[pos+8]) + (sobel_x[7] * copy[pos+12]) + (sobel_x[8] * copy[pos+16]);
			
                pixel_y = (sobel_y[0] * copy[pos-16]) + (sobel_y[1] * copy[pos-12]) + (sobel_y[2] * copy[pos-8]) +
                    (sobel_y[3] * copy[pos-4])   + (sobel_y[4] * copy[pos])   + (sobel_y[5] * copy[pos+4]) +
                    (sobel_y[6] * copy[pos+8]) + (sobel_y[7] * copy[pos+12]) + (sobel_y[8] * copy[pos+16]);
              
                var val = parseInt(Math.sqrt((pixel_x * pixel_x) + (pixel_y * pixel_y)));

                if(val < 0)
                {
                   val = 0;
                }

                if(val > 255)
                {
                   val = 255;
                }

				pos+=32;
                imgData.data[pos]=val;
    imgData.data[pos+1]=val;
    imgData.data[pos+2]=val;
            
		
			}
        }
		
	
  ctx.putImageData(imgData,0,0);
  
 
  // invert colors
  /*
  for (var i=0;i<imgData.data.length;i+=4)
    {
    imgData.data[i]=255-imgData.data[i];
    imgData.data[i+1]=255-imgData.data[i+1];
    imgData.data[i+2]=255-imgData.data[i+2];
    imgData.data[i+3]=255;
    }
  ctx.putImageData(imgData,0,0);*/
}
  