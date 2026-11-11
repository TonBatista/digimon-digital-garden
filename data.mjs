export const STARTERS={
 Agumon:{type:'Vacina',element:'Fogo',color:'#ffbf53',description:'Um pequeno dinossauro de grande coração. Força e coragem para qualquer aventura.',stats:{strength:34,defense:26,spirit:20,wisdom:22,speed:24},line:['Greymon','MetalGreymon','WarGreymon']},
 Renamon:{type:'Dados',element:'Luz',color:'#ffe68a',description:'Ágil, serena e misteriosa. Sua inteligência transforma energia em poder.',stats:{strength:22,defense:20,spirit:36,wisdom:30,speed:30},line:['Kyubimon','Taomon','Sakuyamon']},
 Guilmon:{type:'Vírus',element:'Fogo',color:'#ff8275',description:'Curioso, brincalhão e cheio de energia. Um amigo leal com um poder enorme.',stats:{strength:32,defense:30,spirit:24,wisdom:20,speed:22},line:['Growlmon','WarGrowlmon','Gallantmon']}
};
export const STAT_NAMES={strength:'Força',defense:'Defesa',spirit:'Espírito',wisdom:'Sabedoria',speed:'Velocidade',fire:'Fogo',water:'Água',ice:'Gelo',wind:'Vento',lightning:'Raio',machine:'Máquina',dark:'Trevas'};
export const FORM_INFO={
 Agumon:['Rookie','Fogo',1],Renamon:['Rookie','Luz',1],Guilmon:['Rookie','Fogo',1],
 Greymon:['Champion','Fogo',1.3],MetalGreymon:['Ultimate','Máquina',1.7],WarGreymon:['Mega','Fogo',2.2],
 Kyubimon:['Champion','Fogo',1.3],Taomon:['Ultimate','Luz',1.7],Sakuyamon:['Mega','Luz',2.2],
 Growlmon:['Champion','Fogo',1.3],WarGrowlmon:['Ultimate','Máquina',1.7],Gallantmon:['Mega','Luz',2.2],
 Stingmon:['Champion','Vento',1.35],Angewomon:['Ultimate','Luz',1.75],Rosemon:['Mega','Planta',2.2],
 MetalMamemon:['Ultimate','Máquina',1.65],MetalGarurumon:['Mega','Gelo',2.2],SkullGreymon:['Ultimate','Trevas',1.85],BlackWarGreymon:['Mega','Trevas',2.3],Omnimon:['Mega','Luz',2.8],Angemon:['Champion','Luz',1.35],MagnaAngemon:['Ultimate','Luz',1.7],Seraphimon:['Mega','Luz',2.2],ExVeemon:['Champion','Vento',1.35],Paildramon:['Ultimate','Máquina',1.8],Imperialdramon:['Mega','Fogo',2.3]
};
// Natural World 3 levels, plus selected canonical cross-evolution paths.
export function evolutionRules(starter){
 const base=STARTERS[starter].line.map((name,i)=>({name,level:[5,20,40][i]}));
 const paths={
 Agumon:[['Growlmon','Greymon',20],['SkullGreymon','Greymon',50,'dark',130],['BlackWarGreymon','SkullGreymon',99],['Kyubimon','MetalGreymon',20,'spirit',300],['Taomon','Kyubimon',40],['Sakuyamon','Taomon',99],['WarGrowlmon','Growlmon',40,null,0,15],['Gallantmon','WarGrowlmon',99],['MetalMamemon','WarGreymon',10],['MetalGarurumon','MetalMamemon',40],['Stingmon','WarGreymon',30,'speed',260]],
 Renamon:[['Stingmon','Kyubimon',20,'strength',80],['Angewomon','Kyubimon',30,'spirit',160],['Rosemon','Angewomon',40,null,0,15],['Growlmon','Stingmon',20,'defense',80],['WarGrowlmon','Growlmon',40,null,0,25],['Gallantmon','WarGrowlmon',99],['MetalMamemon','Taomon',30,'machine',100],['MetalGarurumon','MetalMamemon',40,'machine',120],['ExVeemon','Taomon',20,'wind',120],['Angemon','Sakuyamon',30,'wind',150],['MagnaAngemon','Angemon',50],['Seraphimon','MagnaAngemon',99]],
 Guilmon:[['MetalMamemon','Growlmon',20,'defense',100],['MetalGarurumon','MetalMamemon',40,'machine',190],['Stingmon','Growlmon',30,'lightning',80],['Angemon','WarGrowlmon',20,'spirit',180],['MagnaAngemon','Angemon',50],['Seraphimon','MagnaAngemon',99],['Angewomon','WarGrowlmon',40,'water',140],['Rosemon','Angewomon',40],['Greymon','Gallantmon',30,'fire',280],['MetalGreymon','Greymon',40],['WarGreymon','MetalGreymon',99],['ExVeemon','Gallantmon',20,'wind',300]]
 };
 base.push(...paths[starter].map(([name,from,skill,stat,value,level])=>({name,from,skill,stat,value,level})));
 if(starter!=='Agumon') base.push({name:'Paildramon',from:'ExVeemon',skill:5,second:'Stingmon',secondSkill:5},{name:'Imperialdramon',from:'Paildramon',skill:50});
 if(starter!=='Renamon') base.push({name:'Omnimon',from:'WarGreymon',skill:40,second:'MetalGarurumon',secondSkill:40});
 return base;
}
export const FOOD={meat:{name:'Carne',price:15,hunger:32,energy:2,icon:'meat'},fish:{name:'Peixe',price:30,hunger:46,energy:8,icon:'fish'},fruit:{name:'Digi-fruta',price:10,hunger:20,energy:5,icon:'fruit'}};
export const KEY='digimon-digital-garden-v1';
