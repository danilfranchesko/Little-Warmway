(function (root) {
  'use strict';
  function edgeKey(a,b) {return Math.min(a,b)+':'+Math.max(a,b);}
  function connection(level,a,b) {return level.edges.some(function(e){return e[0]===a&&e[1]===b||(!e[2]&&e[0]===b&&e[1]===a);});}
  function canAppend(level,path,id) {
    if (!Number.isInteger(id)||!level.nodes[id]) return 'invalid';
    if (path.length>1&&path[path.length-1]===level.depot) return 'closed';
    var last=path[path.length-1];
    if (!connection(level,last,id)) return 'neighbor';
    var key=edgeKey(last,id);
    for(var i=1;i<path.length;i++) if(edgeKey(path[i-1],path[i])===key) return 'used';
    return null;
  }
  function validPath(level,path) {
    if(!Array.isArray(path)||path[0]!==level.depot||path.length>level.edges.length+1) return false;
    var built=[level.depot];
    for(var i=1;i<path.length;i++){if(canAppend(level,built,path[i])) return false;built.push(path[i]);}
    return true;
  }
  function initial() {return {charge:3,lit:[],stations:[],error:null};}
  function arrive(level,state,id) {
    var s={charge:state.charge,lit:state.lit.slice(),stations:state.stations.slice(),error:state.error};
    if(s.error) return s;
    var node=level.nodes[id];
    if(node.type==='home'&&s.lit.indexOf(id)<0){if(!s.charge){s.error='empty';return s;}s.charge--;s.lit.push(id);}
    if(node.type==='station'&&s.stations.indexOf(id)<0){s.charge=3;s.stations.push(id);}
    return s;
  }
  function simulate(level,path) {
    var s=initial();
    if(!validPath(level,path)) {s.error='invalid';return s;}
    for(var i=1;i<path.length;i++){s=arrive(level,s,path[i]);if(s.error) return s;}
    s.won=path.length>1&&path[path.length-1]===level.depot&&s.lit.length===level.houses.length;
    if(!s.won) s.error='unfinished';
    return s;
  }
  var api={edgeKey:edgeKey,canAppend:canAppend,validPath:validPath,initial:initial,arrive:arrive,simulate:simulate};
  root.WarmwayCore=api;
  if(typeof module!=='undefined') module.exports=api;
}(typeof window!=='undefined'?window:globalThis));
