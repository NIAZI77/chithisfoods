import{u as N,n as R,aN as x,t as F,a3 as v,bo as I,q as V,r as g,bw as D,j as e,P as i,b as T,L as p,b7 as b,be as y,bX as L,bY as h}from"./strapi-B0YwOZlt.js";import{u as _}from"./useOnce-NHeEacbN-D1Hn6mKp.js";import{c as U,d as B}from"./transferTokens-DRhm3E2K-Df6NBm28.js";import{T as o}from"./constants-CRj0ViV1-Q2dfXdfa.js";import{T as H}from"./Table-tIZ8sJm6-CG4EprR4.js";const Y=[{name:"name",label:{id:"Settings.tokens.ListView.headers.name",defaultMessage:"Name"},sortable:!0},{name:"description",label:{id:"Settings.tokens.ListView.headers.description",defaultMessage:"Description"},sortable:!1},{name:"createdAt",label:{id:"Settings.tokens.ListView.headers.createdAt",defaultMessage:"Created at"},sortable:!1},{name:"lastUsedAt",label:{id:"Settings.tokens.ListView.headers.lastUsedAt",defaultMessage:"Last used"},sortable:!1}],O=()=>{const{formatMessage:s}=N(),{toggleNotification:a}=R(),j=x(n=>n.admin_app.permissions.settings?.["transfer-tokens"]),{isLoading:A,allowedActions:{canCreate:d,canDelete:w,canUpdate:S,canRead:l}}=F(j),u=v(),{trackUsage:r}=I(),{_unstableFormatAPIError:c}=V();g.useEffect(()=>{u({search:D.stringify({sort:"name:ASC"},{encode:!1})})},[u]),_(()=>{r("willAccessTokenList",{tokenType:o})});const M=Y.map(n=>({...n,label:s(n.label)})),{data:t=[],isLoading:E,error:f}=U(void 0,{skip:!l});g.useEffect(()=>{t&&r("didAccessTokenList",{number:t.length,tokenType:o})},[r,t]),g.useEffect(()=>{f&&a({type:"danger",message:c(f)})},[f,c,a]);const[P]=B(),C=async n=>{try{const k=await P(n);"error"in k&&a({type:"danger",message:c(k.error)})}catch{a({type:"danger",message:s({id:"notification.error",defaultMessage:"An error occured"})})}},m=E||A;return e.jsxs(e.Fragment,{children:[e.jsx(i.Title,{children:s({id:"Settings.PageTitle",defaultMessage:"Settings - {name}"},{name:"Transfer Tokens"})}),e.jsx(T.Header,{title:s({id:"Settings.transferTokens.title",defaultMessage:"Transfer Tokens"}),subtitle:s({id:"Settings.transferTokens.description",defaultMessage:'"List of generated transfer tokens"'}),primaryAction:d?e.jsx(p,{role:"button",tag:b,"data-testid":"create-transfer-token-button",startIcon:e.jsx(y,{}),size:"S",onClick:()=>r("willAddTokenFromList",{tokenType:o}),to:"/settings/transfer-tokens/create",children:s({id:"Settings.transferTokens.create",defaultMessage:"Create new Transfer Token"})}):void 0}),l?e.jsx(i.Main,{"aria-busy":m,children:e.jsxs(T.Content,{children:[t.length>0&&e.jsx(H,{permissions:{canRead:l,canDelete:w,canUpdate:S},headers:M,isLoading:m,onConfirmDelete:C,tokens:t,tokenType:o}),d&&t.length===0?e.jsx(L,{action:e.jsx(p,{tag:b,variant:"secondary",startIcon:e.jsx(y,{}),to:"/settings/transfer-tokens/create",children:s({id:"Settings.transferTokens.addNewToken",defaultMessage:"Add new Transfer Token"})}),icon:e.jsx(h,{width:"16rem"}),content:s({id:"Settings.transferTokens.addFirstToken",defaultMessage:"Add your first Transfer Token"})}):null,!d&&t.length===0?e.jsx(L,{icon:e.jsx(h,{width:"16rem"}),content:s({id:"Settings.transferTokens.emptyStateLayout",defaultMessage:"You don’t have any content yet..."})}):null]})}):e.jsx(i.NoPermissions,{})]})},K=()=>{const s=x(a=>a.admin_app.permissions.settings?.["transfer-tokens"].main);return e.jsx(i.Protect,{permissions:s,children:e.jsx(O,{})})};export{O as ListView,K as ProtectedListView};
