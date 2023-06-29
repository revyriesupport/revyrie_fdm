import{d as k,_ as b,a as w,r as m,s as C,c as s,b as c,F as y,e as v,t as i,f as g,w as _,u as D,o as r,n as S}from"./global-template.js";const M=k({id:"product",state:()=>({isLoading:!1,error:null,media:[],activeColor:null}),actions:{setActiveColor(e){this.activeColor=e},setAllProductMedia(e){this.media=e}}}),P=M,$=w({name:"product-hero",props:{shopifyData:{type:Object,required:!0}},setup(e){const{variant_id:n,options:d}=e.shopifyData,l=P(),u=m({Color:d[0].values[0]});let p=m(!1);function t(o,a){a.name==="Color"&&l.setActiveColor(C(o))}return{product:l,errorMessage:p,selectedOptions:u,slugify:C,changeOption:t,handleClick:async o=>{if(o.preventDefault(),!n)return;await D().addToCart({id:n,quantity:1}).then(h=>{console.log("res",h)})}}}}),O={key:0},x={class:"swatches-container"},A=["onClick"],B={key:0,class:"text-md mt-2 text-error"},q=["textContent"];function F(e,n,d,l,u,p){return e.shopifyData?(r(),s("div",O,[c("div",x,[(r(!0),s(y,null,v(e.shopifyData.options,(t,f)=>(r(),s("div",{key:f},[c("p",null,i(t.name),1),(r(!0),s(y,null,v(t.values,(o,a)=>(r(),s("button",{key:a,class:S(["swatch mr-5 p-4",[e.product.activeColor===e.slugify(o)?"bg-black text-white":"bg-grey"]]),onClick:h=>e.changeOption(o,t)},i(o),11,A))),128))]))),128))]),e.errorMessage?(r(),s("p",B,i(e.errorMessage),1)):g("v-if",!0),c("button",{type:"button",onClick:n[0]||(n[0]=_((...t)=>e.handleClick&&e.handleClick(...t),["prevent"])),class:"mt-10 block w-full transform rounded-3xl bg-black px-4 py-3 text-center font-medium text-white transition-colors duration-300 focus:outline-none",textContent:i(e.window.variantStrings.addToCart)},null,8,q)])):g("v-if",!0)}const L=b($,[["render",F],["__file","/Users/latiosaxe/code/myntr/base-theme-2023/src/vue/components/render/ProductHero.vue"]]);export{L as default};
