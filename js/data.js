/* =========================================================
   Medicinal Seed Atlas — nyelvfüggetlen adatréteg
   Itt nincs egyetlen lefordítandó mondat sem: csak számok,
   azonosítók és hivatkozások. A szövegek a js/lang/*.js-ben vannak.
   ========================================================= */

/* A nyelvi csomagok ide regisztrálják magukat. */
window.LANGS = window.LANGS || {};
function registerLanguage(code, pack){ window.LANGS[code] = pack; }

/* Mikor néztük át utoljára a tartalmat és a hivatkozásokat. */
var REVIEWED = '2026-07-29';

/* ---------------------------------------------------------
   Magok váza: id, szín, ikon, bizonyíték-szint, áztatási óra,
   biztonsági címkék. A név és minden szöveg a nyelvi fájlban.
   --------------------------------------------------------- */
var SEEDS=[
 {id:'mandula',      c:'#fbbf24', shape:'teardrop', tier:'eros',    h:10,   tags:['phytate','oxal']},
 {id:'dio',          c:'#38bdf8', shape:'brain',    tier:'eros',    h:5,    tags:['melato','phytate']},
 {id:'tokmag',       c:'#34d399', shape:'oval',     tier:'taperk',  h:4,    tags:['lowoxal','phytate']},
 {id:'chia',         c:'#a78bfa', shape:'gel',      tier:'kozepes', h:0.5,  tags:['choke','soakreq','fluid','anticoag']},
 {id:'len',          c:'#60a5fa', shape:'diagonal', tier:'eros',    h:null, tags:['grind','anticoag','goitro','fluid']},
 {id:'szezam',       c:'#e0c088', shape:'oval',     tier:'kozepes', h:4,    tags:['allergen','phytate','oxal']},
 {id:'napraforgo',   c:'#fde047', shape:'flower',   tier:'taperk',  h:4,    tags:['lowoxal','phytate']},
 {id:'kender',       c:'#4ade80', shape:'oval',     tier:'taperk',  h:null, tags:['lowoxal']},
 {id:'psyllium',     c:'#2dd4bf', shape:'husk',     tier:'eros',    h:null, tags:['fluid','hypogly']},
 {id:'gorogszena',   c:'#fb923c', shape:'oval',     tier:'kozepes', h:8,    tags:['hypogly','preg','anticoag']},
 {id:'bazsalikom',   c:'#818cf8', shape:'gel',      tier:'korai',   h:0.25, tags:['choke','soakreq','fluid']},
 {id:'feketekomeny', c:'#cbd5e1', shape:'oval',     tier:'korai',   h:null, tags:['hypogly','preg']},
 {id:'pisztacia',    c:'#bef264', shape:'oval',     tier:'kozepes', h:3,    tags:['melato','lowoxal']},
 {id:'kesudio',      c:'#fca5a5', shape:'brain',    tier:'kozepes', h:3,    tags:['oxal','phytate']},
 {id:'mak',          c:'#c4b5fd', shape:'dots',     tier:'taperk',  h:null, tags:['opiate','preg']}
];

/* ---------------------------------------------------------
   Tápérték 100 grammra — USDA FoodData Central.
   kcal, p = fehérje g, fat = zsír g, f = rost g, ala = omega-3 g,
   ásványi anyagok mg-ban (se = mikrogramm), por = napi adag grammban.
   null = nincs megbízható adat (nem nulla!).
   --------------------------------------------------------- */
