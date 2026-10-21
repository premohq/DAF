/* Extensions injected on top of the live Ad Forge engine. Reuses its globals
   (st, render, header, priceCard, priceMetrics, font, cap, trk, trkW, rounded,
   fitPx, grade, scrims, drawEmbers, infernoBG, ez, sstep, COL) so every ad keeps
   the exact brand treatment, and adds:
   - a small gold caption over the price card ("2 FOR", "SALE", "FROM", "1 LITER")
   - a multi-product price-list layout (weekly deals) with animated rows */
(function(){
  window.EXT = {tag:''};
  const basePriceCard = window.priceCard;
  window.priceCard = function(c,rightX,midY,S,alpha,scale){
    basePriceCard(c,rightX,midY,S,alpha,scale);
    const tag=(EXT.tag||'').trim().toUpperCase();
    if(!tag||alpha<=0)return;
    const M=priceMetrics(c,S),y0=midY-M.h/2,cx=rightX-M.w/2;
    c.save();c.globalAlpha=alpha;
    c.font=font(26*S,'osw',700);c.textBaseline='alphabetic';
    const tr=6*S,w=trkW(c,tag,tr),ch=cap(c,'A'),base=y0-16*S;
    c.fillStyle=COL.GOLD;trk(c,cx-w/2,base,tag,tr);
    const ly=base-ch/2-1*S,lw=Math.min(46*S,(M.w-w)/2-14*S);
    if(lw>8*S){c.fillRect(cx-w/2-14*S-lw,ly,lw,2*S);c.fillRect(cx+w/2+14*S,ly,lw,2*S)}
    c.restore();
  };

  window.ROUND={bg:null,kicker:'',title:'',rows:[],foot:'21+ · PLEASE DRINK RESPONSIBLY · WHILE SUPPLIES LAST'};
  function pill(c,x,base,text,fill,txt,S,px){
    c.font=font(px*S,'osw',700);const ch=cap(c,'A'),tr=2.5*S,padX=11*S,padY=7*S;
    const w=trkW(c,text,tr)+padX*2,h=ch+padY*2,y=base-ch-padY;
    rounded(c,x,y,w,h,h/2);c.fillStyle=fill;c.fill();
    c.fillStyle=txt;trk(c,x+padX,base,text,tr);return w;
  }
  function price(c,rightX,base,r,S,k){
    /* Same typographic system as the Forge price card: gold $ + cents, bone Anton dollars */
    const p=64*S*k;
    c.font=font(p,'anton');const dW=c.measureText(r.dol).width,dCap=cap(c,'0');
    c.font=font(p*0.45,'osw',700);const sW=c.measureText('$').width,sCap=cap(c,'$'),ctW=c.measureText(r.cts).width;
    const gap=p*0.05;let x=rightX-(sW+dW+ctW+gap*2);
    const top=base-dCap;
    c.fillStyle=COL.GOLD;c.fillText('$',x,top+sCap+dCap*0.10);
    if(r.pre){c.save();c.font=font(24*S*k,'osw',700);const tw=trkW(c,r.pre,3*S);
      c.fillStyle=COL.GOLD;trk(c,x-tw-14*S*k,base-dCap*0.5+cap(c,'A')/2,r.pre,3*S);c.restore()}
    x+=sW+gap;c.font=font(p,'anton');c.fillStyle=COL.BONE;c.fillText(r.dol,x,base);x+=dW+gap;
    c.font=font(p*0.45,'osw',700);c.fillStyle=COL.GOLD;c.fillText(r.cts,x,top+sCap+dCap*0.04);
  }
  window.renderRoundup=function(c,W,H,o){
    o=o||{};const anim=!!o.anim,t=o.t||0,dur=o.dur||8;
    const S=Math.min(W,H)/1080,tall=H/W>1.5;
    c.setTransform(1,0,0,1,0,0);c.clearRect(0,0,W,H);
    if(ROUND.bg){const img=ROUND.bg,kb=anim?1+0.05*sstep(t/dur):1;
      const r=Math.max(W/img.width,H/img.height)*kb,dw=img.width*r,dh=img.height*r;
      c.drawImage(img,(W-dw)/2,(H-dh)/2,dw,dh);
      c.fillStyle='rgba(11,9,8,0.74)';c.fillRect(0,0,W,H);
    }else infernoBG(c,W,H);
    grade(c,W,H,anim?0.5+0.5*Math.sin(t*1.6):0.5);
    if(anim)drawEmbers(c,W,H,t);
    scrims(c,W,H);
    header(c,W,H,S,anim?ez(t,0,0.6):1,anim?ez(t,0.35,0.95):1);
    const mx=64*S;c.textAlign='left';c.textBaseline='alphabetic';
    /* title */
    const rvT=anim?ez(t,0.45,1.05):1;
    let y=(tall?250:178)*S;
    c.save();c.globalAlpha=rvT;c.translate(0,(1-rvT)*30*S);
    c.font=font((tall?32:27)*S,'osw',600);c.fillStyle=COL.GOLD;
    c.fillRect(mx,y-cap(c,'A')/2-9*S,14*S,17*S);
    trk(c,mx+28*S,y,ROUND.kicker,6*S);
    const tp=fitPx(c,ROUND.title,'anton',400,(tall?118:98)*S,W-2*mx,56*S);
    c.font=font(tp,'anton');c.fillStyle=COL.BONE;
    y+=18*S+cap(c,'A');c.fillText(ROUND.title,mx,y);
    c.restore();
    /* rows */
    const yStart=y+(tall?70:44)*S,yEnd=H-(tall?230:170)*S,n=ROUND.rows.length;
    const rowH=(yEnd-yStart)/n,k=Math.min(1.3,rowH/(106*S));
    c.save();c.globalAlpha=rvT*0.9;c.fillStyle='rgba(227,178,100,0.55)';c.fillRect(mx,yStart-2*S,W-2*mx,2*S);c.restore();
    ROUND.rows.forEach((r,i)=>{
      const rv=anim?ez(t,0.9+i*0.17,1.45+i*0.17):1;if(rv<=0)return;
      const top=yStart+i*rowH;
      c.save();c.globalAlpha=rv;c.translate((1-rv)*60*S,0);
      c.font=font(38*S*k,'osw',700);c.fillStyle=COL.BONE;
      const nm=r.name.toUpperCase(),nb=top+rowH*0.47;
      const nw=trkW(c,nm,1.5*S);trk(c,mx,nb,nm,1.5*S);
      if(r.pill){const gold=r.pill!=='NEW';
        pill(c,mx+nw+16*S,nb-2*S*k,r.pill,gold?COL.GOLD:COL.EMBER,gold?'#1d1206':COL.BONE,S,17*k)}
      c.font=font(24*S*k,'osw',500);c.fillStyle='#B9AC9F';
      trk(c,mx,top+rowH*0.80,r.detail.toUpperCase(),2*S);
      price(c,W-mx,top+rowH*0.72,r,S,k);
      c.fillStyle='rgba(227,178,100,0.20)';c.fillRect(mx,top+rowH-1*S,W-2*mx,1.5*S);
      c.restore();
    });
    /* footer */
    const rvF=anim?ez(t,2.5,3.1):1;
    if(rvF>0){c.save();c.globalAlpha=rvF;
      const addr=(st.addr||'').toUpperCase();
      c.font=font(19*S,'osw',500);c.fillStyle='#8F8378';
      trk(c,mx,H-(tall?150:118)*S,ROUND.foot,2.5*S);
      c.fillStyle=COL.EMBER;c.fillRect(mx,H-84*S+7*S,14*S,17*S);
      c.font=font(24*S,'osw',600);c.fillStyle='#C8BCB2';
      trk(c,mx+26*S,H-84*S+cap(c),addr,3*S);
      c.restore()}
  };
})();

