const qs=(s,r=document)=>r.querySelector(s), qsa=(s,r=document)=>[...r.querySelectorAll(s)];
const menu=qs('.menu-btn'), nav=qs('.nav-links');
if(menu&&nav){menu.addEventListener('click',()=>nav.classList.toggle('open'));qsa('.nav-links a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')))}
qsa('[data-year]').forEach(x=>x.textContent=new Date().getFullYear());
function waUrl(message){return 'https://wa.me/6285111228756?text='+encodeURIComponent(message)}
qsa('.wa-link').forEach(a=>{const m=a.dataset.message;if(m)a.href=waUrl(m)});

// Diagnostic engine
const shell=qs('.diagnostic-shell');
if(shell){
 const data={problem:'',stage:'',location:'',building:'',docs:''};
 const labels={
  business:'Perizinan Berusaha / OSS',spatial:'KKPR / PKKPR / Tata Ruang',environment:'Persetujuan Lingkungan',building:'PBG / SLF / Bangunan',traffic:'Andalalin',audit:'Audit Kepatuhan Menyeluruh',other:'Belum Tahu / Lainnya',
  new:'Usaha / proyek baru',existing:'Usaha sudah berjalan',expansion:'Ekspansi / perubahan',acquisition:'Akuisisi / due diligence',
  rdtr:'RDTR/KKPR sudah ada',unknown:'Belum tahu status tata ruang',issue:'Ada kendala tata ruang',multi:'Lebih dari satu lokasi',
  none:'Belum ada bangunan',planned:'Akan membangun',existok:'Bangunan existing + izin ada',existgap:'Bangunan existing + izin belum lengkap',
  complete:'Dokumen relatif lengkap',partial:'Dokumen sebagian',minimal:'Hanya NIB / dokumen dasar',unclear:'Belum tahu dokumen apa yang ada'
 };
 const showStep=n=>{qsa('.diag-step',shell).forEach(x=>x.classList.toggle('active',Number(x.dataset.step)===n));const b=qs('#diagBar');if(b)b.style.width=(n*20)+'%';};
 qsa('[data-diag-key]',shell).forEach(btn=>btn.addEventListener('click',()=>{
   const key=btn.dataset.diagKey;data[key]=btn.dataset.value;
   const next=Number(btn.closest('.diag-step').dataset.step)+1;
   if(next<=5) showStep(next); else renderResult();
 }));
 function renderResult(){
   qsa('.diag-step',shell).forEach(x=>x.classList.remove('active'));
   const bar=qs('#diagBar');if(bar)bar.style.width='100%';
   const box=qs('#diagResult');box.classList.add('show');
   let title='Perlu Regulatory Review Awal',priority='MENENGAH',action='Document + Status Review',service='Initial Licensing Assessment',text='Kondisi usaha perlu dipetakan terhadap legalitas badan usaha, kegiatan/KBLI, lokasi, lingkungan, bangunan dan izin teknis sebelum menentukan urutan pekerjaan.';
   if(data.problem==='business'){title='Indikasi Kebutuhan Review OSS & Perizinan Berusaha';priority=data.stage==='existing'?'TINGGI':'MENENGAH';action='NIB + KBLI + Risk + PB/PB UMKU';service='Perizinan Berusaha';text='Prioritaskan pemeriksaan KBLI, tingkat risiko, status Sertifikat Standar/PB, PB UMKU, serta kesesuaian data OSS dengan kegiatan aktual.';}
   if(data.problem==='spatial'||data.location==='issue'){title='Indikasi Kebutuhan Review Tata Ruang / KKPR';priority='TINGGI';action='Koordinat + RDTR/RTRW + KKPR';service='KKPR / PKKPR';text='Lokasi dan kegiatan perlu diuji terhadap RDTR/RTRW, zonasi, koordinat/polygon, jenis KKPR dan ketentuan daerah sebelum langkah lanjutan.';}
   if(data.problem==='environment'){title='Indikasi Kebutuhan Screening Lingkungan';priority=data.stage==='existing'?'TINGGI':'MENENGAH';action='KBLI + Kapasitas + Lokasi + Dokumen LH';service='Persetujuan Lingkungan';text='Penapisan AMDAL/UKL-UPL/SPPL tidak cukup hanya dari NIB; perlu melihat jenis, skala, kapasitas, lokasi, kegiatan pendukung dan perubahan kegiatan.';}
   if(data.problem==='building'||data.building==='existgap'){title='Indikasi Gap Legalitas Bangunan';priority='TINGGI';action='Kondisi Aktual + PBG + SLF';service='PBG / SLF';text='Bandingkan fungsi, luas, jumlah lantai, siteplan dan kondisi aktual dengan PBG/IMB lama, dokumen teknis serta SLF.';}
   if(data.problem==='traffic'){title='Perlu Screening Kewajiban Andalalin';priority='MENENGAH';action='Jenis Kegiatan + Luas/Kapasitas + Akses';service='Andalalin';text='Kewajiban dan bentuk dokumen Andalalin ditentukan menurut jenis rencana pembangunan, skala/bangkitan serta kewenangan jalan dan ketentuan teknis yang berlaku.';}
   if(data.problem==='audit'||data.stage==='acquisition'){title='Disarankan Audit Kepatuhan Perizinan Menyeluruh';priority='TINGGI';action='Business + Spatial + Environment + Building';service='Regulatory Due Diligence';text='Untuk transaksi, investasi atau perusahaan existing, review harus mencakup OSS, lokasi, lingkungan, bangunan, perizinan teknis dan kewajiban pasca izin.';}
   if(data.docs==='minimal'||data.docs==='unclear') action+=' + Gap Mapping';
   qs('#resultTitle').textContent=title;qs('#resultText').textContent=text;qs('#resultPriority').textContent=priority;qs('#resultAction').textContent=action;qs('#resultService').textContent=service;
   const summary=`Halo LCI, saya sudah mengisi Licensing Diagnostic.\n\nMasalah utama: ${labels[data.problem]||data.problem}\nTahap usaha: ${labels[data.stage]||data.stage}\nStatus lokasi: ${labels[data.location]||data.location}\nKondisi bangunan: ${labels[data.building]||data.building}\nKelengkapan dokumen: ${labels[data.docs]||data.docs}\n\nHasil awal: ${title}\nPrioritas: ${priority}\nLayanan: ${service}\n\nMohon assessment lebih lanjut.`;
   const wa=qs('#diagWa');wa.href=waUrl(summary);
 }
 const restart=qs('#diagRestart');if(restart)restart.addEventListener('click',()=>{Object.keys(data).forEach(k=>data[k]='');qs('#diagResult').classList.remove('show');showStep(1)});
}

// Assessment to WhatsApp
const form=qs('#assessmentForm');
if(form){form.addEventListener('submit',e=>{e.preventDefault();const fd=new FormData(form);const g=n=>(fd.get(n)||'-').toString().trim();const msg=`Halo LCI, saya ingin mengirim Client Assessment Perizinan.\n\nNama: ${g('nama')}\nPerusahaan: ${g('perusahaan')}\nNo. HP: ${g('hp')}\nEmail: ${g('email')}\nLokasi proyek: ${g('lokasi')}\nJenis usaha / KBLI: ${g('usaha')}\nKebutuhan utama: ${g('layanan')}\nStatus NIB/OSS: ${g('oss')}\nStatus KKPR/Tata Ruang: ${g('kkpr')}\nStatus Lingkungan: ${g('lingkungan')}\nStatus PBG/SLF: ${g('bangunan')}\nAndalalin: ${g('andalalin')}\n\nUraian masalah:\n${g('masalah')}\n\nMohon tim LCI melakukan review awal.`;window.open(waUrl(msg),'_blank','noopener')})}