var NUT={
 mandula:   {kcal:579,p:21.2,fat:49.9,f:12.5,ala:0.00, ca:269, mg:270,k:733, ph:481, fe:3.71, zn:3.12,cu:1.03,mn:2.18,se:4.1,  por:30},
 dio:       {kcal:654,p:15.2,fat:65.2,f:6.7, ala:9.08, ca:98,  mg:158,k:441, ph:346, fe:2.91, zn:3.09,cu:1.59,mn:3.41,se:4.9,  por:30},
 tokmag:    {kcal:559,p:30.2,fat:49.1,f:6.0, ala:0.12, ca:46,  mg:592,k:809, ph:1233,fe:8.82, zn:7.81,cu:1.34,mn:4.54,se:9.4,  por:30},
 chia:      {kcal:486,p:16.5,fat:30.7,f:34.4,ala:17.83,ca:631, mg:335,k:407, ph:860, fe:7.72, zn:4.58,cu:0.92,mn:2.72,se:55.2, por:15},
 len:       {kcal:534,p:18.3,fat:42.2,f:27.3,ala:22.81,ca:255, mg:392,k:813, ph:642, fe:5.73, zn:4.34,cu:1.22,mn:2.48,se:25.4, por:15},
 szezam:    {kcal:573,p:17.7,fat:49.7,f:11.8,ala:0.38, ca:975, mg:351,k:468, ph:629, fe:14.55,zn:7.75,cu:4.08,mn:2.46,se:34.4, por:15},
 napraforgo:{kcal:584,p:20.8,fat:51.5,f:8.6, ala:0.07, ca:78,  mg:325,k:645, ph:660, fe:5.25, zn:5.00,cu:1.83,mn:1.95,se:53.0, por:30},
 kender:    {kcal:553,p:31.6,fat:48.8,f:4.0, ala:8.68, ca:70,  mg:700,k:1200,ph:1650,fe:7.95, zn:9.90,cu:1.60,mn:7.60,se:null, por:30},
 psyllium:  {kcal:200,p:2.4, fat:0.6, f:85.0,ala:0.00, ca:null,mg:null,k:null,ph:null,fe:null,zn:null,cu:null,mn:null,se:null, por:10},
 gorogszena:{kcal:323,p:23.0,fat:6.4, f:24.6,ala:0.09, ca:176, mg:191,k:770, ph:296, fe:33.53,zn:2.50,cu:1.11,mn:1.23,se:6.3,  por:8},
 bazsalikom:{kcal:442,p:14.8,fat:13.8,f:22.6,ala:1.20, ca:1180,mg:310,k:690, ph:null,fe:5.50, zn:3.00,cu:null,mn:null,se:null, por:8},
 feketekomeny:{kcal:345,p:16.7,fat:28.0,f:9.5,ala:0.20,ca:570, mg:265,k:1180,ph:500, fe:10.50,zn:6.00,cu:1.00,mn:null,se:null, por:3},
 pisztacia: {kcal:560,p:20.2,fat:45.3,f:10.6,ala:0.25, ca:105, mg:121,k:1025,ph:490, fe:3.92, zn:2.20,cu:1.30,mn:1.20,se:7.0,  por:30},
 kesudio:   {kcal:553,p:18.2,fat:43.9,f:3.3, ala:0.16, ca:37,  mg:292,k:660, ph:593, fe:6.68, zn:5.78,cu:2.19,mn:1.66,se:19.9, por:30},
 mak:       {kcal:525,p:18.0,fat:41.6,f:19.5,ala:0.27, ca:1438,mg:347,k:719, ph:870, fe:9.76, zn:7.90,cu:1.63,mn:6.71,se:13.5, por:20}
};

/* Napi beviteli referenciaérték (FDA Daily Value, felnőtt) a %DV nézethez. */
var DV={kcal:2000,p:50,fat:78,f:28,ca:1300,mg:420,k:4700,ph:1250,fe:18,zn:11,cu:0.9,mn:2.3,se:55};

/* ---------------------------------------------------------
   Vizsgálatok — csak azonosítók és bibliográfia.
   Az egymondatos összefoglalók nyelvenként a lang-fájlokban,
   ugyanebben a sorrendben (findings[id][i] ↔ STUDIES[id][i]).
   ty: ma = metaanalízis, rct = randomizált, rev = áttekintés, na = nincs
   --------------------------------------------------------- */