/* Closing slide: centered Dante's lockup + address, for carousels and story sign-offs */
window.renderCloser=function(c,W,H,o){
  o=o||{};const anim=!!o.anim,t=anim?(o.t||0):3.2,dur=o.dur||6;
  const S=Math.min(W,H)/1080,cx=W/2;
  c.setTransform(1,0,0,1,0,0);c.clearRect(0,0,W,H);
  infernoBG(c,W,H);grade(c,W,H,anim?0.5+0.5*Math.sin(t*1.6):0.5);
  drawEmbers(c,W,H,t);
  const rv=k=>anim?ez(t,k,k+0.6):1;
  const midY=H*0.42;
  c.textBaseline='alphabetic';
  /* flame mark */
  let a=rv(0);c.save();c.globalAlpha=a;const fs=250*S;
  flame(c,cx-fs/2,midY-fs*1.12+(1-a)*30*S,fs);c.restore();
  /* wordmark */
  a=rv(0.35);c.save();c.globalAlpha=a;
  c.font=font(128*S,'zil',700);c.fillStyle=COL.BONE;
  let tr=14*S,w=trkW(c,"DANTE'S",tr);trk(c,cx-w/2,midY+cap(c,'D')*0.62,"DANTE'S",tr);
  c.font=font(38*S,'osw',600);c.fillStyle=COL.GOLD;tr=30*S;w=trkW(c,'LIQUORS',tr);
  trk(c,cx-w/2,midY+110*S,'LIQUORS',tr);c.restore();
  /* rule */
  a=rv(0.8);c.save();c.globalAlpha=a;c.fillStyle=COL.GOLD;
  const rw=220*S*a;c.fillRect(cx-rw/2,midY+160*S,rw,3*S);c.restore();
  /* address block */
  a=rv(1.1);c.save();c.globalAlpha=a;c.translate(0,(1-a)*24*S);
  const lines=ROUND.closer||[];let y=midY+272*S;
  lines.forEach((ln,i)=>{c.font=font(ln.px*S,ln.fam||'osw',ln.wt||600);c.fillStyle=ln.col||COL.BONE;
    const tr2=(ln.tr||2)*S,w2=trkW(c,ln.t,tr2);trk(c,cx-w2/2,y,ln.t,tr2);y+=ln.gap*S});
  c.restore();
  a=rv(1.6);c.save();c.globalAlpha=a;c.font=font(20*S,'osw',500);c.fillStyle='#8F8378';
  const ft='21+ · PLEASE DRINK RESPONSIBLY',fw=trkW(c,ft,3*S);trk(c,cx-fw/2,H-70*S,ft,3*S);c.restore();
};
