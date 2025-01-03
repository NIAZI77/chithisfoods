import{ct as I,bn as v,n as z,u as O,q,fa as R,fc as G,r as S,fd as U,j as u,P as h,fe as T}from"./strapi-B0YwOZlt.js";import{C as $,T as w}from"./Form-DLMSoXV7-BKH3JcrD.js";import{u as Q}from"./hooks-E5u1mcgM-oiAAOzeH.js";import{s as k}from"./objects-D6yBsdmx-B1REW_Ch.js";import"./useDragAndDrop-DdHgKsqq-D1JsDSFk.js";import"./ComponentIcon-u4bIXTFY-DAKs7qhL.js";import"./FieldTypeIcon-CMlNO8PE-ABDsp_WF.js";import"./getEmptyImage-CjqolaH3.js";const B=I.injectEndpoints({endpoints:e=>({getComponentConfiguration:e.query({query:t=>`/content-manager/components/${t}/configuration`,transformResponse:t=>t.data,providesTags:(t,o,s)=>[{type:"ComponentConfiguration",id:s}]}),updateComponentConfiguration:e.mutation({query:({uid:t,...o})=>({url:`/content-manager/components/${t}/configuration`,method:"PUT",data:o}),transformResponse:t=>t.data,invalidatesTags:(t,o,{uid:s})=>[{type:"ComponentConfiguration",id:s},{type:"ContentTypeSettings",id:"LIST"}]})})}),{useGetComponentConfigurationQuery:D,useUpdateComponentConfigurationMutation:H}=B,K=()=>{const{slug:e}=v(),{toggleNotification:t}=z(),{formatMessage:o}=O(),{_unstableFormatAPIError:s}=q(),{components:f,fieldSizes:E,schema:r,error:i,isLoading:d,isFetching:F}=R(void 0,{selectFromResult:a=>{const y=a.data?.components.find(n=>n.uid===e),C=a.data?.components.reduce((n,c)=>(n[c.uid]=c,n),{}),p=G(y?.attributes,C),m=Object.entries(a.data?.fieldSizes??{}).reduce((n,[c,{default:j}])=>(n[c]=j,n),{});return{isFetching:a.isFetching,isLoading:a.isLoading,error:a.error,components:p,schema:y,fieldSizes:m}}});S.useEffect(()=>{i&&t({type:"danger",message:s(i)})},[i,s,t]);const{data:g,isLoading:x,isFetching:M,error:l}=D(e??"");S.useEffect(()=>{l&&t({type:"danger",message:s(l)})},[l,s,t]);const _=x||d||M||F,b=S.useMemo(()=>g&&!_?V(g,{schema:r,components:f}):{layout:[],components:{},metadatas:{},options:{},settings:U},[g,_,r,f]),[P]=H(),A=async a=>{try{const y=Object.entries(g?.component.metadatas??{}).reduce((p,[m,{edit:n,list:c}])=>{const{__temp_key__:j,size:J,name:W,...N}=a.layout.flatMap(L=>L.children).find(L=>L.name===m)??{};return p[m]={edit:{...n,...N},list:c},p},{}),C=await P({layouts:{edit:a.layout.map(p=>p.children.reduce((m,{name:n,size:c})=>n!==w?[...m,{name:n,size:c}]:m,[])),list:g?.component.layouts.list},settings:k(a.settings,"displayName",void 0),metadatas:y,uid:e});"data"in C?t({type:"success",message:o({id:"notification.success.saved",defaultMessage:"Saved"})}):t({type:"danger",message:s(C.error)})}catch{t({type:"danger",message:o({id:"notification.error",defaultMessage:"An error occurred"})})}};return _?u.jsx(h.Loading,{}):l||i||!r?u.jsx(h.Error,{}):u.jsxs(u.Fragment,{children:[u.jsx(h.Title,{children:`Configure ${b.settings.displayName} Edit View`}),u.jsx($,{onSubmit:A,attributes:r.attributes,fieldSizes:E,layout:b})]})},V=(e,{schema:t,components:o})=>{const s=T(e.component.layouts.edit,t?.attributes,e.component.metadatas,{configurations:e.components,schemas:o}),f=Object.entries(e.components).reduce((r,[i,d])=>(r[i]={layout:T(d.layouts.edit,o[i].attributes,d.metadatas),settings:{...d.settings,icon:o[i].info.icon,displayName:o[i].info.displayName}},r),{}),E=Object.entries(e.component.metadatas).reduce((r,[i,d])=>({...r,[i]:d.edit}),{});return{layout:[s],components:f,metadatas:E,options:{...t?.options,...t?.pluginOptions},settings:{...e.component.settings,displayName:t?.info.displayName}}},it=()=>{const e=Q(t=>t.admin_app.permissions.contentManager?.componentsConfigurations);return u.jsx(h.Protect,{permissions:e,children:u.jsx(K,{})})};export{K as ComponentConfigurationPage,it as ProtectedComponentConfigurationPage};