var STUDIES={
 mandula:[{pmid:'40944180',doi:'10.3390/nu17172791',ty:'ma',y:2025,j:'Nutrients',
  t:'Blood Lipid Levels in Response to Almond Consumption: A Systematic Review and Meta-Analysis of Randomized Controlled Trials'}],
 dio:[{pmid:'29470389',doi:'10.3390/nu10020244',ty:'rct',y:2018,j:'Nutrients',
  t:'A Walnut-Enriched Diet Affects Gut Microbiome in Healthy Caucasian Subjects: A Randomized, Controlled Trial'}],
 tokmag:[{pmid:'34666728',doi:'10.1186/s12894-021-00910-8',ty:'rct',y:2021,j:'BMC Urology',
  t:'Pumpkin seed oil (Cucurbita pepo) versus tamsulosin for benign prostatic hyperplasia symptom relief: a single-blind randomized clinical trial'}],
 chia:[{pmid:'39285289',doi:'10.1186/s12986-024-00847-3',ty:'ma',y:2024,j:'Nutrition & Metabolism',
  t:'Effects of chia seed (Salvia hispanica L.) supplementation on cardiometabolic health in overweight subjects: a systematic review and meta-analysis of RCTs'},
  {pmid:'34378609',doi:'10.1039/d1fo01287h',ty:'ma',y:2021,j:'Food & Function',
  t:'Chia seed (Salvia hispanica L.) consumption and lipid profile: a systematic review and meta-analysis'}],
 len:[{pmid:'38663513',doi:'10.1016/j.prostaglandins.2024.106838',ty:'ma',y:2024,j:'Prostaglandins & Other Lipid Mediators',
  t:'Impact of flaxseed supplementation on lipid profile and liver enzymes in patients with non-alcoholic fatty liver disease: Systematic review and meta-analysis of randomized controlled trials'}],
 szezam:[{pmid:'35311241',doi:'10.3389/fendo.2022.842152',ty:'ma',y:2022,j:'Frontiers in Endocrinology',
  t:'The Effects of Sesamin Supplementation on Obesity, Blood Pressure, and Lipid Profile: A Systematic Review and Meta-Analysis of Randomized Controlled Trials'}],
 napraforgo:[{ty:'na'}],
 kender:[{pmid:'36112300',ty:'rev',y:2022,j:'PubMed',
  t:'Hempseed (Cannabis sativa) nutritional value, protein and fatty acid composition'}],
 psyllium:[{pmid:'37078654',doi:'10.1080/19490976.2023.2197837',ty:'rct',y:2023,j:'Gut Microbes',
  t:'Effects of dietary fibers or probiotics on functional constipation symptoms and roles of gut microbiota: a double-blinded randomized placebo trial'}],
 gorogszena:[{pmid:'36837450',doi:'10.3390/medicina59020248',ty:'ma',y:2023,j:'Medicina (Kaunas)',
  t:'Effect of Fenugreek on Hyperglycemia: A Systematic Review and Meta-Analysis'}],
 bazsalikom:[{ty:'na'}],
 feketekomeny:[{pmid:'39372205',doi:'10.3389/fphar.2024.1417013',ty:'ma',y:2024,j:'Frontiers in Pharmacology',
  t:'Meta-analysis of randomized controlled trials assessing the efficacy of Nigella spp. supplementation for allergic rhinitis treatment'}],
 pisztacia:[{pmid:'28432876',doi:'10.1016/j.jnutbio.2017.04.002',ty:'rct',y:2017,j:'Journal of Nutritional Biochemistry',
  t:'Effect of pistachio consumption on the modulation of urinary gut microbiota-related metabolites in prediabetic subjects'}],
 kesudio:[{pmid:'39692228',doi:'10.20960/nh.05241',ty:'rct',y:2025,j:'Nutrición Hospitalaria',
  t:'Effect of the consumption of cashew nut (Anacardium occidentale L.) flour-based biscuits in overweight children: a pilot randomized clinical trial'}],
 mak:[{ty:'na'}]
};
