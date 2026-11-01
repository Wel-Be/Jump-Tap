(()=>{"use strict";const block=document.getElementById("questionBlock"),countEl=document.getElementById("tapCount"),volume=document.getElementById("volume"),bonus=document.getElementById("bonus"),error=document.getElementById("error");let count=0,timer=null;const coin="./coin-pickup-3.mp3",life="./extra-life-3.mp3";
function play(src){const a=new Audio(src);a.preload="auto";a.volume=Math.max(0,Math.min(1,+volume.value/100));a.play().catch(()=>error.hidden=false);a.addEventListener("ended",()=>{a.src=""},{once:true})}
function press(){block.classList.add("is-pressed");clearTimeout(timer);timer=setTimeout(()=>block.classList.remove("is-pressed"),100)}
function showBonus(){bonus.hidden=false;play(life);setTimeout(()=>bonus.hidden=true,900)}
block.addEventListener("click",()=>{press();count++;countEl.textContent=count;if(count===100)showBonus();else play(coin)});
if("serviceWorker"in navigator&&(location.protocol==="https:"||location.hostname==="localhost"))addEventListener("load",()=>navigator.serviceWorker.register("./service-worker.js").catch(console.warn));
})();