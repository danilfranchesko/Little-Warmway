(function(root){
  'use strict';
  function Renderer(canvas){this.canvas=canvas;this.ctx=canvas.getContext('2d');this.scale=1;this.ox=0;this.oy=0;this.width=0;this.height=0;this.reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;}
  Renderer.prototype.resize=function(){var r=this.canvas.getBoundingClientRect(),d=Math.min(window.devicePixelRatio||1,2);this.width=r.width;this.height=r.height;this.canvas.width=Math.round(r.width*d);this.canvas.height=Math.round(r.height*d);this.dpr=d;this.scale=Math.min(r.width/780,(r.height-65)/650);this.scale=Math.max(.1,this.scale);this.ox=(r.width-780*this.scale)/2;this.oy=(r.height-650*this.scale)/2+3;};
  Renderer.prototype.point=function(x,y){return {x:(x-this.ox)/this.scale,y:(y-this.oy)/this.scale};};
  Renderer.prototype.hit=function(level,x,y){var p=this.point(x,y),best=null,dist=Math.pow(Math.max(23/this.scale,26),2);level.nodes.forEach(function(n){var d=Math.pow(p.x-n.x,2)+Math.pow(p.y-n.y,2);if(d<dist){dist=d;best=n.id;}});return best;};
  function round(c,x,y,w,h,r,fill){c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath();c.fillStyle=fill;c.fill();}
  function circle(c,x,y,r,color){c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.fillStyle=color;c.fill();}
  function text(c,s,x,y,size,color,font){c.font=(font||'500')+' '+size+'px "Segoe UI",Arial,sans-serif';c.textAlign='center';c.fillStyle=color;c.fillText(s,x,y);}
  function glow(c,x,y,r,alpha){var g=c.createRadialGradient(x,y,1,x,y,r);g.addColorStop(0,'rgba(244,195,108,'+alpha+')');g.addColorStop(1,'rgba(244,195,108,0)');circle(c,x,y,r,g);}
  function tree(c,x,y,r){round(c,x-2,y,4,r+8,2,'#294448');circle(c,x+4,y+8,r,'#10292e');circle(c,x,y,r,'#35584f');circle(c,x-5,y-5,r*.75,'#42665a');circle(c,x-7,y-8,r*.45,'#4b7060');}
  function home(c,n,lit,t){var x=n.x,y=n.y,side=n.side;if(side==='left')x-=91;if(side==='right')x+=91;if(side==='top')y-=83;if(side==='bottom')y+=80;
    c.save();c.translate(x,y);if(lit)glow(c,0,6,89,.16);round(c,-34,-21,73,63,8,'#10282d');round(c,-37,-29,68,60,7,lit?'#b8aa87':'#76847a');round(c,-33,4,60,26,4,lit?'#d7bd8d':'#8b9181');c.fillStyle=lit?'#8a9e81':'#496c62';c.beginPath();c.moveTo(-46,-28);c.lineTo(-5,-59);c.lineTo(38,-28);c.closePath();c.fill();round(c,16,-49,9,17,2,'#5b7b6b');round(c,-8,8,14,22,3,'#304b48');[-23,16].forEach(function(wx){if(lit)glow(c,wx,-5,23,.26);round(c,wx-7,-14,14,18,3,lit?'#f6d991':'#263f42');c.fillStyle=lit?'#c49a5c':'#496159';c.fillRect(wx-.7,-14,1.4,18);});round(c,-17,31,34,4,2,'#3d5550');c.restore();
  }
  Renderer.prototype.draw=function(level,game,time){var c=this.ctx,w=this.width,h=this.height;c.setTransform(this.dpr,0,0,this.dpr,0,0);c.clearRect(0,0,w,h);var bg=c.createLinearGradient(0,0,w,h);bg.addColorStop(0,'#1c3940');bg.addColorStop(1,'#142c33');c.fillStyle=bg;c.fillRect(0,0,w,h);
    c.save();c.translate(this.ox,this.oy);c.scale(this.scale,this.scale);
    var t=this.reduced?0:time/1000;
    for(var i=0;i<78;i++){var sx=(i*137+17)%760,sy=(i*79+35)%640;circle(c,sx,sy,i%9===0?1.4:.65,'rgba(192,207,167,'+(i%4===0?.16:.06)+')');}
    c.strokeStyle='#2a474a';c.lineWidth=1;c.setLineDash([2,7]);round(c,154,112,475,440,43,'rgba(42,72,70,.13)');c.stroke();c.setLineDash([]);
    [[131,207,21],[124,249,16],[640,403,22],[659,437,17],[471,578,18],[506,590,13],[303,89,17],[343,81,13]].forEach(function(a){tree(c,a[0],a[1],a[2]);});
    // A tiny park: paths, shrubs, bench and pond are all procedural shapes.
    c.save();c.translate(321,254);c.rotate(-.15);round(c,-40,-29,80,55,25,'#26484a');round(c,-30,-21,60,38,19,'#2c5253');c.strokeStyle='#4a7270';c.lineWidth=1.5;c.beginPath();c.moveTo(-14,0);c.quadraticCurveTo(0,-5,16,0);c.stroke();c.restore();
    tree(c,458,416,19);tree(c,491,424,13);round(c,283,403,46,7,2,'#9a9070');round(c,283,413,46,7,2,'#837e63');round(c,289,419,4,7,1,'#50625b');round(c,319,419,4,7,1,'#50625b');
    [[294,364],[490,261],[450,276],[325,453],[598,251]].forEach(function(p,j){circle(c,p[0],p[1],3,'#a9986f');circle(c,p[0]+5,p[1]-2,2,'#797f65');});
    level.edges.forEach(function(e){var a=level.nodes[e[0]],b=level.nodes[e[1]];c.beginPath();c.moveTo(a.x,a.y);c.lineTo(b.x,b.y);c.lineCap='round';c.strokeStyle='#122b32';c.lineWidth=32;c.stroke();c.strokeStyle='#3a5354';c.lineWidth=24;c.stroke();c.strokeStyle='#61706a';c.lineWidth=1;c.setLineDash([3,10]);c.stroke();c.setLineDash([]);});
    var path=game.path;
    if(path.length>1){c.beginPath();c.moveTo(level.nodes[path[0]].x,level.nodes[path[0]].y);for(i=1;i<path.length;i++)c.lineTo(level.nodes[path[i]].x,level.nodes[path[i]].y);c.strokeStyle='#e8c785';c.lineWidth=4;c.lineJoin='round';c.lineCap='round';c.shadowColor='#edca83';c.shadowBlur=8;c.stroke();c.shadowBlur=0;
      for(i=1;i<path.length;i++){var a=level.nodes[path[i-1]],b=level.nodes[path[i]],angle=Math.atan2(b.y-a.y,b.x-a.x);c.save();c.translate((a.x+b.x)/2,(a.y+b.y)/2);c.rotate(angle);c.strokeStyle='#f7ddaa';c.lineWidth=2;c.beginPath();c.moveTo(-5,-4);c.lineTo(0,0);c.lineTo(-5,4);c.stroke();c.restore();}
    }
    level.nodes.forEach(function(n){if(n.type==='home'){var lit=game.state.lit.indexOf(n.id)>=0;home(c,n,lit,t);circle(c,n.x,n.y,10,'#203d42');circle(c,n.x,n.y,5,lit?'#f5d28a':'#99b7a6');}
      else if(n.type==='station'){var used=game.state.stations.indexOf(n.id)>=0;circle(c,n.x,n.y,26,'#142c32');circle(c,n.x,n.y,22,used?'#3c5555':'#88b8a3');if(!used){c.strokeStyle='#bad7b5';c.lineWidth=1;c.beginPath();c.arc(n.x,n.y,29+Math.sin(t*2)*1.5,0,Math.PI*2);c.stroke();}text(c,'ϟ',n.x,n.y+10,30,used?'#80958b':'#183b36','700');text(c,game.lang==='ru'?'ЗАРЯДКА':'CHARGING',n.x,n.y+49,10,used?'#6d8780':'#acd0b6');}
      else if(n.type==='depot'){round(c,n.x-32,n.y-26,64,52,11,'#44655d');round(c,n.x-27,n.y-21,54,42,8,'#24473f');text(c,game.lang==='ru'?'ДЕПО':'DEPOT',n.x,n.y+55,12,'#b5c7ad','600');}
      else{circle(c,n.x,n.y,8,'#263f44');circle(c,n.x,n.y,3,'#789489');}
    });
    var last=level.nodes[path[path.length-1]];
    if(game.mode==='planning'&&!(path.length>1&&last.id===0)){var pulse=this.reduced?0:Math.sin(t*3);c.strokeStyle='rgba(246,213,151,.6)';c.lineWidth=2;c.beginPath();c.arc(last.x,last.y,21+pulse*3,0,Math.PI*2);c.stroke();}
    var tram=game.tram||{x:level.nodes[0].x,y:level.nodes[0].y,angle:-Math.PI/2};
    c.save();c.translate(tram.x,tram.y);c.rotate(tram.angle);if(game.mode==='running'){glow(c,30,0,65,.16);}round(c,-23,-17,48,36,9,'#10282dcc');round(c,-25,-19,47,32,8,'#b9d6b9');round(c,-20,-15,36,24,5,'#83b29d');round(c,7,-12,9,18,3,'#294d48');round(c,-15,-10,15,15,3,'#dce4c8');c.fillStyle='#567d6a';c.fillRect(-8,-10,2,15);round(c,-15,8,26,3,1,'#5e8b77');circle(c,21,-8,2.5,'#f7d694');circle(c,21,6,2.5,'#f7d694');round(c,-19,-23,8,4,2,'#142f34');round(c,10,-23,8,4,2,'#142f34');round(c,-19,15,8,4,2,'#142f34');round(c,10,15,8,4,2,'#142f34');c.restore();
    if(game.mode==='won'){for(i=0;i<12;i++){var px=170+i*39,py=110+(i*91)%425;circle(c,px,py+Math.sin(t+i)*5,2,'rgba(246,218,151,.6)');}}
    c.restore();
  };
  root.WarmwayRenderer=Renderer;
}(window));
