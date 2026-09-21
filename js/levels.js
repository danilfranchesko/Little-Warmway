(function (root) {
  'use strict';
  function level(id, houses, station, shortcuts, ru, en, copyRu, copyEn, solution) {
    var coords = [[220,490],[220,330],[220,170],[390,170],[560,170],[560,330],[560,490],[390,490]];
    var nodes = coords.map(function (p,i) { return {id:i,x:p[0],y:p[1],type:i===0?'depot':houses.indexOf(i)>=0?'home':'junction',side:i===1||i===2?'left':i===3?'top':i===5?'right':'bottom'}; });
    var edges = coords.map(function (_,i) { return [i,(i+1)%8]; });
    if (station) { nodes.push({id:8,x:390,y:330,type:'station'});edges.push([3,8],[8,5]); }
    if (shortcuts) edges.push([1,8],[8,7]);
    return {id:id,nodes:nodes,edges:edges,depot:0,houses:houses,ru:ru,en:en,copyRu:copyRu,copyEn:copyEn,solution:solution};
  }
  var levels = [
    level(1,[1,5],false,false,'Первые огни','The first lights','Два дома ждут свет. Проведите трамвай по тихой улице и вернитесь в депо.','Two homes are waiting for light. Take the tram around the quiet street and return to the depot.',[0,1,2,3,4,5,6,7,0]),
    level(2,[1,3,5],false,false,'Полный вагон света','A tram full of light','Три фонаря — три дома. Нарисуйте замкнутый маршрут, чтобы зажечь каждый.','Three charges, three homes. Draw a complete loop to light them all.',[0,1,2,3,4,5,6,7,0]),
    level(3,[1,3,5,7],true,true,'Ещё немного тепла','A little more warmth','Четыре дома, а зарядов только три. Включите зарядную остановку в свой маршрут.','Four homes, but only three charges. Include the charging stop in your route.',[0,1,2,3,8,5,6,7,0])
  ];
  root.WarmwayLevels = levels;
  if (typeof module !== 'undefined') module.exports = levels;
}(typeof window !== 'undefined' ? window : globalThis));
