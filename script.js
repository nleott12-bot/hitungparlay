const rowsEl=document.getElementById('rows');
const statuses=[
 ['win','Menang Full'],['halfwin','Menang ½'],['halfloss','Kalah ½'],['loss','Kalah Full'],['draw','Seri']
];
const initial=[
 ['Manchester City vs Arsenal',1.85,'win'],
 ['Real Madrid vs Barcelona',1.70,'halfwin'],
 ['Bayern Munich vs Dortmund',1.45,'halfloss'],
 ['PSG vs Marseille',1.60,'loss'],
 ['AC Milan vs Inter Milan',1.55,'draw']
];

function statusOptions(selected){
 return statuses.map(([v,t])=>`<option value="${v}" ${v===selected?'selected':''}>${t}</option>`).join('');
}
function addRow(match='',odds=1.50,status='win'){
 const i=rowsEl.children.length+1;
 const row=document.createElement('div'); row.className='grid row';
 row.innerHTML=`
 <div class="num">${i}</div>
 <div><input class="match" value="${match.replaceAll('"','&quot;')}" placeholder="Nama pertandingan"></div>
 <div><input class="odds" type="number" min="1" step="0.01" value="${odds}"></div>
 <div class="status ${status}"><select class="result">${statusOptions(status)}</select></div>
 <div><input class="result-odds" readonly></div>
 <div><button class="delete" title="Hapus">♙</button></div>`;
 rowsEl.appendChild(row);
 row.querySelector('.result').addEventListener('change',e=>{
   row.className='grid row'; row.querySelector('.status').className='status '+e.target.value;
   calculate();
 });
 row.querySelector('.odds').addEventListener('input',calculate);
 row.querySelector('.delete').addEventListener('click',()=>{row.remove();renumber();calculate()});
 calculate();
}
function renumber(){[...rowsEl.children].forEach((r,i)=>r.querySelector('.num').textContent=i+1)}
function factor(row){
 const odds=Math.max(0,parseFloat(row.querySelector('.odds').value)||0);
 switch(row.querySelector('.result').value){
  case 'win': return odds;
  case 'halfwin': return (odds+1)/2;
  case 'halfloss': return .5;
  case 'loss': return 0;
  default: return 1;
 }
}
function calculate(){
 const rows=[...rowsEl.children];
 let total=1, hasLoss=false;
 rows.forEach(r=>{
   const f=factor(r); r.querySelector('.result-odds').value=f.toFixed(2);
   if(f===0)hasLoss=true; total*=f;
 });
 const stake=Math.max(0,parseFloat(document.getElementById('stake').value)||0);
 const payout=hasLoss?0:stake*total;
 const profit=payout-stake;
 document.getElementById('totalOdds').textContent=(rows.length?total:0).toFixed(3);
 document.getElementById('payout').textContent=money(payout);
 document.getElementById('profit').textContent=money(profit);
}
function money(n){return 'Rp '+Math.round(n).toLocaleString('id-ID')}
function toast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1800)}
initial.forEach(x=>addRow(...x));

document.getElementById('addBtn').onclick=()=>addRow();
document.getElementById('stake').oninput=calculate;
document.getElementById('minus').onclick=()=>{let x=+stake.value||0;stake.value=Math.max(0,x-10000);calculate()};
document.getElementById('plus').onclick=()=>{let x=+stake.value||0;stake.value=x+10000;calculate()};
document.querySelectorAll('.quick-buttons button').forEach(b=>b.onclick=()=>{
 document.getElementById('stake').value=b.dataset.stake;
 document.querySelectorAll('.quick-buttons button').forEach(x=>x.classList.remove('active'));b.classList.add('active');calculate();
});
document.getElementById('recalc').onclick=()=>{calculate();toast('Perhitungan diperbarui')};
document.getElementById('resetBtn').onclick=()=>{
 rowsEl.innerHTML='';initial.forEach(x=>addRow(...x));stake.value=100000;calculate();toast('Form di-reset');
};
document.getElementById('saveBtn').onclick=()=>{
 localStorage.setItem('castoto-data',JSON.stringify({stake:+stake.value,rows:[...rowsEl.children].map(r=>({
  match:r.querySelector('.match').value,odds:+r.querySelector('.odds').value,status:r.querySelector('.result').value
 }))}));
 toast('Data tersimpan di browser');
};
document.getElementById('historyBtn').onclick=()=>{
 const d=localStorage.getItem('castoto-data');
 if(!d){toast('Belum ada data tersimpan');return}
 const x=JSON.parse(d);toast(`Data tersimpan: ${x.rows.length} partai`);
};
document.getElementById('share').onclick=async()=>{
 const text=`CASTOTO MIX PARLAY\nTotal Odds: ${totalOdds.textContent}\nEstimasi Bayar: ${payout.textContent}\nProfit Bersih: ${profit.textContent}`;
 try{await navigator.clipboard.writeText(text);toast('Hasil disalin ke clipboard')}catch(e){toast('Hasil siap dibagikan')}
};
calculate();
