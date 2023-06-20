"use strict";(self.webpackChunkreactjs=self.webpackChunkreactjs||[]).push([[501],{78701:function(e,t,n){var a=n(11304);t.Z=function(e,t){var n=(0,a.D)()(e,t),r=t.inputValue;return""===r||n.some((function(e){return e.name===r}))||(n.push({type:"clients",name:"ADD CLIENT: ".concat(r),newValue:!0}),n.push({type:"projects",name:"ADD PROJECT: ".concat(r),newValue:!0})),n}},69278:function(e,t,n){var a=n(74165),r=n(37762),i=n(15861),s=n(59286),o=n(13778),c=n(6185);function d(){return(d=(0,i.Z)((0,a.Z)().mark((function e(t,n,i){var d,u,l,p,f,h;return(0,a.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:i(JSON.stringify(t.raw)),d=[],u=[],l=(0,r.Z)(t.tags),e.prev=4,l.s();case 6:if((p=l.n()).done){e.next=19;break}if(!(f=p.value).newValue){e.next=16;break}return e.next=11,s.Z.post("CRUD/tags/",{name:f.name,billable:f.billable,user:localStorage.getItem("user_id")?localStorage.getItem("user_id"):sessionStorage.getItem("user_id")}).then((function(e){return e.data})).catch((function(e){if("Invalid token header. No credentials provided."===e.response.data.detail)return e.response.data.requestData.data}));case 11:h=e.sent,u.push(h.id),d.push(h),e.next=17;break;case 16:u.push(f.id);case 17:e.next=6;break;case 19:e.next=24;break;case 21:e.prev=21,e.t0=e.catch(4),l.e(e.t0);case 24:return e.prev=24,l.f(),e.finish(24);case 27:n(u),0!==d.length&&(o.Z.dispatch((0,c._U)(d)),t.updateTags(d));case 29:case"end":return e.stop()}}),e,null,[[4,21,24,27]])})))).apply(this,arguments)}t.Z=function(e,t,n){return d.apply(this,arguments)}},30606:function(e,t,n){var a=n(13778),r=n(2214),i=n(59286);t.Z=function(e){i.Z.get("clientProjectGet/").then((function(t){a.Z.dispatch((0,r.jm)(t.data)),e(!1)})).catch((function(t){console.error(t.response),"Invalid token header. No credentials provided."===t.response.data.detail&&(a.Z.dispatch((0,r.jm)(t.response.data.requestData.data)),e(!1))}))}},33005:function(e,t,n){var a=n(13778),r=n(6185),i=n(59286);t.Z=function(e){i.Z.get("CRUD/tags/").then((function(t){a.Z.dispatch((0,r.me)(t.data)),e(!1)})).catch((function(t){console.log(t),"Invalid token header. No credentials provided."===t.response.data.detail&&(a.Z.dispatch((0,r.me)(t.response.data.requestData.data)),e(!1))}))}},13152:function(e,t,n){var a=n(74165),r=n(15861),i=n(59286),s=n(13778),o=n(2214);function c(){return(c=(0,r.Z)((0,a.Z)().mark((function e(t){var n;return(0,a.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(n=t,!0!==t.newValue){e.next=11;break}if("clients"!==t.type){e.next=8;break}return e.next=5,i.Z.post("CRUD/clients/",{name:t.name.slice(12),user:localStorage.getItem("user_id")?localStorage.getItem("user_id"):sessionStorage.getItem("user_id")}).then((function(e){return s.Z.dispatch((0,o.tO)(e.data)),e.data})).catch((function(e){if("Invalid token header. No credentials provided."===e.response.data.detail)return s.Z.dispatch((0,o.tO)(e.response.data.requestData.data)),e.response.data.requestData.data}));case 5:n=e.sent,e.next=11;break;case 8:return e.next=10,i.Z.post("CRUD/projects/",{name:t.name.slice(13),user:localStorage.getItem("user_id")?localStorage.getItem("user_id"):sessionStorage.getItem("user_id")}).then((function(e){return s.Z.dispatch((0,o.tO)(e.data)),e.data})).catch((function(e){if("Invalid token header. No credentials provided."===e.response.data.detail)return s.Z.dispatch((0,o.tO)(e.response.data.requestData.data)),e.response.data.requestData.data}));case 10:n=e.sent;case 11:return e.abrupt("return",n);case 12:case"end":return e.stop()}}),e)})))).apply(this,arguments)}t.Z=function(e){return c.apply(this,arguments)}},6501:function(e,t,n){n.r(t);var a=n(74165),r=n(1413),i=n(15861),s=n(70885),o=n(72791),c=n(16871),d=n(59286),u=n(40260),l=n(93385),p=n(82646),f=n(20376),h=n(1428),Z=n(36612),x=n(94070),v=n(1688),g=n(36151),j=n(56125),m=n(61889),y=n(13400),C=n(34385),D=n(10703),k=n(47047),w=n(53767),I=n(8093),S=n(20890),b=n(36571),L=n(5457),O=n(78701),N=n(69278),E=n(99357),R=n(46508),q=n(13152),A=n(30606),P=n(33005),T=n(60364),_=n(10466),U=n(4708),F=n(73700),V=n(80184);t.default=function(){var e=(0,c.UO)().id,t=(0,c.s0)(),n=(0,T.I0)(),M="LOG ID "+e,B=(0,o.useState)(null),J=(0,s.Z)(B,2),z=J[0],G=J[1],H=(0,T.v9)((function(e){return e.CPData.value})),W=(0,T.v9)((function(e){return e.tags.value})),K=(0,o.useState)(!0),Q=(0,s.Z)(K,2),X=Q[0],Y=Q[1],$=(0,o.useState)(!(H.length>0)),ee=(0,s.Z)($,2),te=ee[0],ne=ee[1],ae=(0,o.useState)(!(W.length>0)),re=(0,s.Z)(ae,2),ie=re[0],se=re[1],oe=(0,o.useState)(),ce=(0,s.Z)(oe,2),de=ce[0],ue=ce[1],le=(0,o.useState)([]),pe=(0,s.Z)(le,2),fe=pe[0],he=pe[1],Ze=(0,o.useState)(),xe=(0,s.Z)(Ze,2),ve=xe[0],ge=xe[1],je=(0,o.useState)(null),me=(0,s.Z)(je,2),ye=me[0],Ce=me[1],De=(0,o.useState)(),ke=(0,s.Z)(De,2),we=ke[0],Ie=ke[1],Se=(0,o.useState)(F.ou.now()),be=(0,s.Z)(Se,2),Le=be[0],Oe=be[1],Ne=(0,o.useState)(null),Ee=(0,s.Z)(Ne,2),Re=Ee[0],qe=Ee[1],Ae=(0,o.useState)(!1),Pe=(0,s.Z)(Ae,2),Te=Pe[0],_e=Pe[1],Ue=(0,o.useState)(!1),Fe=(0,s.Z)(Ue,2),Ve=Fe[0],Me=Fe[1];function Be(){return(Be=(0,i.Z)((0,a.Z)().mark((function r(i){var s,o,c;return(0,a.Z)().wrap((function(a){for(;;)switch(a.prev=a.next){case 0:return i.preventDefault(),a.next=3,(0,q.Z)(ye);case 3:s=a.sent,o={},ve!==z.time&&(o.time=ve),Le.toFormat("yyyy-LL-dd")!==z.date&&(o.date=Le.toFormat("yyyy-LL-dd")),de!==z.descriptionRaw&&(o.descriptionRaw=de,o.tags=fe),"clients"===s.type&&s.id!==z.client?o.client=s.id:"projects"===s.type&&s.id!==z.project&&(o.project=s.id),Object.keys(o).length>0?(c="CRUD/logs/"+e+"/",d.Z.patch(c,o).then((function(e){n((0,_.Hw)(e.data)),t("/dashboard")})).catch((function(e){"Invalid token header. No credentials provided."===e.response.data.detail&&(n((0,_.Hw)(e.response.data.requestData.data)),t("/dashboard"))}))):_e(!0);case 10:case"end":return a.stop()}}),r)})))).apply(this,arguments)}function Je(e){e.preventDefault(),qe(Le),Me(!Ve)}return(0,o.useEffect)((function(){var t="CRUD/logs/"+e+"/";d.Z.get(t).then((function(e){G(e.data),Y(!1),ge(e.data.time),Oe(F.ou.fromFormat(e.data.date,"yyyy-LL-dd"))})).catch((function(e){"Invalid token header. No credentials provided."===e.response.data.detail&&(G(e.response.data.requestData.data),Y(!1),ge(e.response.data.requestData.data.time),Oe(F.ou.fromFormat(e.response.data.requestData.data.date,"yyyy-LL-dd")))}))}),[]),(0,o.useEffect)((function(){!0===te&&(0,A.Z)(ne)}),[]),(0,o.useEffect)((function(){ie&&(0,P.Z)(se)}),[]),(0,o.useEffect)((function(){if(H.length>0&&null!=z&&null==ye)if(z.client){var e=H.find((function(e){return e.id===z.client&&"clients"===e.type}));Ce(e)}else{var t=H.find((function(e){return e.id===z.project&&"projects"===e.type}));Ce(t)}}),[H,z]),X||te||ie?(0,V.jsx)(k.Z,{}):(0,V.jsxs)("div",{children:[(0,V.jsx)(U.ZP,{}),(0,V.jsx)(R.Z,{}),(0,V.jsxs)(D.Z,{style:{margin:"1rem 1rem 0rem",padding:"1rem"},children:[(0,V.jsxs)(w.Z,{direction:"column",spacing:2,justifyContent:"center",children:[(0,V.jsx)(S.Z,{variant:"h6",align:"center",width:"100%",children:M}),(0,V.jsxs)(w.Z,{direction:"row",justifyContent:"center",spacing:2,children:[(0,V.jsx)(y.Z,{"aria-label":"delete",onClick:function(e){e.preventDefault(),Oe(Le.plus({days:-1}))},children:(0,V.jsx)(u.Z,{})}),(0,V.jsx)(g.Z,{variant:"contained",onClick:Je,endIcon:(0,V.jsx)(f.Z,{}),children:Le.toFormat("dd/MM/yyyy")}),(0,V.jsx)(y.Z,{"aria-label":"delete",onClick:function(e){e.preventDefault(),Oe(Le.plus({days:1}))},children:(0,V.jsx)(l.Z,{})})]}),(0,V.jsxs)(m.ZP,{container:!0,widt:"100%",children:[(0,V.jsx)(m.ZP,{item:!0,xs:3,padding:1,height:"72px",children:(0,V.jsx)(I.Z,{id:"duration",label:"DURATION",variant:"outlined",sx:{width:"100%"},onChange:function(e){e.target.value!==ve&&ge(e.target.value)},value:ve})}),(0,V.jsx)(m.ZP,{item:!0,xs:3,padding:1,height:"72px",children:(0,V.jsx)(v.Z,{id:"CP",options:H,getOptionLabel:function(e){return e.name},groupBy:function(e){return e.type},sx:{width:"100%"},filterOptions:O.Z,renderInput:function(e){return(0,V.jsx)(I.Z,(0,r.Z)((0,r.Z)({},e),{},{label:"CLIENT OR PROJECT",variant:"outlined"}))},onChange:function(e,t){Ce(t)},value:ye,onInputChange:function(e,t){Ie(t)},inputValue:we})}),(0,V.jsx)(m.ZP,{item:!0,xs:!0,padding:1,height:"72px",children:(0,V.jsx)(E.Z,{empty:!1,tags:W,data:function(e){(0,N.Z)(e,he,ue)},clear:null,intialField:z.descriptionRaw,readOnly:!1})})]}),(0,V.jsxs)(w.Z,{direction:"row",spacing:2,justifyContent:"flex-end",children:[(0,V.jsx)(g.Z,{variant:"contained",onClick:function(e){e.preventDefault();try{t(-1)}catch(n){t("/")}},startIcon:(0,V.jsx)(p.Z,{}),children:"CANCEL"}),(0,V.jsx)(g.Z,{variant:"contained",onClick:function(e){return Be.apply(this,arguments)},startIcon:(0,V.jsx)(h.Z,{}),children:"UPDATE"})]})]}),(0,V.jsx)(j.Z,{orientation:"vertical",in:Te,sx:{width:"40%"},children:(0,V.jsx)(x.Z,{severity:"error",children:"No fields changed"})}),(0,V.jsx)(C.Z,{open:Ve,onClose:Je,children:(0,V.jsxs)(D.Z,{sx:{padding:"0.5rem",position:"absolute",top:"50%",left:"50%",transform:"translate(-50%, -50%)"},children:[(0,V.jsx)(S.Z,{variant:"h6",align:"center",margin:"0.5rem",children:"SELECT A DATE"}),(0,V.jsx)(b._,{dateAdapter:Z.Z,children:(0,V.jsx)(L.w,{displayStaticWrapperAs:"desktop",openTo:"day",value:Re,onChange:function(e){e!==Le&&qe(e)},renderInput:function(e){return(0,V.jsx)(I.Z,(0,r.Z)({},e))}})}),(0,V.jsxs)(w.Z,{direction:"row",spacing:1,justifyContent:"flex-end",marginTop:"0.5rem",children:[(0,V.jsx)(g.Z,{variant:"text",onClick:function(){Me(!Ve)},sx:{color:"#3181CB"},children:"CANCEL"}),(0,V.jsx)(g.Z,{variant:"text",onClick:function(){Oe(Re),Me(!Ve)},sx:{color:"#3181CB"},children:"CONFIRM"})]})]})})]})]})}},82646:function(e,t,n){var a=n(95318);t.Z=void 0;var r=a(n(45649)),i=n(80184),s=(0,r.default)((0,i.jsx)("path",{d:"m14 7-5 5 5 5V7z"}),"ArrowLeft");t.Z=s},1428:function(e,t,n){var a=n(95318);t.Z=void 0;var r=a(n(45649)),i=n(80184),s=(0,r.default)((0,i.jsx)("path",{d:"M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"}),"Done");t.Z=s}}]);
//# sourceMappingURL=501.6fee0f9c.chunk.js.map